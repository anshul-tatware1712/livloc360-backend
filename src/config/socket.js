import { Server } from "socket.io";
import LocationService from "../services/locationService.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("device_location_update", async (data) => {
      try {
        console.log("Location update received for device:", data.deviceId);

        const result = await LocationService.saveLocation(data);

        if (result) {
          if (data.userId) {
            io.to(data.userId).emit("location_updated", data);
          }
          io.emit("location_updated", data);
        }
      } catch (error) {
        console.error("Error handling location update:", error);
      }
    });

    socket.on("join_user_room", (userId) => {
      socket.join(userId);
      console.log(`Socket ${socket.id} joined user room: ${userId}`);
    });
    socket.on("leave_user_room", (userId) => {
      socket.leave(userId);
      console.log(`Socket ${socket.id} left user room: ${userId}`);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized yet!");
  }
  return io;
};
