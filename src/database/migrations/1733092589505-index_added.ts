import { MigrationInterface, QueryRunner } from "typeorm";

export class IndexAdded1733092589505 implements MigrationInterface {
    name = 'IndexAdded1733092589505'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ca6b37d37ddb41f5c3c5c7f828" ON "favourites" ("user_id", "ad_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ca6b37d37ddb41f5c3c5c7f828"`);
    }

}
