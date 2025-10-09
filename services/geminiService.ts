/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const generateProductScene = async (productImageUrl: string, sceneDescription: string): Promise<string> => {
    const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productImageUrl,
            sceneDescription,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ details: 'Could not parse error response.' }));
        // Provide a more user-friendly message based on the detailed error from the backend.
        throw new Error(errorData.details || `Request failed with status ${response.status}`);
    }

    const result = await response.json();
    return result.imageUrl;
};
