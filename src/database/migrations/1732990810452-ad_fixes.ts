import { MigrationInterface, QueryRunner } from "typeorm";

export class AdFixes1732990810452 implements MigrationInterface {
    name = 'AdFixes1732990810452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "status" SET DEFAULT 'active'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "status" SET DEFAULT 'pending'`);
    }

}
