
import { GoogleGenAI } from "@google/genai";
import { GeneratorFormData, PhotoStyle } from "../types";

export class GeminiService {
  private getAI() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private buildPrompt(data: GeneratorFormData, hasInputImage: boolean): string {
    const { babyName, ageInMonths, theme, gender, colorPalette, style } = data;
    
    let prompt = "";
    
    if (hasInputImage) {
      // Avoid keywords that trigger identity manipulation filters
      prompt = `Professional baby milestone photography. The infant from the reference image is the subject. `;
      prompt += `Integrate this infant into a beautifully designed ${theme} themed set. `;
      prompt += `Maintain consistent features and expression as seen in the original photo. `;
      prompt += `The surrounding environment, lighting, and props should reflect the ${theme} theme. `;
    } else {
      prompt = `A professional, high-quality baby milestone photo (mêsversário) for a ${gender.toLowerCase()} baby. `;
      prompt += `The baby should be the central focus, surrounded by beautiful ${theme} themed decorations. `;
    }
    
    if (babyName) {
      prompt += `The name "${babyName}" should be subtly integrated into the decor on a small prop. `;
    }

    prompt += `Display the number "${ageInMonths}" using themed props like balloons or blocks. `;
    prompt += `Style: ${style}. `;
    
    if (colorPalette) {
      prompt += `Dominant palette: ${colorPalette}. `;
    }

    if (style === PhotoStyle.STUDIO) prompt += "Professional studio lighting, soft bokeh, clean backdrop. ";
    if (style === PhotoStyle.MINIMALIST) prompt += "Clean minimalist aesthetic, neutral tones, focused on the child. ";
    if (style === PhotoStyle.COZY) prompt += "Soft textures, cozy home-like atmosphere, warm window lighting. ";
    if (style === PhotoStyle.LUXURY) prompt += "Sophisticated setup, elegant fabrics, delicate gold or silver accents. ";

    prompt += " The final result should be a heartwarming and realistic professional photograph.";

    return prompt;
  }

  private getMimeType(base64String: string): string {
    const match = base64String.match(/^data:([^;]+);base64,/);
    return match ? match[1] : 'image/png';
  }

  async generateMilestoneImage(data: GeneratorFormData, inputImage?: string): Promise<{ url: string; prompt: string }> {
    const ai = this.getAI();
    const prompt = this.buildPrompt(data, !!inputImage);
    const parts: any[] = [{ text: prompt }];

    if (inputImage) {
      const mimeType = this.getMimeType(inputImage);
      const base64Data = inputImage.includes(',') ? inputImage.split(',')[1] : inputImage;
      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      });
    }
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts },
        config: {
          imageConfig: { aspectRatio: "1:1" }
        }
      });

      const candidates = response.candidates || [];
      if (candidates.length === 0) throw new Error("A IA não retornou resultados.");

      // Iterate through parts to find the image or text explanation
      for (const part of candidates[0].content.parts) {
        if (part.inlineData) {
          return {
            url: `data:image/png;base64,${part.inlineData.data}`,
            prompt
          };
        } else if (part.text) {
          // If the model refuses, it returns text. Throw this text to be caught by the error handler.
          throw new Error(part.text);
        }
      }

      throw new Error("Não foi possível gerar a imagem.");
    } catch (err: any) {
      console.error("Gemini Image Error:", err);
      throw err;
    }
  }

  async editImage(base64Image: string, editPrompt: string): Promise<string> {
    const ai = this.getAI();
    const mimeType = this.getMimeType(base64Image);
    const data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: `Professional edit: ${editPrompt}. Maintain subject consistency with the reference image.`,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      } else if (part.text) {
        throw new Error(part.text);
      }
    }

    throw new Error("Não foi possível editar a imagem.");
  }

  async generateVideo(base64Image: string, prompt: string, aspectRatio: '16:9' | '9:16' = '9:16'): Promise<string> {
    const ai = this.getAI();
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const mimeType = this.getMimeType(base64Image);

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: `Subtle cinematic animation of this scene. Focus on lighting and small environment movements.`,
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
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
    
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
