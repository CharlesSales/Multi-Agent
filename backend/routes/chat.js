import { Router } from 'express';
import { sendMessage } from "../controllers/mensagem.js";


const router = Router();

router.post('/chat/:especialidade', sendMessage);

export default router;