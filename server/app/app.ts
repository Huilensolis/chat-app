import express, { type Request, type Response } from "express";

import logger from "morgan";

const port = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.get("/", (_req: Request, res: Response) => {
  return res.send("Hello World");
});

app.listen(port, () => {
  console.log("server running on port: " + port);
});
