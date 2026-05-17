import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // AI Insights API
  app.post("/api/ai-insights", async (req, res) => {
    try {
      const { orders, totalRevenue, stock } = req.body;
      
      const prompt = `
        Sebagai asisten bisnis cerdas untuk "Cheelok" (bisnis cilok premium), berikan wawasan singkat dan strategi (maksimal 2-3 kalimat) berdasarkan data saat ini:
        - Total Pesanan Minggu Ini: ${orders}
        - Total Pendapatan: Rp${totalRevenue?.toLocaleString('id-ID')}
        - Stok Bahan Saat Ini: ${stock} pcs
        
        Berikan saran tentang stok, pemasaran, atau operasional. Gunakan gaya bahasa profesional tapi bersahabat.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      
      res.json({ insight: response.text });
    } catch (error) {
      console.error("AI Insight Error:", error);
      res.status(500).json({ error: "Failed to generate insights" });
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
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
