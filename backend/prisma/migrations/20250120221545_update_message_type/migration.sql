/*
  Warnings:

  - You are about to drop the column `timestamp` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" DROP COLUMN "timestamp",
ALTER COLUMN "message" DROP NOT NULL;
