import supabase from "../config/supabaseClient.js";

export async function getAgents(req, res) {
    try {
        const { data, error } = await supabase
            .from('agente')
            .select(`
                id,
                nome,
                especialidade(
                    nome_especialidade
                ),
                descricao`)
            .order('id', {ascending: true})
        
        if (error) {
            res.status(404).json({
                message: 'erro ao buscar',
                error: error.message
            })
        }

        res.status(200).json(data)

    } catch {
        return res.status(500).json({
            error: "Erro no servidor"
        })
    }
}

export async function getAgentsID(req, res) {
    try {
        const { especialidade } = req.params;
        const { data, error } = await supabase
            .from('agente')
            .select('*')
            .eq('especialidade', especialidade)
            .single();

        if (error) {
            return res.status(400).json({
                message: "deu alguma merda",
                error: error.message
            });

        }
        return res.json(data)
    } catch {
        return res.status(500).json({
            error: "erro no servidor"
        })
    }
}