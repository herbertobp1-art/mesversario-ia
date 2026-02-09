import type { VercelRequest, VercelResponse } from @vercelnode;

export default async function handler(
  req VercelRequest,
  res VercelResponse
) {
  if (req.method !== POST) {
    return res.status(405).json({ error Método não permitido });
  }

  try {
    const response = await fetch(
      `httpsgenerativelanguage.googleapis.comv1betamodelsgemini-progenerateContentkey=${process.env.GEMINI_API_KEY}`,
      {
        method POST,
        headers { Content-Type applicationjson },
        body JSON.stringify(req.body),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error Erro ao chamar a IA });
  }
}
