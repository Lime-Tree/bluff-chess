import React, { useState, useEffect } from "react";
import Chessboard from "chessboardjsx";

const Board = ({ socket }) => {
  const [styleSquares, setStyleSquares] = useState({});
  const [position, setPosition] = useState("start");
  const [roomNumber, setRoomNumber] = useState("0");
  const [pieceSquare, setPieceSquare] = useState("");

  useEffect(() => {
    socket.on("updateBoard", (position) => {
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
      const boardPosition = {};
      console.log(Object.keys(thing));
      Object.keys(thing).forEach((key) => {
        console.log(key);
        if (key !== "poop") {
          boardPosition[key] = thing[key];
        }
      });
      console.log(boardPosition);
      setPosition(boardPosition);
      setPieceSquare("");
    });

    socket.on("roomNumber", (room) => {
      setRoomNumber(room);
      console.log("room: " + room);
    });

    socket.emit("getRoomNumber");
  }, []);

  const handleSquareClick = (square) => {
    socket.emit("move", { from: pieceSquare, to: square });
    setPieceSquare(square);
  };

  const printPosition = (position) => {};

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
          getPosition={printPosition}
          onSquareClick={handleSquareClick}
          squareStyles={styleSquares}
        />
      </div>
    </div>
  );
};

export default Board;
