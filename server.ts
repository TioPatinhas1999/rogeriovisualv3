import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

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
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.error("ERRO: GEMINI_API_KEY não encontrada no process.env");
        return res.status(500).json({ error: "API Key não configurada" });
      }
      
      console.log(`Processando requisição do tipo: ${type}`);

      const model = type === "image" ? "gemini-3.1-flash-image-preview" : "gemini-3-flash-preview";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const body: any = {
        contents: [{ parts: [{ text: message }] }],
      };

      if (type === "image") {
        body.generationConfig = {
          imageConfig: { aspectRatio: "1:1", imageSize: size || "1K" }
        };
      } else {
        body.systemInstruction = {
          parts: [{ text: "Você é o assistente virtual da RogérioVisual, uma empresa de comunicação visual em São João da Boa Vista - SP. Seja profissional, prestativo e responda em português." }]
        };
      }

      const response = await fetch(`${endpoint}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro interno no servidor" });
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
