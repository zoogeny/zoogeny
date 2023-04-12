import express from "express";
import fs from "fs";
import { OAuth2Client } from "google-auth-library";
import path from "path";
import favicon from "serve-favicon";

const app = express();

app.use(express.json());

app.use(favicon(path.join(__dirname, "../../shared/favicon", "favicon.ico")));

app.get("/", (req, res) => {
  const template = fs.readFileSync(path.join(__dirname, "template.html"), {
    encoding: "utf8",
  });

  res.send(template.replace("{{ content }}", "Hello, world!"));
});

app.post("/verify-gis-auth", async (req, res) => {
  const idToken = req.body.idToken;

  const client = new OAuth2Client(
    "21613585613-fr67oljpoujbj7vqvhlu9djds142484j.apps.googleusercontent.com"
  );
  const ticket = await client.verifyIdToken({
    idToken,
    audience:
      "21613585613-fr67oljpoujbj7vqvhlu9djds142484j.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();
  console.log("Payload: ", payload);

  res.send({ "result:": "OK" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

export default app;
