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
let player = 0;
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
  let playerColor;

  socket.on("joinRoom", (joinedRoomNumber) => {
    if (roomMap[joinedRoomNumber]) {
      roomNumber = joinedRoomNumber;
      socket.join(roomNumber);
      socket.emit("roomJoined", roomNumber);
      console.log(roomNumber);
      room = roomMap[roomNumber];
      playerColor = player === 0 ? "white" : "black";
      player = (player + 1) % 2;
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

    playerColor = player === 0 ? "white" : "black";
    player = (player + 1) % 2;
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
    let move;
    if (playerColor === bluffChess.turn) {
      move = bluffChess.move(from, to);
    }
    if (move) {
      io.to(roomNumber).emit("updateBoard", {
        positions: bluffChess.renderPosition,
        bluffs: bluffChess.bluffBinds,
      });
      bluffChess.changeTurn();
      io.to(roomNumber).emit("turn", bluffChess.turn);
    }
  });

  socket.on("getPlayerColor", () => {
    socket.emit("playerColor", playerColor);
  });

  socket.on("getStyleBluffs", () => {
    const styleSquares = {};

    Object.entries(bluffChess.bluffBinds).forEach(([key, value]) => {
      if (bluffChess.pieceColor(key) === playerColor) {
        styleSquares[key] = { backgroundColor: "orange" };
      }
    });
    socket.emit("styleBluffs", styleSquares);
  });

  socket.on("createBluffedPiece", ({ from, to }) => {
    //check if real piece
    if (bluffChess.bluffBinds.hasOwnProperty(from)) {
      return null;
    }

    let move;
    if (playerColor === bluffChess.turn) {
      move = bluffChess.createBluffedPiece(from, to);
    }
    if (move) {
      io.to(roomNumber).emit("updateBoard", {
        positions: bluffChess.renderPosition,
        bluffs: bluffChess.bluffBinds,
      });
      bluffChess.changeTurn();
      io.to(roomNumber).emit("turn", bluffChess.turn);
    }
  });
});
