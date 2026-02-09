import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: req.body.prompt,
        }),
      }
    );

    // Se a Hugging Face retornar erro
    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    // Converter imagem em base64
    const buffer = await response.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    return res.status(200).json({
      image: `data:image/png;base64,${base64Image}`,
    });

  } catch (error: any) {
    console.error("HUGGING FACE ERROR:", error.message);
    return res.status(500).json({
      error: error.message || "Erro ao gerar imagem",
    });
  }
}
