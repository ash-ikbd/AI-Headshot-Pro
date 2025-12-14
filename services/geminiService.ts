import { GoogleGenAI } from "@google/genai";

// Ensure API key is present
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

/**
 * Edits an image using Gemini 2.5 Flash Image.
 * @param imageBase64 The base64 string of the image (without data prefix if possible, though we strip it).
 * @param promptText The text description of the desired edit/transformation.
 * @returns The base64 string of the generated image.
 */
export const generateHeadshot = async (imageBase64: string, promptText: string): Promise<string> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  // Clean base64 string if it contains metadata
  const cleanBase64 = imageBase64.split(',')[1] || imageBase64;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: promptText,
          },
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG for simplicity, or we could detect.
              data: cleanBase64,
            },
          },
        ],
      },
      // Config to ensure we get an image back.
      // Note: responseMimeType is not supported for nano banana (flash-image) models currently, 
      // but the model is multimodal and returns image parts.
    });

    // Iterate through parts to find the image
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated.");
    }

    let generatedImageBase64: string | null = null;

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        generatedImageBase64 = part.inlineData.data;
        break;
      }
    }

    if (!generatedImageBase64) {
       // Fallback: Check if the model returned text explaining why it couldn't generate the image
       const textPart = parts.find(p => p.text);
       if (textPart && textPart.text) {
         throw new Error(`Model returned text instead of image: ${textPart.text}`);
       }
       throw new Error("The model did not return an image.");
    }

    return `data:image/jpeg;base64,${generatedImageBase64}`;

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Failed to generate image.");
  }
};
