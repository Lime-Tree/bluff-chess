const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Chess } = require("chess.js");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let roomCounter = 0;
const roomMap = new Map();

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

io.on("connection", (socket) => {
  let roomNumber;
  let room;

  socket.on("joinRoom", (joinedRoomNumber) => {
    if (roomMap[joinedRoomNumber]) {
      roomNumber = joinedRoomNumber;
      socket.join(roomNumber);
      socket.emit("getRoomNumber", roomNumber);
      room = roomMap[roomNumber];
    }
  });

  socket.on("createRoom", () => {
    roomNumber = roomCounter.toString();
    socket.join(roomNumber);
    socket.emit("getRoomNumber", roomNumber);
    console.log(roomNumber);
    room = { game: new Chess() };
    roomMap[roomNumber] = room;
    roomCounter += 1;
  });

  console.log("a user connected");

  socket.on("square", (square) => {
    io.to(roomNumber).emit("changeColor", square);
  });

  socket.on("move", ({ from, to }) => {
    const move = room.game.move({
      from: from,
      to: to,
      promotion: "q",
    });
    console.log(move);
    if (!move) {
      return;
    }
    io.to(roomNumber).emit("updateBoard", room.game.fen());
    console.log(room.game.fen());
  });
});
