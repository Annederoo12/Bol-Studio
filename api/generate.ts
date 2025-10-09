/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Helper function to extract parts from a data URL
const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

// Helper function to create a Gemini part from a data URL
const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

// Helper function to handle the API response and extract the image
const handleApiResponse = (response: GenerateContentResponse): string => {
    // Check for blocks
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Request blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`;
        throw new Error(errorMessage);
    }

    // Find the first image part in any candidate
    for (const candidate of response.candidates ?? []) {
        const imagePart = candidate.content?.parts?.find(part => part.inlineData);
        if (imagePart?.inlineData) {
            const { mimeType, data } = imagePart.inlineData;
            return `data:${mimeType};base64,${data}`;
        }
    }

    // Handle other finish reasons
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Image generation stopped unexpectedly. Reason: ${finishReason}. This is often related to safety settings.`;
        throw new Error(errorMessage);
    }
    
    // Handle cases where no image is returned
    const textFeedback = response.text?.trim();
    const errorMessage = `The AI model did not return an image. ` + (textFeedback ? `The model responded with text: "${textFeedback}"` : "This can happen due to safety filters or if the request is too complex. Try another image or prompt.");
    throw new Error(errorMessage);
};

// Vercel Serverless Function handler
export default async function handler(request: any, response: any) {
    if (request.method !== 'POST') {
        response.status(405).json({ error: 'Method Not Allowed' });
        return;
    }

    try {
        const { productImageUrl, sceneDescription } = request.body;

        if (!productImageUrl || !sceneDescription) {
            response.status(400).json({ error: 'Missing productImageUrl or sceneDescription' });
            return;
        }

        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        const model = 'gemini-2.5-flash-image';

        const productImagePart = dataUrlToPart(productImageUrl);
        const prompt = `You are an expert at creating photorealistic product marketing images. You are given a 'product image' and a 'scene description'.

**Your Task:**
1.  Identify the main product in the 'product image'. Isolate it from its background.
2.  Create a new, photorealistic image that places ONLY the identified product into the scene described below.
3.  The product must be the main focus and integrated naturally with proper lighting, shadows, perspective, and scale.
4.  If the scene description implies interaction (e.g., 'a person holding the product'), generate the person and the interaction realistically.
5.  The final image should look like a professional photograph.

**Output Specifications:**
*   **Aspect Ratio:** The final image must be perfectly square (1:1 aspect ratio).
*   **Resolution:** The image should be high-resolution, aiming for 1200x1200 pixels.

**Scene Description:** "${sceneDescription}"

**Output:** Return ONLY the final, generated image. Do not include any text or explanations.`;
        
        const genAIResponse = await ai.models.generateContent({
            model,
            contents: { parts: [productImagePart, { text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        const imageUrl = handleApiResponse(genAIResponse);
        
        response.status(200).json({ imageUrl });

    } catch (error) {
        console.error('Error in generate API:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        response.status(500).json({ error: 'Failed to generate scene', details: errorMessage });
    }
}
