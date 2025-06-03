-- CreateTable
CREATE TABLE "SpecialOffer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "offerType" TEXT NOT NULL,
    "priceAdjustment" DECIMAL NOT NULL DEFAULT 0.00,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "menuItemId" TEXT,
    CONSTRAINT "SpecialOffer_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "MenuItem" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "SpecialOffer_menuItemId_idx" ON "SpecialOffer"("menuItemId");
