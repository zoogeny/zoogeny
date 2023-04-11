import express from "express";
import responseTime from "response-time";

import { getAllActivities, initDb } from "./dal";

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(responseTime());
}

app.get("/", (req, res) => {
  res.send("Hello, world! API");
});

app.get("/init-db", (req, res) => {
  const dbVersion = initDb();
  res.send(`Hello, world! API init-db ${dbVersion}`);
});

app.get("/activities", (req, res) => {
  const activities = getAllActivities();
  res.send(activities);
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});

export default app;
