const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

function createRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

app.get("/", (_req, res) => {
  res.send("V-Chess WebSocket server is running");
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("create-room", () => {
    const roomCode = createRoomCode();

    rooms.set(roomCode, {
      white: socket.id,
      black: null,
      fen: null,
      moves: [],
    });

    socket.join(roomCode);

    socket.emit("room-created", {
      roomCode,
      color: "w",
    });

    console.log(`Room created: ${roomCode}`);
  });

  socket.on("join-room", ({ roomCode }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("room-error", "Room not found.");
      return;
    }

    if (room.black) {
      socket.emit("room-error", "Room is already full.");
      return;
    }

    room.black = socket.id;
    socket.join(roomCode);

    socket.emit("room-joined", {
      roomCode,
      color: "b",
      fen: room.fen,
      moves: room.moves,
    });

    io.to(roomCode).emit("player-joined", {
      roomCode,
      players: 2,
    });

    console.log(`Player joined room: ${roomCode}`);
  });

  socket.on("send-move", ({ roomCode, fen, move }) => {
    const room = rooms.get(roomCode);

    if (!room) {
      socket.emit("room-error", "Room not found.");
      return;
    }

    room.fen = fen;
    room.moves.push(move);

    socket.to(roomCode).emit("receive-move", {
      fen,
      move,
    });

    console.log(`Move in ${roomCode}:`, move);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);

    for (const [roomCode, room] of rooms.entries()) {
      if (room.white === socket.id || room.black === socket.id) {
        socket.to(roomCode).emit("opponent-disconnected");

        if (room.white === socket.id) {
          rooms.delete(roomCode);
        } else {
          room.black = null;
        }
      }
    }
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`V-Chess WebSocket server running on port ${PORT}`);
});