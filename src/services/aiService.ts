// aiService.ts
// Usamos o backend proxy para evitar expor a chave de API no frontend e garantir funcionamento no Vercel

export async function* chatWithGemini(message: string, history: any[] = []) {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "chat",
        message,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Erro na API";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Se não for JSON, tenta pegar o texto
        try {
          const textError = await response.text();
          errorMessage = textError || `Erro ${response.status}`;
        } catch (e2) {
          errorMessage = `Erro ${response.status}`;
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Desculpe, não consegui processar sua mensagem.";
    
    yield text;
  } catch (error: any) {
    console.error("Chat Error:", error);
    yield `Erro ao conectar com o assistente: ${error.message || "Verifique sua chave de API"}`;
  }
}

export async function generateImage(prompt: string, size: "1K" | "2K" | "4K" = "1K") {
  try {
    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "image",
        message: prompt,
        size
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    // O modelo flash-preview pode retornar texto descrevendo a imagem em vez de dados binários
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
}

