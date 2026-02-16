import { useState, useRef, useEffect } from 'react';

export default function ChatMessenger({ especialidade = '3' }) {
  const [userID] = useState('user1');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef(null);
  const [loadingAgent, setLoadingAgent] = useState(true)
  const backend = process.env.NEXT_PUBLIC_RENDER_URL;
  const backend_local = 'http://localhost:3000';
  const [botName, setBotName] = useState('Agente');
  const [profissao, setProfissao] = useState()
  const [agenteId, setAgenteId] = useState(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch(`${backend_local}/api/agente`);
        const data = await res.json();

        const lista =
          Array.isArray(data) ? data :
            Array.isArray(data.agentes) ? data.agentes :
              Array.isArray(data.data) ? data.data :
                [];

        console.log('Resposta /api/agente:', data);
        console.log('Lista normalizada:', lista);
        console.log('Especialidade recebida:', especialidade);

        const agenteSelecionado = lista.find(a =>
          String(a.id) === String(especialidade) ||
          String(a.especialidade?.id) === String(especialidade) ||
          a.especialidade?.nome_especialidade === especialidade ||
          a.nome === especialidade   // ✅ CORREÇÃO IMPORTANTE
        );


        if (agenteSelecionado) {
          setBotName(agenteSelecionado.nome);
          setProfissao(agenteSelecionado.especialidade);
          setAgenteId(agenteSelecionado.id);
        }

      } catch (err) {
        console.error('Erro ao buscar agentes:', err);
      } finally {
        setLoadingAgent(false);
      }
    }


    fetchAgents();
  }, [backend_local, especialidade]);


  async function send() {
    if (!message.trim()) return;

    if (!agenteId) {
      console.warn('Agente ainda não carregado');
      return;
    }

    const payload = { userID, message };

    setMessages(prev => [
      ...prev,
      { role: 'user', text: message, time: new Date() }
    ]);

    setMessage('');
    setIsThinking(true);

    try {
      const res = await fetch(`${backend_local}/api/chat/${agenteId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: res.ok ? data.bot : (data.error || 'Erro no servidor'),
          time: new Date()
        }
      ]);

    } catch (e) {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: e.message, time: new Date() }
      ]);
    } finally {
      setIsThinking(false);
    }
  }


  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const formatDate = (date) =>
    date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' });


  return (
    <div style={{
      maxWidth: 600,
      height: '80vh',
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 16,
      overflow: 'hidden',
      fontFamily: 'Arial, sans-serif',
      background: '#f9f9f9',
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid #ddd',
        background: '#0078FF',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
      }}>
        Chat com {botName}
      </div>

      <div>
        {loadingAgent ? 'Carregando agente...' : `Chat com ${botName}`}
      </div>


      {/* Messages */}
      <div style={{ flex: 1, padding: 16, overflowY: 'auto', background: '#e5ddd5' }}>
        <style>{`
          .thinking-dot { width:8px; height:8px; background:#333; border-radius:50%; opacity:.25; transform:translateY(0); animation:thinking-dot 900ms infinite ease-in-out; display:inline-block; }
          .thinking-dot:nth-child(2){ animation-delay:150ms; }
          .thinking-dot:nth-child(3){ animation-delay:300ms; }
          @keyframes thinking-dot {
            0%,80%,100%{ transform:translateY(0); opacity:.25 }
            40%{ transform:translateY(-8px); opacity:1 }
          }
        `}</style>

        {messages.map((m, i) => {
          const prevDate = i > 0 ? messages[i - 1].time : null;
          const showDate = !prevDate || formatDate(prevDate) !== formatDate(m.time);
          return (
            <div key={i} style={{ marginBottom: 12 }}>
              {showDate && (
                <div style={{ textAlign: 'center', margin: '12px 0', fontSize: 12, color: '#555' }}>
                  {formatDate(m.time)}
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: 20,
                  background: m.role === 'user' ? '#0078FF' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#333',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                  wordBreak: 'break-word',
                  position: 'relative',
                  transition: 'background 0.2s'
                }}>
                  {m.text}
                  <div style={{ fontSize: 10, color: m.role === 'user' ? '#e0e0e0' : '#888', textAlign: 'right', marginTop: 4 }}>
                    {formatTime(m.time)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isThinking && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: 20,
                background: '#fff',
                color: '#333',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                wordBreak: 'break-word',
                position: 'relative',
              }}>
                <div aria-live="polite" style={{ display: 'inline-flex', alignItems: 'flex-end', gap: 6 }}>
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                  <span className="thinking-dot" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #ddd', background: '#f5f5f5', gap: 8 }}>
        <textarea
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
          style={{
            flex: 1,
            borderRadius: 20,
            border: '1px solid #ccc',
            padding: 10,
            resize: 'none',
            fontSize: 14,
          }}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
        />
        <button
          onClick={send}
          disabled={!agenteId}
          style={{
            padding: '0 20px',
            borderRadius: 20,
            border: 'none',
            background: !agenteId ? '#999' : '#0078FF',
            color: '#fff',
            fontWeight: 'bold',
            cursor: !agenteId ? 'not-allowed' : 'pointer',
            fontSize: 14,
          }}
        >
          Enviar
        </button>

      </div>
    </div>
  );
}
