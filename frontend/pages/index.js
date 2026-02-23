import Link from 'next/link'
import { useState, useEffect } from 'react';

export default function Home() {
  const [agentes, setAgentes] = useState([]);
  const backend = 'http://localhost:3000';
  // const backend = process.env.NEXT_PUBLIC_RENDER_URL  || 'http://localhost:3000';

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(`${backend}/api/agente`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        setAgentes(data || []);
      } catch (err) {
        console.error('Erro ao buscar agentes', err);
        setAgentes([]);
      }
    }
    fetchAgents();
  }, [backend]);

  return (
    <main className="container" style={{ position: 'relative', paddingTop: 88, height: '100vh' }}>
      <h1 style={{
        position: 'absolute',
        top: 80,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: '#0078FF',
        margin: 0,
        zIndex: 2
      }}>Escolha um agente</h1>

      <h1 style={{
        position: 'absolute',
        top: 10,
        left: '100%',
        right: 0,
        textAlign: 'center',
        color: '#7c3aed',
        margin: 0,
        zIndex: 2
      }}>
        <Link href={`/documentacao`}>Readme</Link>
      </h1>

      <div className="agent-grid">
        {agentes.length === 0 ? (
          <p style={{ textAlign: 'center', width: '100%' }}>Carregando agentes...</p>
        ) : (
          agentes.map(a => (
            <Link key={a.id} href={`/agent/${a.id}`}>
              <div className={`agent-card ${a.accent}`}>
                <strong>{a.nome}</strong>
                <p className="agent-desc">{a.especialidade.nome_especialidade}</p>
                <p className="agent-desc">{a.descricao}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  )
}