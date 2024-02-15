import { Server } from 'http';
import WebSocket from 'ws';

export const setUpWebSocket = (server: Server) => {
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws: WebSocket) => {
		console.log('Client connected');

		ws.on('message', (message: string) => {
			console.log('Received:', message);
			ws.send(`Hello, you sent -> ${message}`);
		});

		ws.on('close', () => {
			console.log('Client disconnected');
		});
	});
};
