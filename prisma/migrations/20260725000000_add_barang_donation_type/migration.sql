-- AlterEnum
ALTER TYPE "donation_type" ADD VALUE 'BARANG';

-- AlterTable
ALTER TABLE "donations" ADD COLUMN "item_description" TEXT;
