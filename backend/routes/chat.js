import { Router } from 'express';
import { sendMessage, sendMessageOpenRoute } from "../controllers/mensagem.js";


const router = Router();

router.post('/chat/:especialidade', sendMessage);
router.post('/chat/openRoute/:especialidade', sendMessageOpenRoute);

export default router;