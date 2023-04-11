import BetterSqlite3 from "better-sqlite3";

const createActivityCategoriesSQL = `CREATE TABLE IF NOT EXISTS "activity_categories" (
  "category_id"             INTEGER NOT NULL UNIQUE,
  "category_title"          TEXT NOT NULL,
  "parent_category_id"      INTEGER,
  PRIMARY KEY("category_id" AUTOINCREMENT)
)`;

const createActivitySQL = `CREATE TABLE IF NOT EXISTS "activities" (
  "activity_id"             INTEGER NOT NULL UNIQUE,
  "activity_category_id"    INTEGER NOT NULL,
  "created_at"              TEXT NOT NULL,
  "updated_at"              TEXT,
  "start_at"                TEXT,
  "end_at"                  TEXT,
  PRIMARY KEY("activity_id" AUTOINCREMENT)
)`;

const getAllActivitiesSQL = `SELECT * FROM activities`;

const readWriteDb = () => {
  const db = new BetterSqlite3("./test.sqlite", {
    fileMustExist: true,
  });
  db.pragma("journal_mode = WAL");
  return db;
};

const readOnlyDb = () => {
  const db = new BetterSqlite3("./test.sqlite", {
    fileMustExist: true,
    readonly: true,
  });
  db.pragma("journal_mode = WAL");
  return db;
};

export const initDb = () => {
  const db = readWriteDb();
  const dbVersion = db.pragma("user_version", { simple: true });

  if (dbVersion === 0) {
    db.prepare(createActivityCategoriesSQL).run();
    db.prepare(createActivitySQL).run();
  }

  db.close();

  return dbVersion;
};

export const getAllActivities = () => {
  const db = readOnlyDb();
  const activities = db.prepare(getAllActivitiesSQL).all();
  db.close();
  return activities;
};
