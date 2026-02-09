
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";
import { GenerationConfig, AspectRatio, Quality } from "../types";
import { STYLE_PROMPTS } from "../constants";

export class GeminiService {
  private static getAI() {
    // Creating a fresh instance to ensure we use the latest injected API key
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  static async validateBabyPhoto(base64Image: string): Promise<{ isBaby: boolean; reason?: string }> {
    try {
      const ai = this.getAI();
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          {
            parts: [
              { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
              { text: "Analise esta imagem. Ela contém um bebê real? Responda apenas com um JSON: { \"isBaby\": boolean, \"reason\": string }. Use 'isBaby': true se for um bebê, false caso contrário." }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      return {
        isBaby: result.isBaby ?? true,
        reason: result.reason
      };
    } catch (error) {
      console.error("Validation error:", error);
      return { isBaby: true }; // Fallback to true if validation fails to not block user
    }
  }

  static async generatePhotos(
    base64Image: string,
    config: GenerationConfig
  ): Promise<string[]> {
    const ai = this.getAI();
    const isHighQuality = config.quality === Quality.HIGH;
    const modelName = isHighQuality ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    
    const styleDescription = STYLE_PROMPTS[config.style];
    const userDescription = config.theme;
    const monthInfo = config.month;
    const customText = config.customText ? ` Including the text: "${config.customText}".` : '';

    const basePrompt = `Professional studio photography of the EXACT SAME baby from the reference image. Preserve ALL physical features: same face shape, same eyes, same nose, same mouth, same skin tone, same hair type and color, same body proportions, same ears. Only change: clothing, background, lighting setup, and pose. High resolution, professional lighting, sharp focus on baby's face. ${styleDescription} ${userDescription}.${customText} Monthly milestone photo session for ${monthInfo} old baby.`;

    const negativePrompt = "different baby, different face, changed facial features, altered skin tone, different body proportions, distorted features, multiple babies, blurry, low quality, deformed";

    const fullPrompt = `${basePrompt} (Negative: ${negativePrompt})`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: fullPrompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
          ...(isHighQuality ? { imageSize: "1K" } : {}) // Defaulting to 1K for better reliability, user can request 2K/4K in prompt
        }
      }
    });

    const imageUrls: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrls.push(`data:image/png;base64,${part.inlineData.data}`);
        }
      }
    }

    if (imageUrls.length === 0) {
      throw new Error("Não foi possível gerar as imagens. Tente novamente.");
    }

    return imageUrls;
  }

  static async generateVideo(
    base64Image: string,
    prompt: string,
    aspectRatio: "16:9" | "9:16"
  ): Promise<string> {
    const ai = this.getAI();
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `A beautiful and gentle high-quality video of the baby from the photo: ${prompt}`,
      image: {
        imageBytes: base64Image,
        mimeType: 'image/jpeg',
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) throw new Error("Falha ao gerar o vídeo.");

    const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
}
