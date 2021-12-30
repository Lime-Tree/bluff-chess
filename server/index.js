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
const BluffChess = require("./BluffChess");

bluffChess = new BluffChess();

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
      socket.emit("roomJoined", roomNumber);
      console.log(roomNumber);
      room = roomMap[roomNumber];
    }
  });

  socket.on("getRoomNumber", () => {
    socket.emit("roomNumber", roomNumber);
  });

  socket.on("createRoom", () => {
    roomNumber = roomCounter.toString();
    socket.join(roomNumber);
    socket.emit("roomJoined", roomNumber);
    room = { game: new Chess() };
    roomMap[roomNumber] = room;
    roomCounter += 1;
  });

  /*socket.on("move", ({ from, to }) => {
    const move = room.game.move({
      from: from,
      to: to,
      promotion: "q",
    });
    if (move) {
      io.to(roomNumber).emit("updateBoard", room.game.fen());
    }
  }); */

  socket.on("move", ({ from, to }) => {
    const move = bluffChess.move(from, to);
    if (move) {
      //console.log(bluffChess.getPosition());
      var position = JSON.parse(JSON.stringify(bluffChess.getPosition()));

      const thing = {
        a8: "bR",
        b8: "bN",
        c8: "bB",
        d8: "bQ",
        e8: "bK",
        f8: "bB",
        g8: "bN",
        h8: "bR",
        a7: "bP",
        b7: "bP",
        a1: "wR",
        a2: "wP",
        b2: "wP",
        c1: "wB",
        c2: "wP",
        c7: "bP",
        d1: "wQ",
        d2: "wP",
        d7: "bP",
        e1: "wK",
        e2: "wP",
        g1: "wN",
        e7: "bP",
        b1: "wN",
        f2: "wP",
        f7: "bP",
        g2: "wB",
        g7: "bP",
        h1: "wR",
        h2: "wP",
        h7: "bP",
        poop: "helloeric",
      };

      console.log(thing);

      io.to(roomNumber).emit("updateBoard", thing);
    }
  });
});
