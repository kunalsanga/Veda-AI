import { Router, Request, Response } from "express";
import multer from "multer";
import { Assignment } from "../models/Assignment";
import { addPaperJob } from "../config/queue";
import { getCachedResult, setCachedResult } from "../config/redis";

const router = Router();

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, TXT, DOC, DOCX are allowed."));
    }
  },
});

// POST /api/assignments - Create a new assignment
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const {
      subject,
      topic,
      grade,
      questionTypes,
      numberOfQuestions,
      totalMarks,
      dueDate,
      additionalInstructions,
    } = req.body;

    // Parse questionTypes if it comes as a string (from FormData)
    const parsedQuestionTypes =
      typeof questionTypes === "string" ? JSON.parse(questionTypes) : questionTypes;

    // Extract file content if uploaded
    let fileContent: string | undefined;
    if (req.file) {
      fileContent = req.file.buffer.toString("utf-8");
    }

    // Create assignment in MongoDB
    const assignment = await Assignment.create({
      inputData: {
        subject,
        topic,
        grade,
        questionTypes: parsedQuestionTypes,
        numberOfQuestions: parseInt(numberOfQuestions, 10),
        totalMarks: parseInt(totalMarks, 10),
        dueDate,
        additionalInstructions: additionalInstructions || "",
        fileContent,
      },
      status: "pending",
      result: null,
      error: null,
    });

    // Add job to BullMQ queue
    await addPaperJob(assignment._id.toString());

    res.status(201).json({
      success: true,
      data: {
        id: assignment._id,
        status: assignment.status,
        message: "Assignment created. Paper generation started.",
      },
    });
  } catch (error: any) {
    console.error("Error creating assignment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create assignment",
    });
  }
});

// GET /api/assignments/:id - Get assignment by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check Redis cache first
    const cached = await getCachedResult(`assignment:${id}`);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Only return cached if completed
      if (parsed.status === "completed") {
        return res.json({ success: true, data: parsed, cached: true });
      }
    }

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: "Assignment not found" });
    }

    // Cache completed assignments
    if (assignment.status === "completed") {
      await setCachedResult(`assignment:${id}`, JSON.stringify(assignment), 3600);
    }

    res.json({ success: true, data: assignment, cached: false });
  } catch (error: any) {
    console.error("Error fetching assignment:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch assignment",
    });
  }
});

// POST /api/assignments/:id/regenerate - Regenerate paper
router.post("/:id/regenerate", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const assignment = await Assignment.findById(id);
    if (!assignment) {
      return res.status(404).json({ success: false, error: "Assignment not found" });
    }

    // Reset status
    assignment.status = "pending";
    assignment.result = null;
    assignment.error = null;
    await assignment.save();

    // Add new job to queue
    await addPaperJob(id);

    res.json({
      success: true,
      data: {
        id: assignment._id,
        status: "pending",
        message: "Regeneration started.",
      },
    });
  } catch (error: any) {
    console.error("Error regenerating:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to regenerate",
    });
  }
});

export { router as assignmentRouter };
