import React from "react";

export default function RelatorioChatbot() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>
        Chatbot Multiagente
      </h1>
      <p style={styles.subtitle}>
        Explorando a integração de LLMs e Arquitetura de Software
      </p>

      <Section title="1. Objetivo do Projeto">
        <p>
          Este projeto foi desenvolvido como um laboratório de estudos para
          aprofundar conhecimentos em integração de APIs de Inteligência
          Artificial, comunicação entre Sistemas Distribuídos (Frontend e
          Backend independentes) e o gerenciamento de estados de conversação. O
          objetivo central é permitir que um único sistema assuma diferentes
          personas (agentes) dinamicamente.
        </p>
      </Section>

      <Section title="2. Arquitetura e Decisões de Engenharia">
        <h3>Backend desacoplado (Node.js/Express)</h3>
        <p>
          Diferente de uma abordagem monolítica, optei por separar o Backend do
          Next.js. O motivo principal foi o estudo da criação de APIs REST,
          tratamento de rotas e segurança de chaves (API Keys), simulando um
          ambiente de produção onde o backend atua como um middleware seguro
          entre o cliente e os serviços de LLM (Gemini/OpenAI).
        </p>

        <h3>Gestão Dinâmica de Agentes</h3>
        <p>
          A inteligência do sistema não está direto no codigo. Foi adotada uma
          arquitetura orientada a dados, na qual as instruções de comportamento
          (System Prompts) de cada agente são armazenadas no Supabase. Dessa
          forma, novos agentes podem ser criados apenas adicionando registros no
          banco de dados, sem necessidade de novo deploy no backend.
        </p>

        <h3>Memória e Contexto (Windowing)</h3>
        <p>
          Para manter coerência nas respostas sem elevar custo ou latência,
          implementei uma técnica de Janela de Contexto. O sistema recupera e
          envia apenas as cinco mensagens mais recentes do histórico. Nesta fase
          de estudos, o histórico foi mantido em memória no lado do cliente,
          priorizando simplicidade e velocidade de prototipagem.
        </p>
      </Section>

      <Section title="3. Desafios Encontrados e Lições Aprendidas">
        <h3>O Problema da Latência</h3>
        <p>
          Atualmente, o sistema apresenta um tempo médio de resposta de
          aproximadamente 20 segundos. O envio da resposta em um
          único bloco gera uma percepção negativa de performance. Isso levou ao
          entendimento da importância do Streaming de dados (Server-Sent Events)
          para interfaces conversacionais.
        </p>

        <h3>Parametrização de LLMs (Temperatura)</h3>
        <p>
          Durante o desenvolvimento, foi explorado o parâmetro <code>temperature</code>,
          atualmente fixado em 0.7. Esse valor demonstrou bom equilíbrio entre
          previsibilidade e criatividade. Como evolução, planeja-se tornar esse
          parâmetro dinâmico conforme o perfil do agente.
        </p>
      </Section>

      <Section title="4. Próximos Passos e Roadmap">
        <ul>
          <li>Implementação de Streaming para melhorar a UX percebida</li>
          <li>Tratamento de erros robusto com timeouts e fallbacks</li>
          <li>Dashboard administrativo para gestão de agentes</li>
          <li>Otimização de contexto via sumarização</li>
        </ul>
      </Section>

      <Section title="📂 Acesso ao Projeto">
        <p>
          O código completo, incluindo as configurações de rotas e a lógica de
          integração, está disponível no GitHub:
        </p>
        <a href="#" style={styles.link}>
          Ver Repositório no GitHub
        </a>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.sectionContent}>{children}</div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    lineHeight: "1.6",
    color: "#222",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    marginTop: 0,
    color: "#666",
  },
  section: {
    marginTop: "30px",
  },
  sectionTitle: {
    borderBottom: "1px solid #ddd",
    paddingBottom: "5px",
  },
  sectionContent: {
    marginTop: "10px",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
