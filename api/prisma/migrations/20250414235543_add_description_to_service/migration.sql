/*
  Warnings:

  - Added the required column `description` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT NOT NULL DEFAULT 'Service description coming soon'
);
INSERT INTO "new_Service" ("duration", "id", "name", "price", "description") 
SELECT "duration", "id", "name", "price", 'Service description coming soon' 
FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
