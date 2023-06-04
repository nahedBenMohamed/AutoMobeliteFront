/*
  Warnings:

  - You are about to drop the column `resetToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `resetTokenExpiry` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Agency" ADD COLUMN     "responsibleUserId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "resetToken",
DROP COLUMN "resetTokenExpiry";

-- AlterTable
ALTER TABLE "Vehicle" ALTER COLUMN "disponibilite" SET DEFAULT 'oui';

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_responsibleUserId_fkey" FOREIGN KEY ("responsibleUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
