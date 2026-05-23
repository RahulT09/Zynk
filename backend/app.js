import express from "express";
import mongoose from "mongoose";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { profile } from "node:console";
import { connectToSocket } from "./src/controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

const start = async () => {
  app.set("mongo_user");
  const connectionDB = await mongoose.connect(
    "mongodb+srv://rt206292_db_user:phdENuIJR3vcVzkr@cluster0.8bfl4y8.mongodb.net/",
  );
  console.log(`DB connected to DB HOST : ${connectionDB.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("Listening on port 8080");
  });
};

start();
      