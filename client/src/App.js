import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Board from "./Chessboard";
import Lobby from "./Lobby";

const socket = io("http://localhost:3001", {
  withCredentials: true,
  extraHeaders: { "my-custom-header": "abcd" },
});

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Lobby socket={socket} />} />
          <Route path="/board" element={<Board socket={socket} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
