import { Server as SocketIOServer, Socket } from "socket.io";

export function setupSocket(io: SocketIOServer) {
  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join a room based on assignmentId
    socket.on("join-assignment", (assignmentId: string) => {
      socket.join(`assignment:${assignmentId}`);
      console.log(`📎 Socket ${socket.id} joined room assignment:${assignmentId}`);
    });

    // Leave room
    socket.on("leave-assignment", (assignmentId: string) => {
      socket.leave(`assignment:${assignmentId}`);
      console.log(`📎 Socket ${socket.id} left room assignment:${assignmentId}`);
    });

    // Relay worker events to assignment rooms
    socket.on("worker-event", (payload: any) => {
      const { type, assignmentId, ...rest } = payload;
      console.log(`📡 Relaying worker event: ${type} for assignment ${assignmentId}`);
      io.to(`assignment:${assignmentId}`).emit(type, {
        assignmentId,
        ...rest,
      });
    });

    // Relay worker progress events
    socket.on("worker-progress", (payload: any) => {
      const { assignmentId, ...rest } = payload;
      io.to(`assignment:${assignmentId}`).emit("generation-progress", {
        assignmentId,
        ...rest,
      });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
}

// Emit generation complete event to specific assignment room
export function emitGenerationComplete(
  io: SocketIOServer,
  assignmentId: string,
  data: any
) {
  io.to(`assignment:${assignmentId}`).emit("generation-complete", {
    assignmentId,
    status: "completed",
    data,
  });
  console.log(`📡 Emitted generation-complete for assignment ${assignmentId}`);
}

// Emit generation failed event
export function emitGenerationFailed(
  io: SocketIOServer,
  assignmentId: string,
  error: string
) {
  io.to(`assignment:${assignmentId}`).emit("generation-failed", {
    assignmentId,
    status: "failed",
    error,
  });
  console.log(`📡 Emitted generation-failed for assignment ${assignmentId}`);
}

// Emit generation progress event
export function emitGenerationProgress(
  io: SocketIOServer,
  assignmentId: string,
  progress: string
) {
  io.to(`assignment:${assignmentId}`).emit("generation-progress", {
    assignmentId,
    status: "processing",
    progress,
  });
}
