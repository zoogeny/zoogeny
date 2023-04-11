import express from "express";
import path from "path";
import favicon from "serve-favicon";

const app = express();

app.use(favicon(path.join(__dirname, "../../shared/favicon", "favicon.ico")));

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

export default app;
