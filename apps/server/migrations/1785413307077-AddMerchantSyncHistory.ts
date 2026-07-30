import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMerchantSyncHistory1785413307077 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "merchant_sync_run" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "platform" character varying NOT NULL, "trigger" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "jobId" character varying, "total" integer NOT NULL DEFAULT '0', "succeeded" integer NOT NULL DEFAULT '0', "failed" integer NOT NULL DEFAULT '0', "errorSummary" text, "startedAt" TIMESTAMP, "finishedAt" TIMESTAMP, "id" SERIAL NOT NULL, CONSTRAINT "PK_52c60a4b2d01324206ce4ec0471" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c582185960a81cf4523733c136" ON "merchant_sync_run" ("platform", "createdAt") `,
      undefined,
    );
    await queryRunner.query(
      `CREATE TABLE "merchant_sync_item" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "offerId" character varying NOT NULL, "operation" character varying NOT NULL, "status" character varying NOT NULL, "errorCode" character varying, "errorMessage" text, "attempts" integer NOT NULL DEFAULT '1', "id" SERIAL NOT NULL, "runId" integer, CONSTRAINT "PK_b2a1f9a2b825361dbd8e0f5a262" PRIMARY KEY ("id"))`,
      undefined,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_10fc938ce505fd401ec635c70d" ON "merchant_sync_item" ("offerId", "createdAt") `,
      undefined,
    );
    await queryRunner.query(
      `ALTER TABLE "merchant_sync_item" ADD CONSTRAINT "FK_6e011c5bbf3bf8cad87ac29ab7c" FOREIGN KEY ("runId") REFERENCES "merchant_sync_run"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "merchant_sync_item" DROP CONSTRAINT "FK_6e011c5bbf3bf8cad87ac29ab7c"`,
      undefined,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_10fc938ce505fd401ec635c70d"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "merchant_sync_item"`, undefined);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c582185960a81cf4523733c136"`,
      undefined,
    );
    await queryRunner.query(`DROP TABLE "merchant_sync_run"`, undefined);
  }
}
