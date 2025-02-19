-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "state" SET DEFAULT 'WAITING';

-- DropEnum
DROP TYPE "GameType";
