import { MigrationInterface, QueryRunner } from "typeorm";

export class AdFixes1733003879294 implements MigrationInterface {
    name = 'AdFixes1733003879294'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "exchangeRates" json NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "exchangeRates"`);
    }

}
