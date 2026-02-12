# 🤖 Multi-Agent AI Chatbot

Um ecossistema de agentes especializados (Médico, Jurídico, Programador, etc.) desenvolvido para estudar a integração entre modelos de linguagem (LLMs) e arquiteturas de software modernas. O projeto foca na separação de responsabilidades entre frontend e backend, além do gerenciamento dinâmico de personas via banco de dados.

## 🚀 Diferenciais Técnicos

Este projeto não é apenas uma interface de chat, mas um laboratório de engenharia focado em:
- **Gestão de Personas via Banco:** As instruções de comportamento (System Prompts) são dinâmicas e recuperadas do Supabase, permitindo criar novos agentes sem alterar o código.
- **Arquitetura Desacoplada:** Backend independente em Node.js para atuar como middleware seguro, protegendo API Keys e centralizando a lógica de negócio.
- **Otimização de Contexto:** Implementação de janela de memória para controle de tokens e coerência da conversa.

---

## 🏗️ Arquitetura do Sistema

### Frontend: Next.js
- Interface reativa e modular com foco em UX.
- Gerenciamento de estado da conversa no lado do cliente.
- Troca dinâmica de agentes baseada em metadados injetados pelo backend.

### Backend: Node.js + Express
- **Middleware de IA:** Processa a lógica de prompts e faz a ponte com as APIs do Google Gemini e OpenAI.
- **Segurança:** Isolamento das credenciais sensíveis e sanitização de inputs.
- **Integração:** Conexão direta com Supabase para recuperação de configurações de agentes.

### Banco de Dados: Supabase
- Armazenamento dos atributos de cada agente (nome, especialidade e o prompt base).

---

## 🧠 Decisões de Engenharia & Aprendizados

### 1. Janela de Memória (Context Window)
Para manter o fio da conversa sem estourar o limite de tokens ou aumentar o custo, o sistema envia apenas as **5 mensagens mais recentes** como contexto. Isso equilibra a retenção de memória da IA com a eficiência da requisição.

### 2. Parametrização (Temperatura 0.7)
Utilizo `temperature: 0.7` para garantir que os agentes sejam comunicativos e naturais. 
> *Insight:* Identifiquei que valores menores seriam ideais para o agente "Programador" (maior precisão), enquanto valores maiores favoreceriam agentes criativos.

### 3. Diagnóstico de Performance (Desafio)
Atualmente, o sistema apresenta uma latência média de **20 segundos**. 
- **Causa:** O backend aguarda a geração completa do texto pela LLM para enviar o JSON ao frontend.
- **Solução Futura:** Implementar **Streaming (Server-Sent Events)** para que o usuário visualize o texto em tempo real conforme ele é gerado.

