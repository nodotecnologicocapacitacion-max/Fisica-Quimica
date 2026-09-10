import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Simple in-memory cache to save API quota
const reviewCache = new Map<string, string[]>();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API route for generating quick review
  app.post("/api/review", async (req, res) => {
    try {
      const { moduleName } = req.body;
      if (!moduleName) {
        return res.status(400).json({ error: "moduleName is required" });
      }

      // Return cached response if available
      const cacheKey = moduleName.toLowerCase().trim();
      if (reviewCache.has(cacheKey)) {
        return res.json({ concepts: reviewCache.get(cacheKey) });
      }

      const prompt = `Generate a quick review summary for a middle/high school physics/chemistry module titled '${moduleName}'. 
      Provide exactly 3-5 bullet points of key concepts. 
      Keep them short, engaging, and in Spanish. 
      Return ONLY a valid JSON array of strings, with no markdown formatting or extra text. Example: ["concept 1", "concept 2"]`;

      let concepts: string[] = [];
      try {
        let response;
        let retries = 3;
        let delay = 1000;
        
        while (retries > 0) {
          try {
            response = await ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: prompt,
            });
            break;
          } catch (err: any) {
            retries--;
            
            // Fast-fail if it's a 429 quota exhausted error with a long retry delay (daily limit)
            if (err?.status === 429 || err?.message?.includes("Quota exceeded")) {
               if (retries === 0) throw err;
            } else if (retries === 0) {
               throw err;
            }

            await new Promise((resolve) => setTimeout(resolve, delay));
            delay *= 2;
          }
        }

        const text = response?.text || "[]";
        try {
          const match = text.match(/\[([\s\S]*?)\]/);
          const jsonStr = match ? match[0] : "[]";
          concepts = JSON.parse(jsonStr);
          
          // Cache successful response
          if (concepts.length > 0) {
            reviewCache.set(cacheKey, concepts);
          }
        } catch (e) {
          console.error("Failed to parse JSON from AI response:", text);
          throw new Error("Invalid Format");
        }
      } catch (error: any) {
        console.error("Error generating review, using fallback:", error?.message || error);
        
        // Fallback robusto en caso de error de API (ej. límite de cuota)
        const fallbackData: Record<string, string[]> = {
          "materia": [
            "La materia es todo aquello que tiene masa y ocupa volumen.",
            "Propiedades intensivas: no dependen de la cantidad (densidad, punto de ebullición).",
            "Propiedades extensivas: dependen de la cantidad (peso, volumen).",
            "Puede presentarse en estado sólido, líquido, gaseoso o plasma."
          ],
          "energía": [
            "La energía es la capacidad de realizar un trabajo o producir cambios.",
            "Principio de conservación: no se crea ni se destruye, solo se transforma.",
            "Energía Cinética: asociada al movimiento (depende de la masa y velocidad).",
            "Energía Potencial: asociada a la posición o altura respecto al suelo."
          ],
          "calor": [
            "El calor es energía térmica en tránsito de un cuerpo de mayor a menor temperatura.",
            "Mecanismos de transferencia: Conducción, Convección y Radiación.",
            "Temperatura: medida de la energía cinética promedio de las partículas.",
            "Calor específico: energía necesaria para elevar la temperatura de una sustancia."
          ]
        };

        const moduleKey = moduleName.toLowerCase().trim();
        concepts = fallbackData[moduleKey] || [
          `Conceptos fundamentales sobre ${moduleName}.`,
          "Propiedades y características principales del fenómeno físico/químico.",
          "Estudio de las variables, fórmulas y unidades de medida aplicables."
        ];
        
        reviewCache.set(cacheKey, concepts);
      }
      res.json({ concepts });
    } catch (error: any) {
      console.error("Error generating review:", error);
      if (error?.status === 429 || error?.message?.includes("Quota exceeded") || error?.message?.includes("429")) {
        res.status(429).json({ error: "Has alcanzado el límite de uso de IA (Cuota excedida). Intenta más tarde." });
      } else {
        res.status(500).json({ error: "Failed to generate review" });
      }
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
