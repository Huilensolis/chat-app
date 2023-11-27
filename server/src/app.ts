import express from "express";
import { createServer } from "http";
import logger from "morgan";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@libsql/client";
const port = process.env.PORT || 3000;

dotenv.config();

const app = express();
app.use(express.json());
app.use(logger("dev"));
app.use(cors());

const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = createClient({
  url: "libsql://liked-screwball-huilensolis.turso.io",
  authToken: process.env.DB_TOKEN,
});

(async () => {
  await db.execute("DROP TABLE IF EXISTS messages");
  await db.execute("DROP TABLE IF EXISTS users");

  await db.execute(
    "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)",
  );
  await db.execute(
    "CREATE TABLE IF NOT EXISTS users (username TEXT PRIMARY KEY)",
  );
  server.listen(port, () => {
    console.log("server running on port: " + port);
  });
})();

io.on("connection", async (socket) => {
  socket.on("chat message", async (message) => {
    try {
      const result = await db.execute({
        sql: "INSERT INTO messages (content) VALUES (:message)",
        args: { message: message },
      });
      io.emit(
        "chat message",
        message,
        parseInt(result.lastInsertRowid?.toString() as string),
      );
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("user desconnected");
  });

  if (!socket.recovered) {
    try {
      const result = await db.execute({
        sql: "SELECT id, content FROM messages WHERE id > ? ORDER BY id ASC",
        args: [socket.handshake.auth.serverOffset ?? 0],
      });
      console.log(socket.handshake.auth.serverOffset);
      result.rows.forEach(async (row) => {
        socket.emit("chat message", row.content, row.id?.toString());
      });
    } catch (error) {
      console.log("error: " + error);
    }
  }
});

app.get("/user/:username", async (req, res) => {
  const { username } = req.params;

  if (!username)
    return res.status(400).json({ error: "username is required" }).end();

  try {
    const result = await db.execute({
      sql: "SELECT username FROM users WHERE username = :username",
      args: { username: username },
    });

    if (!(result.rows.length === 0)) {
      return res.status(400).json("username taken").end();
    }

    return res.status(200).json("username available").end();
  } catch (error) {
    console.log(error);
    return res.status(400).json("username unavailable").end();
  }
});

app.post("/user/:username", async (req, res) => {
  const { username } = req.params;
  if (!username) {
    return res.status(400).json({ error: "username is required" }).end();
  }

  try {
    await db.execute({
      sql: "INSERT INTO USERS (username) VALUES (:username)",
      args: { username: username },
    });
    return res
      .status(201)
      .json({ data: { user: username } })
      .end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "there has been an error" }).end();
  }
});
