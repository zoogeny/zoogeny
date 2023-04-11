import express from "express";
import responseTime from "response-time";

import { applyProblemDetails } from "./apiError";
import { getActivityByOffsetAndLimit, getAllActivities, initDb } from "./dal";
import { getOptionalNumberParam, validateIso8601DateTime } from "./validator";

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

app.get("/activities/:startAt/:endAt", (req, res) => {
  const { startAt, endAt } = req.params;
  const offset = getOptionalNumberParam(req.query, "offset");
  const limit = getOptionalNumberParam(req.query, "limit");

  if (
    (offset !== undefined && offset < 0) ||
    (limit !== undefined && limit < 0)
  ) {
    return applyProblemDetails(res, "invalid-pagination");
  }

  const startAtDate = validateIso8601DateTime(startAt);
  const endAtDate = validateIso8601DateTime(endAt);

  if (!startAtDate || !endAtDate) {
    return applyProblemDetails(res, "invalid-date-format");
  }

  if (startAtDate >= endAtDate) {
    return applyProblemDetails(res, "invalid-date-range");
  }

  const activities = getActivityByOffsetAndLimit(startAt, endAt, offset, limit);
  res.send(activities);
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});

export default app;
