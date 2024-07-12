import { WebSocket } from 'ws';
import { GAME_OVER, INIT_GAME, MOVE } from './messages';
import { Chess } from 'chess.js';

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startDate: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startDate = new Date();
    this.player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: 'white',
        },
      })
    );
    this.player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: 'black',
        },
      })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // Validate player turn
    const isPlayer1Turn = this.moveCount % 2 === 0;
    if ((isPlayer1Turn && socket !== this.player1) || (!isPlayer1Turn && socket !== this.player2)) {
      console.error("Invalid move: Not this player's turn.");
      return;
    }

    // Attempt the move
    try {
      this.board.move(move);
    } catch (e) {
      console.error('Invalid move:', e);
      return;
    }

    // Check for game over
    if (this.board.isGameOver()) {
      const winner = this.board.turn() === 'w' ? 'black' : 'white';
      const gameOverMessage = JSON.stringify({
        type: GAME_OVER,
        payload: { winner },
      });
      this.player1.send(gameOverMessage);
      this.player2.send(gameOverMessage);
      return;
    }

    // Broadcast move to both players
    const moveMessage = JSON.stringify({ type: MOVE, payload: move });
    this.player1.send(moveMessage);
    this.player2.send(moveMessage);

    // Increment move count
    this.moveCount++;
  }
}
