// Service para chamar a API da Hugging Face (imagem)

export async function gerarImagemHuggingFace(prompt: string) {
  const response = await fetch("/api/huggingface-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar imagem pela Hugging Face");
  }

  return response.json();
}
