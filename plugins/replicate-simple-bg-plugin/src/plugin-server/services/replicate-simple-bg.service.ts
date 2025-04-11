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
  constructor(
    @Inject(REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS)
    private readonly options: ReplicateSimpleBGOptions,
    @Inject(TransactionalConnection)
    private readonly connection: TransactionalConnection,
    @Inject(AssetService) private readonly assetService: AssetService,
    @Inject(ListQueryBuilder)
    private readonly listQueryBuilder: ListQueryBuilder,
  ) {}

  async getSimpleBgID(ctx: RequestContext, prediction_simple_bg_id: string) {
    const entity = await this.connection
      .getRepository(ctx, ReplicateSimpleBgEntity)
      .findOne({
        where: { id: prediction_simple_bg_id },
      });
    return entity ? entity.id : undefined;
  }

  async startModelRun(ctx: RequestContext, input: StartGenerateSimpleBGInput) {
    const { assetId, roomType, roomStyle, prompt } = input;
    try {
      const requiredEnvs = ["apiToken", "deploymentName", "assetPrefix"];
      for (const key of requiredEnvs) {
        if (!this.options.envs[key]) {
          throw new Error("Replicate: Environment variable not set: " + key);
        }
      }

      const imageAsset = await this.assetService.findOne(ctx, assetId as ID);

      if (!imageAsset?.source) {
        Logger.error("Asset not found", LOGGER_CTX);
        return;
      }

      const assetUrl = `http://localhost:3000/assets/${imageAsset.source}`;

      const assetResponse = await axios.get(assetUrl, {
        responseType: "arraybuffer",
      });
      const assetBase64 = Buffer.from(assetResponse.data, "binary").toString(
        "base64",
      );

      if (this.options.envs["prompt"].length === 0) {
        this.options.envs["prompt"] = DEFAULT_PROMPT;
      }
      if (this.options.envs["n_prompt"].length === 0) {
        this.options.envs["n_prompt"] = DEFAULT_NEGATIVE_PROMPT;
      }

      let new_prompt: string;
      if (!prompt) {
        new_prompt = Array.isArray(this.options.envs["prompt"])
          ? this.options.envs["prompt"].join(", ") + ` ${roomType} ${roomStyle}`
          : this.options.envs["prompt"] + ` ${roomType} ${roomStyle}`;
      } else {
        new_prompt = Array.isArray(this.options.envs["prompt"])
          ? this.options.envs["prompt"].join(", ") +
            ` ${roomType} ${roomStyle} ${prompt}`
          : this.options.envs["prompt"] + ` ${roomType} ${roomStyle} ${prompt}`;
      }

      const n_prompt = Array.isArray(this.options.envs["n_prompt"])
        ? this.options.envs["n_prompt"].join(", ")
        : this.options.envs["n_prompt"];

      const response = await axios.post(
        `https://api.replicate.com/v1/deployments/aexol-studio/${this.options.envs["deploymentName"]}/predictions`,
        {
          input: {
            seed: Number.parseInt(
              Array.isArray(this.options.envs["seed"])
                ? this.options.envs["seed"][0]
                : this.options.envs["seed"],
            ),
            image: `data:image/png;base64,${assetBase64}`,
            prompt: new_prompt,
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

    return {
      status: prediction.status,
      image: [this.options.envs["assetPrefix"], prediction.output].join("/"),
      roomType: prediction.roomType,
      roomStyle: prediction.roomStyle,
    };
  }

  async getSimpleBgThemesAsset() {
    if (this.options.envs["assetPrefix"] === undefined) {
      throw new Error("Replicate: assetPrefix not set");
    }
    return this.options.envs["assetPrefix"];
  }

  async getSimpleBgRoomType() {
    if (!this.options.roomType) {
      throw new Error("Replicate: roomType not set");
    }

    return [...DEFAULT_ROOM_TYPE, ...this.options.roomType];
  }

  async getSimpleBgRoomTheme() {
    const assetPrefix = this.options.envs["assetPrefix"];
    if (typeof assetPrefix !== "string" || assetPrefix === undefined) {
      throw new Error("Replicate: assetPrefix must be a string");
    }

    const roomTheme = [...DEFAULT_ROOM_THEME, ...this.options.roomTheme];

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
      .findOne({
        where: { id: input.predictionId },
      });

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
