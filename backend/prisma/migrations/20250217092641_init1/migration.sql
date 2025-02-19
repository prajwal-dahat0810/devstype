/*
  Warnings:

  - You are about to drop the column `finishedAt` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "finishedAt",
ADD COLUMN     "finishAt" TIMESTAMP(3);
