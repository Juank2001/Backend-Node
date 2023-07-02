/*
  Warnings:

  - You are about to drop the column `El estado 1 es abierto, el estado 2 es cerrado` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `El estado 1 es abierto, el estado 2 es cerrado`,
    ADD COLUMN `state` INTEGER NOT NULL DEFAULT 1;
