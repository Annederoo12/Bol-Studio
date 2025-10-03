/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

const dataUrlToParts = (dataUrl: string) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    return { mimeType: mimeMatch[1], data: arr[1] };
}

const dataUrlToPart = (dataUrl: string) => {
    const { mimeType, data } = dataUrlToParts(dataUrl);
    return { inlineData: { mimeType, data } };
}

const handleApiResponse = (response: GenerateContentResponse): string => {
    if (response.promptFeedback?.blockReason) {
        const { blockReason, blockReasonMessage } = response.promptFeedback;
        const errorMessage = `Verzoek geblokkeerd. Reden: ${blockReason}. ${blockReasonMessage || ''}`;
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

    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        const errorMessage = `Het genereren van de afbeelding is onverwacht gestopt. Reden: ${finishReason}. Dit heeft vaak te maken met veiligheidsinstellingen.`;
        throw new Error(errorMessage);
    }
    const textFeedback = response.text?.trim();
    const errorMessage = `Het AI-model heeft geen afbeelding geretourneerd. ` + (textFeedback ? `Het model reageerde met tekst: "${textFeedback}"` : "Dit kan gebeuren door veiligheidsfilters of als het verzoek te complex is. Probeer een andere afbeelding of prompt.");
    throw new Error(errorMessage);
};

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash-image';


export const generateProductScene = async (productImageUrl: string, sceneDescription: string): Promise<string> => {
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

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [productImagePart, { text: prompt }] },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    return handleApiResponse(response);
};