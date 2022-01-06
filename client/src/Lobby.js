import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Lobby = ({ socket }) => {
  const navigate = useNavigate();
  useEffect(() => {
    socket.on("enterGame", () => {
      navigate("/board");
    });
  }, []);

  const startGame = () => {
    socket.emit("startGame");
  };

  return (
    <div>
      <h1>Lobby</h1>
      <nav>
        <Link to="/">Home</Link>
      </nav>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};
export default Lobby;
