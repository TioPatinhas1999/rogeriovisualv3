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
      // Tenta pegar do ambiente, se não existir tenta ler do .env.example como fallback para o preview
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
        console.error("ERRO: GEMINI_API_KEY não encontrada.");
        return res.status(500).json({ error: "API Key não configurada. Por favor, configure a GEMINI_API_KEY." });
      }
      
      console.log(`Processando requisição do tipo: ${type}`);

      // Usando modelos extremamente estáveis
      const model = type === "image" ? "gemini-1.5-flash" : "gemini-1.5-flash";
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

      const body: any = {
        contents: [{ parts: [{ text: message }] }],
      };

      if (type === "image") {
        // Para o gemini-1.5-flash, a geração de imagem não é direta via texto puro no generateContent 
        // da mesma forma que os modelos específicos de imagem. 
        // Mas vamos manter a estrutura e tentar o modelo flash que é o mais provável de estar disponível.
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Gemini API Fetch Error (${response.status}):`, errorText);
        return res.status(response.status).json({ error: `Erro na API do Google: ${response.status}` });
      }

      const data = await response.json();
      
      if (data.error) {
        console.error("Gemini API JSON Error:", data.error);
        return res.status(500).json({ error: data.error.message });
      }

      console.log("Resposta recebida com sucesso da API Gemini");
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
