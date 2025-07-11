import { Injectable } from "@nestjs/common";
import {
  TransactionalConnection,
  Logger,
  RequestContext,
  ID,
} from "@deenruv/core";
import { UpsellEntity } from "../entities/upsell.entity.js";
import { ResolverInputTypes } from "../zeus/index.js";

@Injectable()
export class UpsellService {
  private readonly logger = new Logger();
  private readonly log = (msg: string) => this.logger.log(msg, "UpsellService");

  constructor(private connection: TransactionalConnection) {
    this.log("UpsellService initialized");
  }

  async upsells(ctx: RequestContext, productID: ID) {
    try {
      const upsell = await this.connection
        .getRepository(ctx, UpsellEntity)
        .find({
          where: { base: { id: productID } },
          relations: { upsell: { variants: true } },
        });
      return upsell.map(({ upsell }) => upsell);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      this.logger.error(errorMessage);
      return [];
    }
  }

  async createUpsell(
    ctx: RequestContext,
    input: ResolverInputTypes["UpsellInput"][],
  ) {
    const entities = input.flatMap(({ baseProductID, upsellProductID }) => [
      new UpsellEntity({
        base: { id: baseProductID },
        upsell: { id: upsellProductID },
      }),
      new UpsellEntity({
        base: { id: upsellProductID },
        upsell: { id: baseProductID },
      }),
    ]);

    try {
      return !!(await Promise.all(
        entities.map((entity) =>
          this.connection.getRepository(ctx, UpsellEntity).upsert(entity, {
            conflictPaths: { base: true, upsell: true },
            upsertType: "on-conflict-do-update",
          }),
        ),
      ));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      this.logger.error(errorMessage);
    }
  }

  async deleteUpsell(
    ctx: RequestContext,
    input: ResolverInputTypes["UpsellInput"][],
  ) {
    const [deletedA, deletedB] = await Promise.all([
      input.map(({ baseProductID, upsellProductID }) =>
        this.connection.getRepository(ctx, UpsellEntity).delete({
          base: { id: baseProductID },
          upsell: { id: upsellProductID },
        }),
      ),
      input.map(({ baseProductID, upsellProductID }) =>
        this.connection.getRepository(ctx, UpsellEntity).delete({
          base: { id: upsellProductID },
          upsell: { id: baseProductID },
        }),
      ),
    ]);
    return !!deletedA.length && !!deletedB.length;
  }
}
