import { MigrationInterface, QueryRunner } from "typeorm";

export class Excluded1757087841443 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" ADD "excludedPromotionIds" text NOT NULL DEFAULT ''`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order" DROP COLUMN "excludedPromotionIds"`,
      undefined,
    );
  }
}
