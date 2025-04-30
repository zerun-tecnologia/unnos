/*
  Warnings:

  - You are about to drop the `MatchBanned` table. If the table is not empty, all the data it contains will be lost.

*/

-- CreateTable
CREATE TABLE "_match_banned" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_match_banned_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_match_banned_B_index" ON "_match_banned"("B");

-- AddForeignKey
ALTER TABLE "_match_banned" ADD CONSTRAINT "_match_banned_A_fkey" FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_match_banned" ADD CONSTRAINT "_match_banned_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate data from MatchBanned to _match_banned
INSERT INTO "_match_banned" ("A", "B")
SELECT "matchId", "userId"
FROM "MatchBanned";

-- DropForeignKey
ALTER TABLE "MatchBanned" DROP CONSTRAINT "MatchBanned_matchId_fkey";

-- DropForeignKey
ALTER TABLE "MatchBanned" DROP CONSTRAINT "MatchBanned_userId_fkey";

-- DropTable
DROP TABLE "MatchBanned" CASCADE;
