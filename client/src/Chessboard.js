import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";

const Board = ({ socket }) => {
  const [styleSquares, setStyleSquares] = useState({});
  const [position, setPosition] = useState("start");

  useEffect(() => {
    socket.on("changeColor", (square) => {
      setStyleSquares((prevStyles) => ({
        ...prevStyles,
        [square]: { backgroundColor: "blue" },
      }));
    });
  }, []);

  const handleSquareClick = (square) => {
    socket.emit("square", square);
  };

  return (
    <Chessboard
      position={position}
      onSquareClick={handleSquareClick}
      squareStyles={styleSquares}
    />
  );
};

export default Board;
