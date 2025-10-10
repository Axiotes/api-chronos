/*
  Warnings:

  - You are about to drop the column `date` on the `TimeRecords` table. All the data in the column will be lost.
  - You are about to drop the column `hour` on the `TimeRecords` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TimeRecords" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "employeeId" INTEGER NOT NULL,
    "dateTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME,
    CONSTRAINT "TimeRecords_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TimeRecords" ("createdAt", "employeeId", "id", "type", "updatedAt") SELECT "createdAt", "employeeId", "id", "type", "updatedAt" FROM "TimeRecords";
DROP TABLE "TimeRecords";
ALTER TABLE "new_TimeRecords" RENAME TO "TimeRecords";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
