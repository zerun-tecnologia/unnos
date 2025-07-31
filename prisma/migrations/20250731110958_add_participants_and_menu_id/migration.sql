-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "menuId" TEXT;

-- AlterTable
ALTER TABLE "Season" ALTER COLUMN "endAt" DROP DEFAULT,
ALTER COLUMN "startAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_match_participants" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_match_participants_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_match_participants_B_index" ON "_match_participants"("B");

-- AddForeignKey
ALTER TABLE "_match_participants" ADD CONSTRAINT "_match_participants_A_fkey" FOREIGN KEY ("A") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_match_participants" ADD CONSTRAINT "_match_participants_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
