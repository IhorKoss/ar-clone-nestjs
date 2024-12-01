import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDeletedColumnAndCascadeForRefresh1732793016714 implements MigrationInterface {
    name = 'AddedDeletedColumnAndCascadeForRefresh1732793016714'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "deleted" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff"`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff"`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "deleted"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
