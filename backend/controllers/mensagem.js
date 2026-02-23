import supabase from '../config/supabaseClient.js'
import { runChat } from "../services/geminiChat.js";
import { Memoria } from '../services/chatMemory.js'
import { chatWithAgent } from '../services/openRoute.js';

export async function sendMessage(req, res) {
    try {
        const { especialidade } = req.params;
        const { userID, message } = req.body;

        if (!userID || !message) {
            return res.status(400).json({ error: 'userID e message são obrigatorios' })
        }

        const { data, error } = await supabase
            .from("agente")
            .select("*")
            .eq('especialidade', especialidade)
            .single()
        
            
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(400).json({
                message: 'O codigo quebrou'
            })
        }

        Memoria.addMessage(userID, 'user', message);

        const historico = Memoria.getHistorico(userID)
            .map(m => `${m.role === 'user' ? 'Usuário' : 'Bot'}: ${m.content}`)
            .join(' ');

        const prompt = `${historico} ${data.prompt} Usuário: ${message}`;

        if (
            !message ||
            typeof message !== "string" ||
            message.trim().length === 0
        ) {
            return res.status(400).json({
                error: "Mensagem vazia ou inválida"
            });
        }

        const respostaIA = await runChat(message.trim(), prompt);

        const respostaLimpa = respostaIA
            .replace(/\n+/g, " ")
            .replace(/\s+/g, " ")
            .trim();


        return res.json({
            user: message,
            bot: respostaLimpa
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}


export async function sendMessageOpenRoute(req, res) {
    try {
        const { especialidade } = req.params;
        const { userID, message } = req.body;

        if (!userID || !message) {
            return res.status(400).json({ error: 'userID e message são obrigatorios' })
        }

        if (typeof message !== "string" || message.trim().length === 0) {
            return res.status(400).json({ error: "Mensagem vazia ou inválida" });
        }

        const { data, error } = await supabase
            .from("agente")
            .select("*")
            .eq('especialidade', especialidade)
            .single()
        
        if (error) {
            console.error('Supabase error:', error);
            return res.status(500).json({ error: error.message });
        }

        if (!data) {
            return res.status(404).json({ error: 'Agente não encontrado' })
        }

        console.log('Usando o apenRoutes')

        Memoria.addMessage(userID, 'user', message);

        const respostaIA = await chatWithAgent(message.trim(), data.prompt);

        const respostaLimpa = respostaIA
            .replace(/\n+/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        Memoria.addMessage(userID, 'bot', respostaLimpa);

        return res.json({
            user: message,
            bot: respostaLimpa
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
    }
}
