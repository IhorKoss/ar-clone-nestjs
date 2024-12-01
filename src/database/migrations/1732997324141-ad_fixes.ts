import { MigrationInterface, QueryRunner } from "typeorm";

export class AdFixes1732997324141 implements MigrationInterface {
    name = 'AdFixes1732997324141'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "editAttempts" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "editAttempts"`);
    }

}
