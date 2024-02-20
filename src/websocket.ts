import { Server } from 'http';
import WebSocket, { WebSocketServer } from 'ws';

const setUpWebSocket = (server: Server): WebSocketServer => {
	const wss = new WebSocket.Server({ server });

	wss.on('connection', (ws: WebSocket) => {
		console.log('client connected');

		ws.on('message', (message: string) => {
			let json = JSON.stringify(message)
			console.log('received:', message);
			console.log(json)
			ws.send(`hello, you sent -> ${message}`);
		});

		ws.on('close', () => {
			console.log('client disconnected');
		});
	});
	return wss;
};

const printToAllSockets = (req: any, res: any, wss: any) => {
	if (wss.clients.size != 0) {
		wss.clients.forEach((c: any) => {
			let message = "received a request at " + new Date().toString()
			c.send(message)
		})
		console.log("has connections")
		res.send("has connections")
	} else {
		console.log("no connections")
		res.send("no connections")
	}
}

export { setUpWebSocket, printToAllSockets }
