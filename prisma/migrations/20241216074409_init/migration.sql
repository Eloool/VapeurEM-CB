-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Games" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "favorited" BOOLEAN NOT NULL DEFAULT false,
    "editorId" INTEGER,
    "genreId" INTEGER,
    CONSTRAINT "Games_editorId_fkey" FOREIGN KEY ("editorId") REFERENCES "Editors" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Games_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genres" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Games" ("description", "editorId", "genreId", "id", "releaseDate", "title") SELECT "description", "editorId", "genreId", "id", "releaseDate", "title" FROM "Games";
DROP TABLE "Games";
ALTER TABLE "new_Games" RENAME TO "Games";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
