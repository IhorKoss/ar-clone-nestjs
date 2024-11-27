import { MigrationInterface, QueryRunner } from "typeorm";

export class MinorChanges1732704871106 implements MigrationInterface {
    name = 'MinorChanges1732704871106'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "currency"`);
        await queryRunner.query(`CREATE TYPE "public"."ads_currency_enum" AS ENUM('uah', 'usd', 'eur')`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "currency" "public"."ads_currency_enum" NOT NULL DEFAULT 'uah'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "currency"`);
        await queryRunner.query(`DROP TYPE "public"."ads_currency_enum"`);
        await queryRunner.query(`ALTER TABLE "ads" ADD "currency" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "description" SET NOT NULL`);
    }

}
