"use client";

import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function useSocket(assignmentId: string | null) {
  const socketRef = useRef<Socket | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current) return socketRef.current;

    const socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    socketRef.current = socket;
    return socket;
  }, []);

  const joinRoom = useCallback(
    (id: string) => {
      const socket = connect();
      socket.emit("join-assignment", id);
    },
    [connect]
  );

  const leaveRoom = useCallback(
    (id: string) => {
      if (socketRef.current) {
        socketRef.current.emit("leave-assignment", id);
      }
    },
    []
  );

  const onEvent = useCallback(
    (event: string, callback: (data: any) => void) => {
      const socket = connect();
      socket.on(event, callback);
      return () => {
        socket.off(event, callback);
      };
    },
    [connect]
  );

  useEffect(() => {
    if (assignmentId) {
      joinRoom(assignmentId);
    }

    return () => {
      if (assignmentId) {
        leaveRoom(assignmentId);
      }
    };
  }, [assignmentId, joinRoom, leaveRoom]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  return {
    socket: socketRef.current,
    connect,
    joinRoom,
    leaveRoom,
    onEvent,
  };
}
