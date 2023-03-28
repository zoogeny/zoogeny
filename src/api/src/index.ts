import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, world! API");
});

app.listen(3001, () => {
  console.log("Server is listening on port 3001");
});

export default app;
