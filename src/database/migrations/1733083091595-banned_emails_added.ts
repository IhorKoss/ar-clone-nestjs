import { MigrationInterface, QueryRunner } from "typeorm";

export class BannedEmailsAdded1733083091595 implements MigrationInterface {
    name = 'BannedEmailsAdded1733083091595'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "banned_emails" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" text NOT NULL, CONSTRAINT "PK_67061e24eec9e3e39b145d82ad7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "favourites" DROP COLUMN "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "favourites" ADD "email" text NOT NULL`);
        await queryRunner.query(`DROP TABLE "banned_emails"`);
    }

}
