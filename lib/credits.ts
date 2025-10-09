/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

const CREDITS_KEY = 'ai_product_studio_credits';

interface CreditData {
  credits: number;
  lastFreeGeneration: number; // Stored as timestamp
}

/**
 * Retrieves credit data from localStorage.
 * Initializes with 0 credits if no data is found.
 */
export function getCreditData(): CreditData {
  try {
    const data = localStorage.getItem(CREDITS_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to read credits from localStorage", error);
  }
  // Default data for new users
  return { credits: 0, lastFreeGeneration: 0 };
}

/**
 * Saves credit data to localStorage.
 */
function setCreditData(data: CreditData) {
  try {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save credits to localStorage", error);
  }
}

/**
 * Checks if a free generation is available. This resets daily.
 * @param lastFreeTimestamp - The timestamp of the last free generation.
 */
export function isFreeGenerationAvailable(lastFreeTimestamp: number): boolean {
  if (lastFreeTimestamp === 0) return true; // Never used it before

  const lastDate = new Date(lastFreeTimestamp);
  const today = new Date();

  // Check if the last generation was on a different day, month, or year.
  return (
    lastDate.getDate() !== today.getDate() ||
    lastDate.getMonth() !== today.getMonth() ||
    lastDate.getFullYear() !== today.getFullYear()
  );
}

/**
 * Consumes a credit. First tries to use a free daily generation,
 * then uses a paid credit.
 * @returns An object indicating success and the updated credit data.
 */
export function useCredit(): { success: boolean } & CreditData {
  const data = getCreditData();
  
  if (isFreeGenerationAvailable(data.lastFreeGeneration)) {
    const newData: CreditData = {
      ...data,
      lastFreeGeneration: Date.now(),
    };
    setCreditData(newData);
    return { success: true, ...newData };
  }

  if (data.credits > 0) {
    const newData: CreditData = {
      ...data,
      credits: data.credits - 1,
    };
    setCreditData(newData);
    return { success: true, ...newData };
  }

  return { success: false, ...data };
}

/**
 * Adds credits to the user's balance.
 * @param amount - The number of credits to add.
 * @returns The updated credit data.
 */
export function addCredits(amount: number): CreditData {
  const data = getCreditData();
  const newData = {
    ...data,
    credits: data.credits + amount,
  };
  setCreditData(newData);
  return newData;
}
