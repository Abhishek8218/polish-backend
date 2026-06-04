/*
  Warnings:

  - The values [PRO,BUSINESS] on the enum `UserPlan` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- AlterEnum
BEGIN;
CREATE TYPE "UserPlan_new" AS ENUM ('FREE', 'MONTHLY', 'YEARLY', 'PROMO');
ALTER TABLE "public"."User" ALTER COLUMN "plan" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "plan" TYPE "UserPlan_new" USING ("plan"::text::"UserPlan_new");
ALTER TYPE "UserPlan" RENAME TO "UserPlan_old";
ALTER TYPE "UserPlan_new" RENAME TO "UserPlan";
DROP TYPE "public"."UserPlan_old";
ALTER TABLE "User" ALTER COLUMN "plan" SET DEFAULT 'FREE';
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
