import express from "express";
import { createServer } from "http";

import logger from "morgan";
import { Server } from "socket.io";

import cors from "cors";

const port = process.env.PORT || 3000;

const app = express();
app.use(logger("dev"));
app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (_socket) => {
  console.log("a user has connected to the socket");
});

server.listen(port, () => {
  console.log("server running on port: " + port);
});
