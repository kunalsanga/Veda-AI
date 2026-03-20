import { Queue } from "bullmq";
import Redis from "ioredis";

let paperQueue: Queue | null = null;

function createConnection(): Redis {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const isTLS = redisUrl.startsWith("rediss://");

  return new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    ...(isTLS ? { tls: { rejectUnauthorized: false } } : {}),
  });
}

export function getQueue(): Queue {
  if (!paperQueue) {
    const connection = createConnection();
    paperQueue = new Queue("generate-paper", {
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
  }
  return paperQueue;
}

export async function addPaperJob(assignmentId: string) {
  const queue = getQueue();
  const job = await queue.add(
    "generate",
    { assignmentId },
    { jobId: `paper-${assignmentId}` }
  );
  console.log(`📋 Added job ${job.id} for assignment ${assignmentId}`);
  return job;
}
