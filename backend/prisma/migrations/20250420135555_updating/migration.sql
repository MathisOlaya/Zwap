/*
  Warnings:

  - You are about to drop the `ZohoToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('Zoho');

-- DropTable
DROP TABLE "ZohoToken";

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresIn" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);
