/*
  Warnings:

  - A unique constraint covering the columns `[analyticsId,currency]` on the table `CurrencyAmount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CurrencyAmount_analyticsId_currency_key" ON "CurrencyAmount"("analyticsId", "currency");
