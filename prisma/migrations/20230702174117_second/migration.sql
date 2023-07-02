/*
  Warnings:

  - You are about to drop the column `estate` on the `cart` table. All the data in the column will be lost.
  - You are about to drop the column `observation` on the `cart` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cart` DROP COLUMN `estate`,
    DROP COLUMN `observation`,
    ADD COLUMN `El estado 1 es abierto, el estado 2 es cerrado` INTEGER NOT NULL DEFAULT 1;
