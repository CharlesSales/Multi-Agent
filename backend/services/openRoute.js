export async function chatWithAgent(userMessage, systemPrompt = "") {
  try {
    console.log('Enviando para OpenRouter:', { userMessage, systemPrompt });

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTE}`,
        "Content-Type": "application/json",
        "HTTP-Referer": `${process.env.FRONTEND}`
      },
      body: JSON.stringify({
        model: "liquid/lfm-2.5-1.2b-thinking:free",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: 0.4
      })
    });

    const data = await response.json();

    console.log('Resposta OpenRouter completa:', JSON.stringify(data, null, 2));

    if (!response.ok) {
      console.error('OpenRouter API error:', data);
      throw new Error(`API error: ${response.status} - ${data.error?.message || 'Unknown error'}`);
    }

    const conteudo = data.choices[0]?.message?.content;
    console.log('Conteúdo extraído:', conteudo);

    if (!conteudo) {
      throw new Error('Resposta vazia da OpenRouter');
    }

    return conteudo;

  } catch (error) {
    console.error('OpenRouter error:', error.message);
    throw error;
  }
}