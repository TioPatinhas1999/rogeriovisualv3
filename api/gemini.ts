import type { VercelRequest, VercelResponse } from '@vercel/node'
import { GoogleGenAI } from "@google/genai"

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
    const { type, message } = req.body

    const apiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || "").trim().replace(/^["']|["']$/g, "");
    if (!apiKey) {
      return res.status(500).json({ error: "Chave de API não encontrada. Configure a GOOGLE_API_KEY nas variáveis de ambiente do Vercel." })
    }

    const genAI = new GoogleGenAI({ apiKey });
    const systemPrompt = "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM.";
    
    const isImage = type === "image";
    const fullPrompt = isImage 
      ? `Gere uma descrição detalhada de um projeto de comunicação visual para: ${message}. O objetivo é simular como ficaria o serviço.`
      : `${systemPrompt}\n\nPergunta do cliente: ${message}`;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
    });

    res.status(200).json(result)
  } catch (error: any) {
    console.error("Vercel Handler Error:", error)
    res.status(500).json({ error: error.message || "Erro ao processar sua solicitação com a IA do Google." })
  }
}
