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
      let apiKey = process.env.GEMINI_API_KEY;
      
      if (!apiKey) {
        try {
          const envExample = await fs.promises.readFile(path.join(__dirname, ".env.example"), "utf-8");
          const match = envExample.match(/GEMINI_API_KEY=["']?([^"'\n]+)["']?/);
          if (match) apiKey = match[1];
        } catch (e) {
          console.error("Erro ao ler .env.example:", e);
        }
      }

      if (!apiKey) {
        return res.status(500).json({ error: "API Key não configurada." });
      }
      
      const isImage = type === "image";
      const model = isImage ? "gemini-2.5-flash-image" : "gemini-1.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const systemPrompt = "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português. A empresa faz fachadas, adesivagem residencial e de veículos, banners, faixas e placas PVC/ACM.";
      
      const fullPrompt = isImage ? message : `${systemPrompt}\n\nPergunta do cliente: ${message}`;

      const body: any = {
        contents: [
          {
            parts: [{ text: fullPrompt }]
          }
        ]
      };

      if (isImage) {
        body.generationConfig = {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: size || "1K"
          }
        };
      }

      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        console.error("Gemini API Error:", data.error || data);
        return res.status(response.status || 500).json({ error: data.error?.message || "Erro na API do Google" });
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
