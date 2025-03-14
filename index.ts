import express from "express";
import * as http from "http";
import { Server as SocketIO } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.broadcast.emit("user connected", {
    id: socket.id,
    userId: socket.id,
    message: "Welcome to the server",
  });

  socket.on("player position", (payload) => {
    socket.broadcast.emit("player position", {
      id: socket.id,
      userId: socket.id,
      ...payload,
    });
  });

  socket.on("ping", (message) => {
    console.log("PONG:", message);
  });

  socket.on("join room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("offer", (offer, roomId) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", (answer, roomId) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice candidate", (candidate, roomId) => {
    socket.to(roomId).emit("ice candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
