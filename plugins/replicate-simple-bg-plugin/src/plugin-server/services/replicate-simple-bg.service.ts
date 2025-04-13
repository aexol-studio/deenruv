import {
  AssetService,
  Logger,
  RequestContext,
  ID,
  TransactionalConnection,
  ListQueryOptions,
  PaginatedList,
  ListQueryBuilder,
  Product,
  ProductTranslation,
} from "@deenruv/core";
import { Inject, Injectable } from "@nestjs/common";
import { ReplicateSimpleBGOptions } from "../types.js";
import {
  REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS,
  LOGGER_CTX,
} from "../constants.js";
import {
  StartGenerateSimpleBGInput,
  AssignPredictionToProductInput,
} from "../graphql/generated-admin-types.js";
import { ReplicateSimpleBgEntity } from "../entities/replicate-simple-gb.js";
import axios from "axios";
import { PredictionSimpleBgStatus } from "../zeus/index.js";
import fs from "fs";
import path from "path";
import { mkdtemp, rm } from "fs/promises";
import {
  DEFAULT_ROOM_TYPE,
  DEFAULT_ROOM_THEME,
  DEFAULT_PROMPT,
  DEFAULT_NEGATIVE_PROMPT,
} from "../constants.js";

@Injectable()
export class ReplicateSimpleBGService {
  private readonly assetURL: string;

  constructor(
    @Inject(REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS)
    private readonly options: ReplicateSimpleBGOptions,
    @Inject(TransactionalConnection)
    private readonly connection: TransactionalConnection,
    @Inject(AssetService) private readonly assetService: AssetService,
    @Inject(ListQueryBuilder)
    private readonly listQueryBuilder: ListQueryBuilder,
  ) {
    if (!this.options.envs) {
      throw new Error("Replicate: options not set");
    }
    if (!this.options.envs["apiToken"]) {
      throw new Error("Replicate: apiToken not set");
    }
    if (!this.options.envs["deploymentName"]) {
      throw new Error("Replicate: deploymentName not set");
    }
    if (!this.options.envs["assetPrefix"]) {
      throw new Error("Replicate: assetPrefix not set");
    }
    this.assetURL = this.options.envs["assetPrefix"];
  }

  async getSimpleBgID(ctx: RequestContext, prediction_simple_bg_id: string) {
    const entity = await this.connection
      .getRepository(ctx, ReplicateSimpleBgEntity)
      .findOne({
        where: { id: prediction_simple_bg_id },
      });
    return entity ? entity.id : undefined;
  }

