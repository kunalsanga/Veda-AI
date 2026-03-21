import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Worker, Job } from "bullmq";
import { io as ioClient, Socket } from "socket.io-client";
import { processGeneration } from "./processor";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/veda-ai";
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:4000";

// Socket.io client to communicate with backend
let socket: Socket;

function connectSocket(): Socket {
  socket = ioClient(BACKEND_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("🔌 Worker connected to backend via WebSocket");
  });

  socket.on("disconnect", () => {
    console.log("🔌 Worker disconnected from backend WebSocket");
  });

  return socket;
}

async function start() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Worker connected to MongoDB");

    // Connect WebSocket
    connectSocket();

    // Create BullMQ worker
    const worker = new Worker(
      "generate-paper",
      async (job: Job) => {
        console.log(`⚙️  Processing job ${job.id} for assignment ${job.data.assignmentId}`);
        await processGeneration(job.data.assignmentId, socket);
      },
      {
        connection: {
          url: process.env.REDIS_URL!
        },
        concurrency: 2,
        limiter: {
          max: 5,
          duration: 60000, // 5 jobs per minute max
        },
      }
    );

    worker.on("completed", (job) => {
      console.log(`✅ Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
      console.error(`❌ Job ${job?.id} failed:`, err.message);
    });

    worker.on("error", (err) => {
      console.error("Worker error:", err);
    });

    console.log("🚀 Worker is running and waiting for jobs...");
  } catch (error) {
    console.error("❌ Failed to start worker:", error);
    process.exit(1);
  }
}

start();
