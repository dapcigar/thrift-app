import { WebSocket } from 'ws';
import { Server } from 'http';
import jwt from 'jsonwebtoken';

export class WebSocketServer {
  private wss: WebSocket.Server;
  private connections: Map<string, WebSocket> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocket.Server({ server });
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', async (ws: WebSocket, req: any) => {
      try {
        // Extract token from query string
        const token = new URL(req.url, 'http://localhost')
          .searchParams.get('token');

        if (!token) {
          ws.close(1008, 'Token required');
          return;
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        
        // Store connection
        this.connections.set(decoded.id, ws);

        // Handle disconnection
        ws.on('close', () => {
          this.connections.delete(decoded.id);
        });

        // Handle messages
        ws.on('message', (message: string) => {
          this.handleMessage(decoded.id, message);
        });

      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });
  }

  private handleMessage(userId: string, message: string) {
    try {
      const data = JSON.parse(message);
      // Handle different message types
      switch (data.type) {
        case 'PING':
          this.sendToUser(userId, { type: 'PONG' });
          break;
        // Add more message handlers
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  }

  public sendToUser(userId: string, data: any) {
    const ws = this.connections.get(userId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  public broadcast(data: any) {
    this.connections.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      }
    });
  }
}