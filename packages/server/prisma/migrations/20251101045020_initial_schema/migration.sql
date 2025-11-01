/*
  Warnings:

  - You are about to drop the column `githubOrg` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `githubRepo` on the `Todo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "githubOrg";

-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "githubRepo";
