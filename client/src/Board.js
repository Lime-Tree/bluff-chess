import React, { useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";

const Board = ({ socket }) => {
  const [position, setPosition] = useState("start");
  const [roomNumber, setRoomNumber] = useState("0");
  const [pieceSquare, setPieceSquare] = useState("");
  const [pieceBluffSquare, setPieceBluffSquare] = useState("");
  const [squareStyles, setSquareStyles] = useState({});
  const [orientation, setOrientation] = useState("white");
  const [turn, setTurn] = useState("white");

  useEffect(() => {
    socket.on("turn", (turn) => {
      setTurn(turn);
    });

    socket.on("updateBoard", ({ positions, bluffs }) => {
      socket.emit("getPlayerColor");
      socket.on("playerColor", (playerColor) => {
        console.log(playerColor);
        setPosition(positions[playerColor]);
      });

      socket.emit("getStyleBluffs");
      socket.on("styleBluffs", (styleSquares) => {
        setSquareStyles(styleSquares);
      });
      setPieceSquare("");
    });

    socket.on("roomNumber", (roomNumber) => {
      socket.emit("getPlayerColor");
      socket.on("playerColor", (playerColor) => {
        setOrientation(playerColor);
      });
      setRoomNumber(roomNumber);
    });

    socket.emit("getRoomNumber");
  }, [socket]);

  const handleSquareClick = (square) => {
    setPieceBluffSquare("");
    socket.emit("move", { from: pieceSquare, to: square });
    setPieceSquare(square);
  };

  const handleSquareRightClick = (square) => {
    setPieceSquare("");
    socket.emit("createBluffedPiece", { from: pieceBluffSquare, to: square });
    setPieceBluffSquare(square);
  };

  const handlePieceDrop = (sourceSquare, targetSquare) => {
    socket.emit("move", { from: sourceSquare, to: targetSquare });
  };

  return (
    <div>
      <h1>Room Number: {roomNumber}</h1>
      <h1>Turn: {turn}</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Chessboard
          position={position}
          animationDuration={0}
          boardOrientation={orientation}
          onSquareClick={handleSquareClick}
          onPieceDrop={handlePieceDrop}
          onSquareRightClick={handleSquareRightClick}
          customSquareStyles={squareStyles}
        />
      </div>
    </div>
  );
};

export default Board;
