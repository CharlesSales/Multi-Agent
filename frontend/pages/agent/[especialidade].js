import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

const Chat = dynamic(() => import('../../components/Chat'), { ssr: false })

export default function AgentPage() {
  const router = useRouter()
  const { especialidade } = router.query
  const [agentes, setAgentes] = useState([]);
  const backend = process.env.NEXT_PUBLIC_RENDER_URL  || 'http://localhost:3000';
  
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(`${backend}/api/agente`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        // normaliza a resposta para garantir um array
        const list = Array.isArray(data) ? data : Array.isArray(data?.agentes) ? data.agentes : [];
        setAgentes(list);
      } catch (err) {
        console.error('Erro ao buscar agentes', err);
        setAgentes([]);
      }
    }
    fetchAgents();
  }, [backend]);

  // encontra agente pelo id ou pela especialidade, ou pega o primeiro
  const agenteSelecionado = (Array.isArray(agentes) ? agentes.find(a =>
    String(a.id) === String(especialidade) ||
    a.especialidade?.nome_especialidade === especialidade
  ) : undefined) || (Array.isArray(agentes) && agentes.length ? agentes[0] : undefined);

  const nomeAgente = agenteSelecionado?.nome || ' ';

  return (
    <main style={{ padding: 24, fontFamily: 'Arial, sans-serif' }}>
       <div style={{ marginBottom: 12 }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#0078FF' }}>← Voltar</Link>
      </div>
      <h1 style={{ color: '#0078FF', textAlign: 'center', marginBottom: 20 }}>
        {nomeAgente}
      </h1>
      <div style={{ marginTop: 12 }}>
        <Chat especialidade={nomeAgente} />
      </div>
    </main>
  )
}
