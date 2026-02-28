import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.length < 10) {
        console.error("ERRO: GEMINI_API_KEY não configurada corretamente no painel Secrets.");
        return res.status(500).json({ 
          error: "Configuração Pendente: Por favor, adicione sua chave no painel 'Secrets' (ícone da chave 🔑 à esquerda) com o nome GEMINI_API_KEY." 
        });
      }

      console.log("Tentando comunicação com Gemini... (Chave detectada)");
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Você é o assistente virtual da Rogério Visual, uma empresa de comunicação visual em São João da Boa Vista - SP.
            Informações importantes:
            - Local de atuação: Apenas São João da Boa Vista - SP.
            - Serviços: Fachadas, adesivagem, placas de ACM e PVC, banners e faixas.
            - Diferencial: Serviço de leva e traz para maior conforto.
            - Valores: Geralmente cobrados por m², mas dependem do projeto. Peça para o cliente entrar em contato para um orçamento preciso.
            - Contato: WhatsApp (19) 99221-9448.
            
            Responda de forma profissional, prestativa e curta.
            
            Histórico da conversa: ${JSON.stringify(history)}
            Pergunta do cliente: ${message}` }]
          }
        ]
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      let msg = "Erro na IA: ";
      if (error.message?.includes("API key not valid")) {
        msg += "A chave de API inserida no Secrets é inválida. Verifique se não há espaços extras.";
      } else {
        msg += error.message || "Erro desconhecido";
      }
      res.status(500).json({ error: msg });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
