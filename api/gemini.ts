import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Habilitar CORS para o Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { type, message, size } = req.body

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave de API não encontrada. Configure a GEMINI_API_KEY nas variáveis de ambiente do Vercel." })
    }

    const isImage = type === "image";
    const model = "gemini-3-flash-preview";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const systemPrompt = "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM.";
    
    const fullPrompt = isImage 
      ? `Gere uma descrição detalhada de um projeto de comunicação visual para: ${message}. O objetivo é simular como ficaria o serviço.`
      : `${systemPrompt}\n\nPergunta do cliente: ${message}`;

    const body = {
      contents: [
        {
          parts: [{ text: fullPrompt }]
        }
      ]
    };

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error || data);
      return res.status(response.status || 500).json({ 
        error: data.error?.message || "Erro na API do Google. Verifique se sua chave de API é válida e tem permissão para o modelo Gemini 1.5 Flash." 
      });
    }

    res.status(200).json(data)
  } catch (error: any) {
    console.error("Vercel Handler Error:", error)
    res.status(500).json({ error: error.message || "Erro interno no servidor" })
  }
}
