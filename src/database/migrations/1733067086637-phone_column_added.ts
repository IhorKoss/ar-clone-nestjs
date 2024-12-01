import { MigrationInterface, QueryRunner } from "typeorm";

export class PhoneColumnAdded1733067086637 implements MigrationInterface {
    name = 'PhoneColumnAdded1733067086637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ADD "phone" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP COLUMN "phone"`);
    }

}
