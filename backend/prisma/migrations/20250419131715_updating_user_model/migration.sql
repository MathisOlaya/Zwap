/*
  Warnings:

  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phoneNumber` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "username",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "firstname" TEXT NOT NULL,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "phoneNumber" TEXT NOT NULL,
ADD COLUMN     "profile_picture" TEXT,
ADD COLUMN     "rate" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
