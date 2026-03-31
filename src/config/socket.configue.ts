import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { ClientToServerEvents, ServerToClientEvents } from "../app/interface/socket";
import { MessageService } from "../app/modules/messages/massege.service";

export const setupSocket = (server: HttpServer) => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket: Socket<ClientToServerEvents, ServerToClientEvents>) => {
    console.log(`🟢 New Connection: ${socket.id}`);
    
    socket.on("join_notification_room", (userId) => {
      socket.join(userId);
      console.log(`🔔 User ${userId} joined notification room: ${socket.id}`);
    });

    // রুম জয়েনিং (চ্যাটিং Conversation ID)
    socket.on("join_room", (roomId) => {
      socket.join(roomId);
      console.log(`📁 Socket ${socket.id} joined chat room: ${roomId}`);
    });

    // মেসেজ হ্যান্ডলিং
    socket.on("send_message", async (data) => {
      try {
        const savedMessage = await MessageService.saveMessage({
          content: data.content,
          senderId: data.senderId,
          conversationId: data.roomId,
        });

        
        io.to(data.roomId).emit("receive_message", savedMessage);
        
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });

    // Ttyping status
    socket.on("start_typing", (data) => {
      socket.to(data.roomId).emit("user_typing", { 
        userId: data.userId, 
        userName: data.userName 
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket Disconnected: ${socket.id}`);
    });
  });

  return io;
};