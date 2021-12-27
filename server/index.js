const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let roomCounter = 0;

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

server.listen(3001, () => {
  console.log("listening on *:3001");
});

io.on("connection", (socket) => {
  let room;

  socket.on("joinRoom", (roomNumber) => {
    room = roomNumber;
    socket.join(room);
  });

  socket.on("createRoom", () => {
    room = roomCounter;
    socket.join(room);
    socket.emit("getRoomNumber", room);
    roomCounter += 1;
  });

  console.log("a user connected");

  socket.on("square", (square) => {
    io.to(room).emit("changeColor", square);
  });
});
