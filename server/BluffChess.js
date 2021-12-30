module.exports = class BluffChess {
  constructor() {
    this.position = this.startPosition();
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

  move(from, to) {
    if (this.position[from]) {
      const fromPiece = this.position[from];
      this.position[to] = fromPiece;
      delete this.position[from];
      return { from: from, to: to };
    }
  }

  getPosition() {
    return this.position;
  }
};
