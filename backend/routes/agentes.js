import Router from 'express'
import { getAgents, getAgentsID } from '../controllers/agentes.js';

const router = Router();

router.get('/agente', getAgents);
router.get('/agente/:id', getAgentsID)

export default router