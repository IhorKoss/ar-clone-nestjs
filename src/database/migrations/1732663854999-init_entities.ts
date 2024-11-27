import { MigrationInterface, QueryRunner } from "typeorm";

export class InitEntities1732663854999 implements MigrationInterface {
    name = 'InitEntities1732663854999'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "analytics" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" SERIAL NOT NULL, "ad_id" uuid NOT NULL, "views" integer NOT NULL DEFAULT '0', "average_price" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "REL_5dfdc8d2d376e9fa615e96b221" UNIQUE ("ad_id"), CONSTRAINT "PK_3c96dcbf1e4c57ea9e0c3144bff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_brands" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_c91539d6c88493d73645682d6cd" UNIQUE ("name"), CONSTRAINT "PK_6a4e2f9b03d554f40b91f4f289a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "car_models" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_fbd1104c4ba4da277de745e5e1e" UNIQUE ("name"), CONSTRAINT "PK_ee4355345e0e1c18cb6efa2bd5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "favourites" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "ad_id" uuid NOT NULL, CONSTRAINT "PK_173e5d5cc35490bf1de2d2d3739" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "ads" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "currency" character varying NOT NULL, "status" "public"."ads_status_enum" NOT NULL DEFAULT 'pending', "user_id" uuid NOT NULL, "brand_id" uuid NOT NULL, "model_id" uuid NOT NULL, CONSTRAINT "PK_a7af7d1998037a97076f758fc23" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'buyer', "accountType" "public"."users_accounttype_enum" NOT NULL DEFAULT 'basic', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "analytics" ADD CONSTRAINT "FK_5dfdc8d2d376e9fa615e96b2210" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favourites" ADD CONSTRAINT "FK_ffb0866c42b7ff4d6e5131f3dcc" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "favourites" ADD CONSTRAINT "FK_a00badcf271caa430a17a6bca26" FOREIGN KEY ("ad_id") REFERENCES "ads"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_843ca9647afecd4565861b0c9cb" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399" FOREIGN KEY ("brand_id") REFERENCES "car_brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ads" ADD CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed" FOREIGN KEY ("model_id") REFERENCES "car_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_e78c2a2fa81125e0e46b11637ed"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_6fe96ba1c0f832fef82f8693399"`);
        await queryRunner.query(`ALTER TABLE "ads" DROP CONSTRAINT "FK_843ca9647afecd4565861b0c9cb"`);
        await queryRunner.query(`ALTER TABLE "favourites" DROP CONSTRAINT "FK_a00badcf271caa430a17a6bca26"`);
        await queryRunner.query(`ALTER TABLE "favourites" DROP CONSTRAINT "FK_ffb0866c42b7ff4d6e5131f3dcc"`);
        await queryRunner.query(`ALTER TABLE "analytics" DROP CONSTRAINT "FK_5dfdc8d2d376e9fa615e96b2210"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "ads"`);
        await queryRunner.query(`DROP TABLE "favourites"`);
        await queryRunner.query(`DROP TABLE "car_models"`);
        await queryRunner.query(`DROP TABLE "car_brands"`);
        await queryRunner.query(`DROP TABLE "analytics"`);
    }

}
