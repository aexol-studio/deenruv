import { Injectable } from "@nestjs/common";
import { In } from "typeorm";
import {
  TransactionalConnection,
  Logger,
  RequestContext,
  TranslatorService,
  TranslatableSaver,
  Product,
  EntityNotFoundError,
  type TranslatedInput,
  ID,
} from "@deenruv/core";
import { Badge } from "../entities/Badge";
import { BadgeTranslation } from "../entities/BadgeTranslation";
import { ModelTypes } from "../zeus";

@Injectable()
export class BadgeService {
  private readonly log = (msg: string) => Logger.info(msg, "BadgeService");

  constructor(
    private connection: TransactionalConnection,
    private translator: TranslatorService,
    private translatableSaver: TranslatableSaver
  ) {
    this.log("BadgeService initialized");
  }

  async findOne(ctx: RequestContext, id: ID) {
    const badge = await this.connection
      .getRepository(ctx, Badge)
      .findOne({ where: { id } });
    if (!badge) throw new EntityNotFoundError("Badge not found", id);

    return badge;
  }

  async findAll(ctx: RequestContext, productIds: ID[]) {
    const badges = await this.connection
      .getRepository(ctx, Badge)
      .find({ where: { product: { id: In(productIds) } } });

    return badges.map((el) => this.translator.translate(el, ctx));
  }

  async createBadge(
    ctx: RequestContext,
    { productId, ...input }: ModelTypes["CreateBadgeInput"]
  ) {
    const product = await this.connection
      .getRepository(ctx, Product)
      .findOne({ where: { id: productId } });
    if (!product) throw new EntityNotFoundError("Product not found", productId);
    try {
      const badge = await this.translatableSaver.create({
        ctx,
        input: {
          product,
          ...input,
        } as TranslatedInput<Badge>,
        entityType: Badge,
        translationType: BadgeTranslation,
      });

      return badge;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.log(`Error while creating badge: ${message}`);
      return false;
    }
  }

  async removeBadge(ctx: RequestContext, id: ID) {
    const badge = await this.findOne(ctx, id);
    if (!badge) throw new Error("Badge already removed.");

    try {
      await this.connection.getRepository(ctx, Badge).remove(badge);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.log(`Error while removing badge: ${message}`);
      return false;
    }
  }

  async editBadge(ctx: RequestContext, input: ModelTypes["EditBadgeInput"]) {
    const badge = await this.findOne(ctx, input.id);
    if (!badge) throw new EntityNotFoundError("Badge not found", input.id);

    try {
      return await this.translatableSaver.update({
        ctx,
        input,
        entityType: Badge,
        translationType: BadgeTranslation,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      this.log(`Error while editing badge: ${message}`);
      return false;
    }
  }
}
