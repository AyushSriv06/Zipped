/*
  Warnings:

  - Added the required column `metadata` to the `ZipRun` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ZipRun" ADD COLUMN     "metadata" JSONB NOT NULL;
