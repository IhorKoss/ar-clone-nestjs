import { MigrationInterface, QueryRunner } from "typeorm";

export class AdFixes1733002291209 implements MigrationInterface {
    name = 'AdFixes1733002291209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "convertedPrices" json NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "description" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "convertedPrices"`);
    }

}
