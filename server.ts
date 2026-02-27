import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

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
      const { type, message, size } = req.body;
      
      // Prioridade para a chave injetada pelo sistema
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) {
        return res.status(500).json({ 
          error: "Chave de API não encontrada. Por favor, adicione a GEMINI_API_KEY nos Secrets do AI Studio." 
        });
      }
      
      const isImage = type === "image";
      // Usando o modelo flash que é o mais estável e gratuito
      const model = "gemini-1.5-flash";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        console.error("Gemini API Error:", data.error || data);
        return res.status(response.status || 500).json({ 
          error: data.error?.message || "Erro na API do Google. Verifique se sua chave de API é válida e tem permissão para o modelo Gemini 1.5 Flash." 
        });
      }

      res.status(200).json(data);
    } catch (error: any) {
      console.error("Server Error:", error);
      res.status(500).json({ error: error.message || "Erro interno no servidor" });
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
