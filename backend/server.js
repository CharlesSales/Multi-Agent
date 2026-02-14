import express from 'express';
import env from 'dotenv';
import chatRoutes from './routes/chat.js';
import agenteRoutes from './routes/agentes.js'
import cors from 'cors'

env.config();

const app = express();
const front = precess.env.FRONTEND

app.use(express.json());
app.use(cors({
  origin: front, // seu front-end
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // se precisar de cookies/autenticação
}));
const port = process.env.PORT;

app.use(express.json());
app.use('/api', chatRoutes);
app.use('/api', agenteRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});