/*
Warnings:

- Added the required column `endAt` to the `Season` table without a default value. This is not possible if the table is not empty.
- Added the required column `startAt` to the `Season` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Season"
ADD COLUMN "endAt" TIMESTAMP(3) DEFAULT (NOW()) NOT NULL,
ADD COLUMN "startAt" TIMESTAMP(3) DEFAULT (NOW()) NOT NULL;