  async startModelRun(ctx: RequestContext, input: StartGenerateSimpleBGInput) {
    const { assetId, roomType, roomStyle, prompt: additionalPrompt } = input;
    try {
      const imageAsset = await this.assetService.findOne(ctx, assetId as ID);
      if (!imageAsset?.source) {
        Logger.error("Asset not found", LOGGER_CTX);
        return;
      }

      const assetUrl = [this.assetURL, imageAsset.source]
        .filter((v) => !!v)
        .join("/");
      const assetResponse = await axios.get(assetUrl, {
        responseType: "arraybuffer",
      });
      const assetBase64 = Buffer.from(assetResponse.data, "binary").toString(
        "base64",
      );

      const prompt = [
        DEFAULT_PROMPT,
        this.options.prompts?.positive,
        additionalPrompt,
      ]
        .filter((v) => !!v)
        .join(", ");
      const n_prompt = [DEFAULT_NEGATIVE_PROMPT, this.options.prompts?.negative]
        .filter((v) => !!v)
        .join(", ");

      const seed = this.options.seed ? this.options.seed : -1;
      const response = await axios.post(
        `https://api.replicate.com/v1/deployments/aexol-studio/${this.options.envs["deploymentName"]}/predictions`,
        {
          input: {
            seed,
            image: `data:image/png;base64,${assetBase64}`,
            prompt: [roomType, roomStyle, prompt].join(", "),
            negative_prompt: n_prompt,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.options.envs["apiToken"]}`,
            "Content-Type": `application/json`,
          },
        },
      );

      const entity = await this.connection
        .getRepository(ctx, ReplicateSimpleBgEntity)
        .save({
          prediction_simple_bg_id: response.data.id,
          status: response.data.status,
          roomType: roomType,
          roomStyle: roomStyle,
        });

      return entity.id;
    } catch (error) {
      Logger.error("API call to replicate failed", LOGGER_CTX);
      console.error("Error:", error);
    }
  }

  async checkAndUpdatePredictionStatus(
    ctx: RequestContext,
    prediction_simple_bg_id: string,
  ) {
    try {
      const response = await axios.get<{
        status: string;
        output: string;
        completed_at: string;
        error: string;
      }>(
        `https://api.replicate.com/v1/predictions/${prediction_simple_bg_id}`,
        {
          headers: {
            Authorization: `Bearer ${this.options.envs["apiToken"]}`,
            "Content-Type": "application/json",
          },
        },
      );

      const status = response.data.status;
      const image = response.data.output;

      if (response?.data?.error) {
        await this.connection
          .getRepository(ctx, ReplicateSimpleBgEntity)
          .update(
            { prediction_simple_bg_id },
            {
              status: PredictionSimpleBgStatus.failed,
              finishedAt: response.data.completed_at,
            },
          );
        return { status: PredictionSimpleBgStatus.failed, output: "" };
      }

      if (
        [PredictionSimpleBgStatus.succeeded as string].includes(status) &&
        response.data.output
      ) {
        const formattedTimestamp = response.data.completed_at
          .replace(/:/g, "")
          .toLowerCase();
        const assetName = `output-${formattedTimestamp}.png`;

        const fileResponse = await axios.get(image, {
          responseType: "arraybuffer",
        });
        const tempDir = await mkdtemp("replicate-simple-bg");
        const tempFilePath = path.join(tempDir, assetName);

        fs.writeFileSync(tempFilePath, fileResponse.data);

        await this.assetService.createFromFileStream(
          fs.createReadStream(tempFilePath),
          ctx,
        );

        await rm(tempDir, { recursive: true, force: true });

        const resultAsset = await this.assetService.findAll(ctx, {
          filter: { name: { eq: assetName } },
        });

        const asset = resultAsset.items[0];

        if (!asset) {
          throw new Error("Asset not found");
        }
        await this.connection
          .getRepository(ctx, ReplicateSimpleBgEntity)
          .update(
            { prediction_simple_bg_id },
            {
              status: status,
              output: asset.source,
              finishedAt: response.data.completed_at,
            },
          );

        return {
          status: status as PredictionSimpleBgStatus,
          output: asset.source,
        };
      }
    } catch (error) {
      Logger.error("API call to replicate failed", LOGGER_CTX);
      console.error("Error:", error);
    }
  }

  async getSimpleBgItems(
    ctx: RequestContext,
    options?: ListQueryOptions<ReplicateSimpleBgEntity>,
  ): Promise<PaginatedList<ReplicateSimpleBgEntity>> {
    const qb = this.listQueryBuilder.build(ReplicateSimpleBgEntity, options, {
      ctx,
    });
    const [items, totalItems] = await qb.getManyAndCount();
    return { items, totalItems };
  }

  async getSimpleBgItem(ctx: RequestContext, id: string) {
    const prediction = await this.connection
      .getRepository(ctx, ReplicateSimpleBgEntity)
      .findOne({ where: { id: id } });
    if (!prediction) {
      return new Error("Prediction not found");
    }
    if (this.options.envs["assetPrefix"] === undefined) {
      throw new Error("Replicate: assetPrefix not set");
    }
    if (
      [
        PredictionSimpleBgStatus.preprocessing as string,
        PredictionSimpleBgStatus.starting as string,
      ].includes(prediction.status)
    ) {
      const updated_prediction = await this.checkAndUpdatePredictionStatus(
        ctx,
        prediction.prediction_simple_bg_id,
      );
      if (!updated_prediction) {
        return { status: prediction.status, image: "" };
      }
    }
    const image = [this.options.envs["assetPrefix"], prediction.output].join(
      "/",
    );
    return { ...prediction, image };
  }

  async getSimpleBgThemesAsset() {
    return this.options.envs["assetPrefix"];
  }

  async getSimpleBgRoomType() {
    return [...DEFAULT_ROOM_TYPE, ...(this.options.roomType || [])];
  }

  async getSimpleBgRoomTheme() {
    const assetPrefix = this.options.envs["assetPrefix"];
    if (typeof assetPrefix !== "string" || assetPrefix === undefined) {
      throw new Error("Replicate: assetPrefix must be a string");
    }

    const roomTheme = [
      ...DEFAULT_ROOM_THEME,
      ...(this.options.roomTheme || []),
    ];

    for (const theme of roomTheme) {
      if (!theme.image.startsWith(assetPrefix)) {
        theme.image = [assetPrefix, theme.image].join("/");
      }
    }

    return roomTheme;
  }

  async assignPredictionToProduct(
    ctx: RequestContext,
    input: AssignPredictionToProductInput,
  ) {
    const prediction = await this.connection
      .getRepository(ctx, ReplicateSimpleBgEntity)
      .findOne({ where: { id: input.predictionId } });

    if (!prediction) {
      return new Error("Prediction not found");
    }

    const prediction_asset = await this.connection
      .getRepository(ctx, ReplicateSimpleBgEntity)
      .findOne({
        where: { id: input.predictionId },
      });
    if (!prediction_asset) {
      throw new Error("Asset not found for prediction output");
    }

    const assets = await this.assetService.findAll(ctx, {
      filter: { source: { eq: prediction_asset.output } },
    });

    const asset = assets.items[0];
    return asset;
  }

  async getSimpleBgAssetIDByName(ctx: RequestContext, source: string) {
    const assets = await this.assetService.findAll(ctx, {
      filter: { name: { eq: source } },
    });

    const asset = assets.items[0];

    if (!asset) {
      throw new Error("Asset not found");
    }
    return asset.id;
  }

  async getSimpleBgProductList(
    ctx: RequestContext,
    options?: ListQueryOptions<ProductTranslation>,
  ): Promise<PaginatedList<ProductTranslation>> {
    const qb = this.listQueryBuilder.build(ProductTranslation, options, {
      ctx,
    });
    const [items, totalItems] = await qb.getManyAndCount();
    return { items, totalItems };
  }
}
