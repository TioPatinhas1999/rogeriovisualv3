import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

    // Proxy para a lógica do Gemini (simulando o Vercel handler)
  app.post("/api/gemini", async (req, res) => {
    try {
      const { type, message } = req.body;
      
      // Prioridade para a chave GOOGLE_API_KEY conforme solicitado pelo usuário
      let apiKey = (process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY || "").trim().replace(/^["']|["']$/g, "");

      if (!apiKey) {
        console.error("DEBUG: No API key found in environment variables");
        return res.status(500).json({ 
          error: "Chave de API não encontrada. Por favor, adicione a GOOGLE_API_KEY nos Secrets do AI Studio." 
        });
      }

      console.log(`DEBUG: Using API key starting with: ${apiKey.substring(0, 8)}...`);
      
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

      res.status(200).json(result);
    } catch (error: any) {
      console.error("Gemini SDK Error:", error);
      res.status(500).json({ 
        error: error.message || "Erro ao processar sua solicitação com a IA do Google." 
      });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
