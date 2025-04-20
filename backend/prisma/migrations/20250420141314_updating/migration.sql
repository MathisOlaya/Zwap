/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `Token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Token_type_key" ON "Token"("type");
