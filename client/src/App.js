import "./App.css";
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Board from "./Chessboard";
import Chessboard from "chessboardjsx";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  extraHeaders: { "my-custom-header": "abcd" },
});

function App() {
  return (
    <div className="App">
      <Board socket={socket} />
    </div>
  );
}

export default App;