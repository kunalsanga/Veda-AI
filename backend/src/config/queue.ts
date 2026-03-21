import { Queue } from "bullmq";

let paperQueue: Queue | null = null;

export function getQueue(): Queue {
  if (!paperQueue) {
    paperQueue = new Queue("generate-paper", {
      connection: {
        url: process.env.REDIS_URL!
      },
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
