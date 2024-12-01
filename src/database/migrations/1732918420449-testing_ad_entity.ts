import { MigrationInterface, QueryRunner } from "typeorm";

export class TestingAdEntity1732918420449 implements MigrationInterface {
    name = 'TestingAdEntity1732918420449'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed"`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "brand_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "model_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed" FOREIGN KEY ("model_id") REFERENCES "car_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399"`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "model_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" ALTER COLUMN "brand_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed" FOREIGN KEY ("model_id") REFERENCES "car_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
