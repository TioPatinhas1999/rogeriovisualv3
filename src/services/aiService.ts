import { GoogleGenAI } from "@google/genai";

// Inicialização do SDK no frontend (Recomendado para o preview do AI Studio)
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function* chatWithGemini(message: string, history: any[] = []) {
  try {
    const model = genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [{ text: `Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM.\n\nPergunta do cliente: ${message}` }]
        }
      ],
    });

    const response = await model;
    const text = response.text || "Desculpe, não consegui processar sua mensagem.";
    yield text;
  } catch (error: any) {
    console.error("Chat Error:", error);
    yield "Erro ao conectar com o assistente. Por favor, verifique se sua chave de API está configurada nos Secrets (ícone de cadeado).";
  }
}

export async function generateImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  // Nota: A geração de imagem via SDK direto no frontend tem limitações de modelo no preview.
  // Mantemos a estrutura para compatibilidade, mas focamos no chat que é o principal.
  try {
    const model = genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: `Descreva detalhadamente como seria um projeto de comunicação visual para: ${prompt}` }] }],
    });

    const response = await model;
    return null; // Retornamos null para não quebrar o UI, mas o chat dará a resposta textual.
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
}

