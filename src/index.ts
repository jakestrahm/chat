import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import { errorHandler } from './middleware/error'
import { printToAllSockets, setUpWebSocket } from './websocket';
import { registerUserRoutes } from './routes/user'
import { sql } from './db/db';

dotenv.config()
const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const wss = setUpWebSocket(server);

app.use(express.json());

//routes
app.use('/user', registerUserRoutes(sql))
app.use('/test', (req, res) => {
    printToAllSockets(req, res, wss)
})

//middleware (must be after routes)
app.use(errorHandler)

server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});
