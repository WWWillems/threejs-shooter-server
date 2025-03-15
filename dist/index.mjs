import express from 'express';
import * as http from 'http';
import { Server } from 'socket.io';

const GAME_EVENTS = {
  USER: {
    CONNECTED: "user:connected",
    DISCONNECTED: "user:disconnected"
  },
  PLAYER: {
    POSITION: "player:position",
    STATUS: "player:status"
  },
  WEAPON: {
    SHOOT: "weapon:shoot",
    SWITCH: "weapon:switch"}};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "https://bang-bang.dapps.be",
      "https://bang-bang-teal.vercel.app/",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});
const PORT = process.env.PORT || 3e3;
server.listen(PORT, () => {
  console.log(`\u2705 Server listening on port ${PORT}`);
});
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);
  socket.broadcast.emit(GAME_EVENTS.USER.CONNECTED, {
    id: socket.id,
    userId: socket.id,
    message: "Welcome to the server"
  });
  socket.on(GAME_EVENTS.PLAYER.POSITION, (payload) => {
    socket.broadcast.emit(GAME_EVENTS.PLAYER.POSITION, {
      id: socket.id,
      userId: socket.id,
      ...payload
    });
  });
  socket.on(GAME_EVENTS.PLAYER.STATUS, (payload) => {
    socket.broadcast.emit(GAME_EVENTS.PLAYER.STATUS, {
      id: socket.id,
      userId: socket.id,
      ...payload
    });
  });
  socket.on(GAME_EVENTS.WEAPON.SWITCH, (payload) => {
    socket.broadcast.emit(GAME_EVENTS.WEAPON.SWITCH, {
      id: socket.id,
      userId: socket.id,
      ...payload
    });
  });
  socket.on(GAME_EVENTS.WEAPON.SHOOT, (payload) => {
    socket.broadcast.emit(GAME_EVENTS.WEAPON.SHOOT, {
      id: socket.id,
      userId: socket.id,
      ...payload
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
    socket.broadcast.emit(GAME_EVENTS.USER.DISCONNECTED, {
      id: socket.id,
      userId: socket.id,
      message: "Welcome to the server"
    });
  });
});
