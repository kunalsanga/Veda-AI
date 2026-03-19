import { Socket } from "socket.io-client";
import { Assignment } from "./models/Assignment";
import { generateQuestionPaper } from "./ai/generator";
import { validatePaperResult } from "./ai/validator";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

const MAX_RETRIES = 3;

export async function processGeneration(
  assignmentId: string,
  socket: Socket
): Promise<void> {
  try {
    // 1. Fetch assignment from MongoDB
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      throw new Error(`Assignment ${assignmentId} not found`);
    }

    // 2. Update status to processing
    assignment.status = "processing";
    await assignment.save();

    // Emit progress
    socket.emit("worker-progress", {
      assignmentId,
      status: "processing",
      progress: "Generating questions with AI...",
    });

    // 3. Generate AI response with retries
    let result = null;
    let lastError = "";

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`🤖 AI generation attempt ${attempt}/${MAX_RETRIES}`);

        // Emit progress
        socket.emit("worker-progress", {
          assignmentId,
          status: "processing",
          progress: `AI generation attempt ${attempt}/${MAX_RETRIES}...`,
        });

        const rawResponse = await generateQuestionPaper(assignment.inputData);

        // 4. Validate and parse JSON
        const validated = validatePaperResult(rawResponse);
        if (validated.success) {
          result = validated.data;
          break;
        } else {
          lastError = validated.error || "Invalid JSON structure";
          console.warn(`⚠️ Attempt ${attempt} validation failed: ${lastError}`);
        }
      } catch (err: any) {
        lastError = err.message;
        console.error(`⚠️ Attempt ${attempt} failed: ${lastError}`);
      }
    }

    if (!result) {
      // All retries failed
      assignment.status = "failed";
      assignment.error = `Failed after ${MAX_RETRIES} attempts: ${lastError}`;
      await assignment.save();

      socket.emit("worker-event", {
        type: "generation-failed",
        assignmentId,
        error: assignment.error,
      });

      return;
    }

    // 5. Save result to MongoDB
    assignment.status = "completed";
    assignment.result = result;
    assignment.error = null;
    await assignment.save();

    // 6. Cache in Redis
    await redis.setex(
      `assignment:${assignmentId}`,
      3600, // 1 hour TTL
      JSON.stringify(assignment)
    );

    // 7. Emit WebSocket event
    socket.emit("worker-event", {
      type: "generation-complete",
      assignmentId,
      data: result,
    });

    console.log(`✅ Assignment ${assignmentId} completed successfully`);
  } catch (error: any) {
    console.error(`❌ Processing failed for ${assignmentId}:`, error);

    // Update assignment status to failed
    try {
      await Assignment.findByIdAndUpdate(assignmentId, {
        status: "failed",
        error: error.message,
      });
    } catch {}

    socket.emit("worker-event", {
      type: "generation-failed",
      assignmentId,
      error: error.message,
    });

    throw error;
  }
}
