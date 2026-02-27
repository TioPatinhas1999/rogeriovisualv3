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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Chave de API (GEMINI_API_KEY) não encontrada no ambiente." })
    }

    // Usando modelos estáveis para garantir compatibilidade
    const model = type === "image" ? "gemini-1.5-flash" : "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body: any = {
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    };

    if (type === "image") {
      body.generationConfig = {
        temperature: 0.4,
        topP: 1,
        topK: 32,
        maxOutputTokens: 2048,
      };
    } else {
      body.system_instruction = {
        parts: [{ text: "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM." }]
      };
    }

    const response = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Gemini API Fetch Error (${response.status}):`, errorText);
      return res.status(response.status).json({ error: `Erro na API do Google: ${response.status}` });
    }

    const data = await response.json()
    
    if (data.error) {
      console.error("Gemini API JSON Error:", data.error);
      return res.status(500).json({ error: data.error.message });
    }

    res.status(200).json(data)
  } catch (error: any) {
    console.error("Vercel Handler Error:", error)
    res.status(500).json({ error: error.message || "Erro interno no servidor" })
  }
}
