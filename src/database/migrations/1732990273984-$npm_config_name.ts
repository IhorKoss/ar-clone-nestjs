import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1732990273984 implements MigrationInterface {
    name = ' $npmConfigName1732990273984'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "editAttempts" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "editAttempts"`);
    }

}
