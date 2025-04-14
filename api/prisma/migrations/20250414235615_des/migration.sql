-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "duration" INTEGER NOT NULL,
    "description" TEXT NOT NULL
);
INSERT INTO "new_Service" ("description", "duration", "id", "name", "price") SELECT "description", "duration", "id", "name", "price" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
