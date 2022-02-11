module.exports = class BluffChess {
  constructor() {
    this.position = this.startPosition();
    this.renderPosition = {
      white: this.startPosition(),
      black: this.startPosition(),
    };
    this.bluffBinds = new Map();
    this.turn = "white";
  }

  startPosition() {
    return {
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
      a7: "bP",
      a8: "bR",
      b2: "wP",
      b7: "bP",
      b8: "bN",
      c1: "wB",
      c2: "wP",
      c7: "bP",
      c8: "bB",
      d1: "wQ",
      d2: "wP",
      d7: "bP",
      d8: "bQ",
      e1: "wK",
      e2: "wP",
      e7: "bP",
      e8: "bK",
      b1: "wN",
      f1: "wB",
      f2: "wP",
      f7: "bP",
      f8: "bB",
      g1: "wN",
      g2: "wP",
      g7: "bP",
      g8: "bN",
      h1: "wR",
      h2: "wP",
      h7: "bP",
    };
  }

  squareToCoordinates(square) {
    const letterToNum = {
      a: 1,
      b: 2,
      c: 3,
      d: 4,
      e: 5,
      f: 6,
      g: 7,
      h: 8,
    };
    return { x: letterToNum[square[0]], y: parseInt(square[1]) };
  }

  coordinatesToSquare(coord) {
    const numToLetter = {
      1: "a",
      2: "b",
      3: "c",
      4: "d",
      5: "e",
      6: "f",
      7: "g",
      8: "h",
    };
    return `${numToLetter[coord.x]}${coord.y}`;
  }

  direction(from, to) {
    const from_coord = this.squareToCoordinates(from);
    const to_coord = this.squareToCoordinates(to);
    const x_dist = Math.abs(to_coord.x - from_coord.x);
    const y_dist = Math.abs(to_coord.y - from_coord.y);

    switch (x_dist - y_dist) {
      case 0:
        return "diagonal";
      case x_dist:
        return "horizontal";
      case -y_dist:
        return "vertical";
      default:
        return null;
    }
  }

  pawnMoveHelper(moveInfo) {
    let move = { square: "", delete: [] };
    const ending_rank = moveInfo.pieceColor === "white" ? "4" : "5";
    if (moveInfo.possibleMoves.length > 2) {
      return null;
    }

    if (
      moveInfo.possibleMoves.length === 2 &&
      ending_rank !== moveInfo.possibleMoves[1][1]
    ) {
      return null;
    }

    moveInfo.possibleMoves.every((square) => {
      if (this.pieceColor(square) === moveInfo.pieceColor) {
        if (this.bluffBinds.hasOwnProperty(square)) {
          move.delete.push(square);
          move.square = square;
          return true;
        }
        move = null;
        return false;
      } else if (this.pieceColor(square) === moveInfo.enemyColor) {
        if (this.bluffBinds.hasOwnProperty(square)) {
          move.delete.push(square);
          move.square = square;
          return true;
        }
        move.delete.push(moveInfo.from);
        return false;
      } else {
        move.square = square;
        return true;
      }
    });
    return move;
  }

  bluffedPawnMoveHelper(moveInfo) {
    let move = { square: "", delete: [] };

    const ending_rank = moveInfo.pieceColor === "white" ? "4" : "5";
    if (moveInfo.possibleMoves.length > 2) {
      return null;
    }

    if (
      moveInfo.possibleMoves.length === 2 &&
      ending_rank !== moveInfo.possibleMoves[1][1]
    ) {
      return null;
    }

    moveInfo.possibleMoves.every((square) => {
      switch (this.pieceColor(square)) {
        case moveInfo.pieceColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
            move.square = square;
            return true;
          }
          move = null;
          return false;
        case moveInfo.enemyColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
          }
          if (this.bluffBinds.hasOwnProperty(moveInfo.from)) {
            move.delete.push(moveInfo.from);
          }
          move.square = "";
          return false;
        default:
          move.square = square;
          return true;
      }
    });
    return move;
  }

  moveHelper(moveInfo) {
    let move = { square: "", delete: [] };
    moveInfo.possibleMoves.every((square) => {
      switch (this.pieceColor(square)) {
        case moveInfo.pieceColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
            move.square = square;
            return true;
          }
          move = null;
          return false;
        case moveInfo.enemyColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
            move.square = square;
            return true;
          }
          move.square = square;
          return false;
        default:
          move.square = square;
          return true;
      }
    });
    return move;
  }

  bluffedMoveHelper(moveInfo) {
    let move = { square: "", delete: [] };
    moveInfo.possibleMoves.every((square) => {
      switch (this.pieceColor(square)) {
        case moveInfo.pieceColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
            move.square = square;
            return true;
          }
          move = null;
          return false;
        case moveInfo.enemyColor:
          if (this.bluffBinds.hasOwnProperty(square)) {
            move.delete.push(square);
          }
          if (this.bluffBinds.hasOwnProperty(moveInfo.from)) {
            move.delete.push(moveInfo.from);
          }
          move.square = "";
          return false;
        default:
          move.square = square;
          return true;
      }
    });
    return move;
  }

  knightMove(moveInfo) {
    let move = { square: "", delete: [] };
    const distance = this.distance(moveInfo.from, moveInfo.to);
    if (distance.x ** 2 + distance.y ** 2 === 5) {
      switch (this.pieceColor(moveInfo.to)) {
        case moveInfo.pieceColor:
          move = null;
          break;
        default:
          move.square = moveInfo.to;
          break;
      }
      return move;
    }
    return null;
  }

  bluffedKnightMove(moveInfo) {
    let move = { square: "", delete: [] };
    const distance = this.distance(moveInfo.from, moveInfo.to);
    if (distance.x ** 2 + distance.y ** 2 === 5) {
      switch (this.pieceColor(moveInfo.to)) {
        case moveInfo.pieceColor:
          if (this.bluffBinds.hasOwnProperty(moveInfo.to)) {
            move.square = moveInfo.to;
            return move;
          }
          move = null;
          break;
        case moveInfo.enemyColor:
          if (this.bluffBinds.hasOwnProperty(moveInfo.to)) {
            move.delete.push(moveInfo.to);
          }
          if (this.bluffBinds.hasOwnProperty(moveInfo.from)) {
            move.delete.push(moveInfo.from);
          }
          move.square = "";
          break;
        default:
          console.log({ from: from, to: to });
          move.square = moveInfo.to;
          break;
      }
      return move;
    }
    return null;
  }

  moveInfo(from, to) {
    const pieceColor = this.pieceColor(from);
    if (pieceColor !== this.turn) {
      return null;
    }
    const enemyColor = pieceColor === "white" ? "black" : "white";
    const direction = this.direction(from, to);
    const possibleMoves = this.between(from, to);
    return {
      from: from,
      to: to,
      pieceColor: pieceColor,
      enemyColor: enemyColor,
      direction: direction,
      possibleMoves: possibleMoves,
      isBluffedPiece: false,
    };
  }

  canPawnCapture(moveInfo) {
    return (
      moveInfo.direction === "diagonal" &&
      moveInfo.possibleMoves.length === 1 &&
      this.pieceColor(moveInfo.possibleMoves[0]) === moveInfo.enemyColor &&
      this.pawnMovingDown(moveInfo)
    );
  }

  pawnMove(moveInfo) {
    //diagonal capture
    let move;
    if (this.canPawnCapture(moveInfo)) {
      move = this.moveHelper(moveInfo);
    } else if (
      moveInfo.direction === "vertical" &&
      this.pawnMovingDown(moveInfo)
    ) {
      move = this.pawnMoveHelper(moveInfo);
    }
    return move;
  }

  bluffedPawnMove(moveInfo) {
    //diagonal capture
    let move;
    if (this.canPawnCapture(moveInfo)) {
      move = this.bluffedMoveHelper(moveInfo);
    } else if (
      moveInfo.direction === "vertical" &&
      this.pawnMovingDown(moveInfo)
    ) {
      move = this.bluffedPawnMoveHelper(moveInfo);
    }
    return move;
  }

  bishopMove(moveInfo) {
    let move;
    if (moveInfo.direction === "diagonal") {
      move = this.moveHelper(moveInfo);
    }
    return move;
  }

  bluffedBishopMove(moveInfo) {
    let move;
    if (moveInfo.direction === "diagonal") {
      move = this.bluffedMoveHelper(moveInfo);
    }
    return move;
  }

  rookMove(moveInfo) {
    let move;
    if (["horizontal", "vertical"].includes(moveInfo.direction)) {
      move = this.moveHelper(moveInfo);
    }
    return move;
  }

  bluffedRookMove(moveInfo) {
    let move;
    if (["horizontal", "vertical"].includes(moveInfo.direction)) {
      move = this.bluffedMoveHelper(moveInfo);
    }
    return move;
  }

  queenMove(moveInfo) {
    let move;
    if (moveInfo.direction) {
      move = this.moveHelper(moveInfo);
    }
    return move;
  }

  bluffedQueenMove(moveInfo) {
    let move;
    if (moveInfo.direction) {
      move = this.bluffedMoveHelper(moveInfo);
    }
    return move;
  }

  kingMove(moveInfo) {
    let move;
    if (moveInfo.possibleMoves.length === 1) {
      move = this.moveHelper(moveInfo);
    }
    return move;
  }

  bluffedKingMove(moveInfo) {
    let move;
    if (moveInfo.possibleMoves.length === 1) {
      move = this.bluffedMoveHelper(moveInfo);
    }
    return move;
  }

  handleMove(from, to, isBluffedPiece) {
    let move = null;
    const moveInfo = this.moveInfo(from, to);
    if (!moveInfo) {
      return null;
    }
    moveInfo["isBluffedPiece"] = isBluffedPiece;

    switch (this.pieceType(from)) {
      case "P":
        move = isBluffedPiece
          ? this.bluffedPawnMove(moveInfo)
          : this.pawnMove(moveInfo);
        break;
      case "B":
        move = isBluffedPiece
          ? this.bluffedBishopMove(moveInfo)
          : this.bishopMove(moveInfo);
        break;
      case "N":
        move = isBluffedPiece
          ? this.bluffedKnightMove(moveInfo)
          : this.knightMove(moveInfo);
        break;
      case "R":
        move = isBluffedPiece
          ? this.bluffedRookMove(moveInfo)
          : this.rookMove(moveInfo);
        break;
      case "Q":
        move = isBluffedPiece
          ? this.bluffedQueenMove(moveInfo)
          : this.queenMove(moveInfo);
        break;
      case "K":
        move = isBluffedPiece
          ? this.bluffedKingMove(moveInfo)
          : this.kingMove(moveInfo);
        break;
    }
    return move;
  }

  between(from, to) {
    const squares = [];
    const from_coord = this.squareToCoordinates(from);
    const to_coord = this.squareToCoordinates(to);

    const x_direction = Math.sign(to_coord.x - from_coord.x);
    const y_direction = Math.sign(to_coord.y - from_coord.y);
    let x = from_coord.x;
    let y = from_coord.y;

    switch (this.direction(from, to)) {
      case "diagonal":
        while (x !== to_coord.x) {
          x += x_direction;
          y += y_direction;
          squares.push(this.coordinatesToSquare({ x: x, y: y }));
        }
        return squares;
      case "vertical":
        while (y !== to_coord.y) {
          y += y_direction;
          squares.push(this.coordinatesToSquare({ x: x, y: y }));
        }
        return squares;
      case "horizontal":
        while (x !== to_coord.x) {
          x += x_direction;
          squares.push(this.coordinatesToSquare({ x: x, y: y }));
        }
        return squares;
      default:
        return squares;
    }
  }

  move(from, to) {
    console.log({ from: from, to: to });
    if (!this.position[from] || !to) {
      return null;
    }

    const isBluffedPiece = this.bluffBinds.hasOwnProperty(from);

    const move = this.handleMove(from, to, isBluffedPiece);

    if (!move) {
      return null;
    }
    move.delete.forEach((square) => {
      this.deletePiece(square);
    });
    if (move.square != "") {
      this.movePiece(from, move.square);
    }
    return move;
  }

  createBluffedPiece(from, to) {
    console.log({ from: from, to: to });
    if (!this.position[from] || !to) {
      return null;
    }
    const move = this.handleMove(from, to, true);
    console.log(move);

    if (!move) {
      return false;
    }

    move.delete.forEach((square) => {
      this.deletePiece(square);
    });

    if (move.square != "") {
      this.addBluffPiece(from, move.square);
    }
    return move;
  }

  pieceType(square) {
    if (this.position[square]) {
      return this.position[square][1];
    }
    return null;
  }

  changeTurn() {
    this.turn = this.turn === "white" ? "black" : "white";
  }

  pieceColor(square) {
    if (this.position[square]) {
      return this.position[square][0] === "w" ? "white" : "black";
    }
    return null;
  }

  distance(from, to) {
    const from_coord = this.squareToCoordinates(from);
    const to_coord = this.squareToCoordinates(to);
    return { x: to_coord.x - from_coord.x, y: to_coord.y - from_coord.y };
  }

  pawnMovingDown(moveInfo) {
    if (moveInfo.to[1] > moveInfo.from[1]) {
      return moveInfo.pieceColor === "white" ? true : false;
    } else {
      return moveInfo.pieceColor === "white" ? false : true;
    }
  }

  getBluffPiece(realPiece) {
    return Object.keys(this.bluffBinds).find((bluffedPiece) => {
      return this.bluffBinds[bluffedPiece] === realPiece;
    });
  }

  deletePiece(square) {
    //Empty square
    if (!this.position[square]) {
      return null;
    }
    //if real piece in arrPieces have binded bluffed piece, also remove the bluffed piece
    const color = this.pieceColor(square);
    const enemyColor = color === "white" ? "black" : "white";

    //Removed square is a real square with a bluffed piece binded
    if (this.getBluffPiece(square)) {
      //Remove the binded bluffed piece on all boards
      this.changePosition(this.getBluffPiece(square), "", "all");
      //Remove the bind
      delete this.bluffBinds[this.getBluffPiece(square)];
    }

    //Removed square is a bluffed piece
    if (this.bluffBinds.hasOwnProperty(square)) {
      //Reveal the binded real piece
      this.changePosition(
        this.bluffBinds[square],
        this.position[this.bluffBinds[square]],
        enemyColor
      );
      //Remove the bind
      delete this.bluffBinds[square];
    }
    //Delete the square
    this.changePosition(square, "", "all");
  }

  movePiece(from, to) {
    this.deletePiece(to);
    this.changePosition(to, this.position[from], "all");
    if (this.bluffBinds.hasOwnProperty(from)) {
      const realPiece = this.bluffBinds[from];
      delete this.bluffBinds[from];
      this.deletePiece(from);
      this.bluffBinds[to] = realPiece;
    } else {
      this.deletePiece(from);
    }
  }

  changePosition(square, piece, board) {
    switch (board) {
      case "true":
        if (piece === "") {
          delete this.position[square];
          break;
        }
        this.position[square] = piece;
        break;
      case "white":
        if (piece === "") {
          delete this.renderPosition.white[square];
          break;
        }
        this.renderPosition.white[square] = piece;
        break;
      case "black":
        if (piece === "") {
          delete this.renderPosition.black[square];
          break;
        }
        this.renderPosition.black[square] = piece;
        break;
      case "all":
        if (piece === "") {
          delete this.position[square];
          delete this.renderPosition.black[square];
          delete this.renderPosition.white[square];
          break;
        }
        this.position[square] = piece;
        this.renderPosition.black[square] = piece;
        this.renderPosition.white[square] = piece;
        break;
      default:
        break;
    }
  }

  addBluffPiece(from, to) {
    //checks if from is already binded
    if (this.getBluffPiece(from)) {
      //delete binded bluff piece
      this.deletePiece(this.getBluffPiece(from));
    }
    this.bluffBinds[to] = from;
    const color = this.pieceColor(from);
    const enemyColor = color === "white" ? "black" : "white";
    this.changePosition(to, this.position[from], "all");
    this.changePosition(from, "", enemyColor);
  }
};
