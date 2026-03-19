import { Queue } from "bullmq";
import Redis from "ioredis";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const paperQueue = new Queue("generate-paper", {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
  },
});

export async function addPaperJob(assignmentId: string) {
  const job = await paperQueue.add(
    "generate",
    { assignmentId },
    { jobId: `paper-${assignmentId}` }
  );
  console.log(`📋 Added job ${job.id} for assignment ${assignmentId}`);
  return job;
}
