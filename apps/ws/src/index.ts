import WebSocket, { WebSocketServer } from 'ws';
import { GameManager } from './GameManager';
import { parse } from 'url';
import { extractAuthUser } from './auth';
import { IncomingMessage } from 'http';

const wss = new WebSocketServer({ port: 8080 });

const gameManager = new GameManager();

wss.on('connection', function connection(ws: WebSocket, req: IncomingMessage) {
  if (!req.url) {
    ws.close(1008, 'URL is required'); // 1008: Policy Violation
    return;
  }

  const token = parse(req.url, true).query.token as string;
  const user = extractAuthUser(token, ws);
  gameManager.addUser(user);

  ws.on('close', () => {
    gameManager.removeUser(ws);
  });
});

console.log('done');
