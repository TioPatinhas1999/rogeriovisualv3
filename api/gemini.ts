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

    const apiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || "").trim().replace(/^["']|["']$/g, "");
    if (!apiKey) {
      return res.status(500).json({ error: "Chave de API não encontrada. Configure a GOOGLE_API_KEY nas variáveis de ambiente do Vercel." })
    }

    const isImage = type === "image";
    const model = "gemini-1.5-flash-latest";
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

    let data: any;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error("Gemini API returned non-JSON response:", text);
      return res.status(response.status || 500).json({ error: `Resposta inválida da API do Google (${response.status})` });
    }
    
    if (!response.ok || data.error) {
      console.error("Gemini API Error:", data.error || data);
      return res.status(response.status || 500).json({ 
        error: data.error?.message || "Erro na API do Google. Verifique se sua chave de API é válida." 
      });
    }

    res.status(200).json(data)
  } catch (error: any) {
    console.error("Vercel Handler Error:", error)
    res.status(500).json({ error: error.message || "Erro interno no servidor" })
  }
}
