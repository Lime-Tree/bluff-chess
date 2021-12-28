import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";

const Board = ({ socket }) => {
  const [styleSquares, setStyleSquares] = useState({});
  const [position, setPosition] = useState("start");
  const [roomNumber, setRoomNumber] = useState(0);
  const [pieceSquare, setPieceSquare] = useState("");

  useEffect(() => {
    socket.on("changeColor", (square) => {
      setStyleSquares((prevStyles) => ({
        ...prevStyles,
        [square]: { backgroundColor: "blue" },
      }));
    });

    socket.on("updateBoard", (position) => {
      setPosition(position);
      setPieceSquare("");
    });

    socket.on("getRoomNumber", (room) => {
      setRoomNumber(room);
    });
  }, []);

  const handleSquareClick = (square) => {
    // socket.emit("square", square);
    socket.emit("move", { from: pieceSquare, to: square });
    setPieceSquare(square);
  };

  return (
    <div>
      <h1> Room Number: {roomNumber} </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Chessboard
          position={position}
          onSquareClick={handleSquareClick}
          squareStyles={styleSquares}
        />
      </div>
    </div>
  );
};

export default Board;
