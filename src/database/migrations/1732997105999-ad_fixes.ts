import { MigrationInterface, QueryRunner } from "typeorm";

export class AdFixes1732997105999 implements MigrationInterface {
    name = 'AdFixes1732997105999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "editAttempts"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "editAttempts" integer NOT NULL DEFAULT '0'`);
    }

}
