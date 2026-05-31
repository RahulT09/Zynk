import express from "express";
import mongoose from "mongoose";

import { createServer } from "node:http";
import { Server } from "socket.io";

import cors from "cors";
import userRoutes from "./routes/users_routes.js";

import { profile } from "node:console";
import { connectToSocket } from "./controllers/socketManager.js";

import dotenv from "dotenv";
dotenv.config({ path: "../.env" });


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 8080);
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

const start = async () => {
  app.set("mongo_user");
  const connectionDB = await mongoose.connect(
    process.env.MONGODB_URI,
  );
  console.log(`DB connected to DB HOST : ${connectionDB.connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("Listening on port 8080");
  });
};

start();
