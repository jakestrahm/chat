import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import { setUpWebSocket } from './websocket';
import { router as users } from './routes/users'

dotenv.config()
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
setUpWebSocket(server);

app.use(express.json());
app.use('/users', users)


server.listen(PORT, () => {
	console.log(`server running on port ${PORT}`);
});
