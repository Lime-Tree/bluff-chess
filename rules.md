# Rules for Bluff Chess
## Controls
  - Move real piece: left click (hold) + left click (release)
  - Move bluffed piece: left click (hold) + left click (release)
  - Bluff move: right click (hold) + right click (release)

## Movement Rules
  - Pieces move in the same direction as in regular chess.
  - Enemy pieces are not considered when validating moves (i.e., if a move input is valid on a chess board with no enemy pieces, then it's valid in bluff chess).
  - Three choices for moves per turn:
    - Move a regular piece
    - Move a bluffed piece
    - Bluff move a regular piece
  - A bluff move creates a *bluffed piece* that is bound to the real piece. The real piece stays in place, while a bluffed piece is created and moved.

## Examples for Basic Rules
### Making a Bluff Move 
<table><tr>
<td> <img src="assets/example2.png"  style="width: 400px;"/> </td>
<td> <img src="assets/example3.png"  style="width: 400px;"/> </td>
</tr></table>
In this example, we start off
the game by bluffing the move e4. Now, the bluffed pawn on e4 is bound to the real pawn on e2. Black cannot see the real piece on e2 and instead sees the bluffed piece on e4.



### Valid Move Input
<img src = "assets/example1.png" style="width: 400px;"/>

In this example, clicking the rook on d1 and moving it to d8 would be a valid move input. This does not mean that the rook will end up on d8 after the move. However, the move will go through and where the rook ends up will depend on which pawns are real and which are bluffed.


## Capturing/Collision Rules
  - When a real piece gets captured, if it has a bound bluffed piece, the bluffed piece disappears.
  - When a bluffed piece gets captured, the bluffed piece disappears and the bound real piece is revealed.
  - Real pieces can capture both bluffed pieces and real pieces.
  - Bluffed pieces can only capture other bluffed pieces.
  - A bluffed piece does not destroy itself when capturing another bluffed piece.
  - Only real pieces can stop a real piece's movement.

## Examples of Captures
### Multiple Captures 
<table><tr>
<td> <img src="assets/example5.png"  style="width: 400px;"/> </td>
<td> <img src="assets/example4.png"  style="width: 400px;"/> </td>
</tr></table>
In this example, we input the move Rd7. Here, the bishop on d4 is a bluffed piece bound to the bishop on g7. The pawn on d5 is also a bluffed piece, and is binded to the pawn on d7. The rook on d6 is real. Since bluffed pieces do not stop real piece movement, the move Rd7 will capture both the bishop on d4 and the pawn on d5, and is finally stopped by the real rook on d7.
<table><tr>
<td> <img src="assets/example6.png"  style="width: 400px;"/> </td>
<td> <img src="assets/example7.png"  style="width: 400px;"/> </td>
</tr></table>
Notice that the real pieces are revealed after their bound bluffed pieces are captured.

## Binding Rules
  - Moving a real piece that is bound to a bluffed piece will destroy the bound bluffed piece.
  - Making a bluff move with a real piece that is bound to a bluffed piece will destroy the currently bound bluffed piece before creating a new bluffed piece to be bound to.

## Check/Checkmate Rules
 - There are no checks in bluff chess. 
 - Bluff chess is won when a real king is captured.
 - Enemy pieces cannot restrict castling. 


