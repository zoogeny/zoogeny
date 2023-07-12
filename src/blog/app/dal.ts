import BetterSqlite3 from "better-sqlite3";

const getPostListSQL = `SELECT * FROM posts`;

const getPostBySlugSQL = `SELECT * FROM posts WHERE slug = :slug`;

export type Post = {
  slug: string;
  title: string;
  content: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
  author: string;
};

const readOnlyDb = () => {
  const db = new BetterSqlite3("./test.sqlite", {
    fileMustExist: true,
    readonly: true,
  });
  return db;
};

export const getPostList = (): Post[] => {
  const db = readOnlyDb();
  const activities = db.prepare(getPostListSQL).all();
  db.close();
  return activities as Post[];
};

export const getPostBySlug = (slug: string): Post => {
  const db = readOnlyDb();
  const post = db.prepare(getPostBySlugSQL).get({ slug });
  db.close();
  return post as Post;
};
