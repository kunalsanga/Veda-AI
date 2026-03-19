import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import mongoose from "mongoose";
import { connectRedis } from "./config/redis";
import { assignmentRouter } from "./routes/assignments";
import { setupSocket } from "./socket";

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Make io accessible in routes
app.set("io", io);

// Routes
app.use("/api/assignments", assignmentRouter);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Setup Socket.io
setupSocket(io);

// Start server
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/veda-ai";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Connect to Redis
    await connectRedis();
    console.log("✅ Connected to Redis");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

start();

export { io };
