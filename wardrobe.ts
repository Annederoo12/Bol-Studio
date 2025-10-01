/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { WardrobeItem } from './types';

// Suggested scene prompts for the AI
export const defaultScenePrompts: string[] = [
  "A person playing with the product in a sunny park",
  "On a professional sports field during a match",
  "In a high-end sports store display window",
  "Close-up on grass with morning dew",
  "In a trophy case with medals",
  "A child looking at the product with excitement",
  "On a shelf in a teenager's bedroom",
  "In a backpack with other sports gear",
];

// FIX: Define and export defaultWardrobe.
// This variable was being imported in WardrobeSheet.tsx but was not exported,
// causing an error.
export const defaultWardrobe: WardrobeItem[] = [
  {
    id: 't-shirt-red',
    name: 'Red T-Shirt',
    url: 'https://storage.googleapis.com/gemini-95-icons/v-neck-t-shirt.jpg',
  },
  {
    id: 'jeans-blue',
    name: 'Blue Jeans',
    url: 'https://storage.googleapis.com/gemini-95-icons/blue-jeans.jpg',
  },
  {
    id: 'sneakers-white',
    name: 'White Sneakers',
    url: 'https://storage.googleapis.com/gemini-95-icons/white-sneakers.jpg',
  },
  {
    id: 'jacket-leather',
    name: 'Leather Jacket',
    url: 'https://storage.googleapis.com/gemini-95-icons/leather-jacket.jpg',
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    url: 'https://storage.googleapis.com/gemini-95-icons/sunglasses.jpg',
  },
];
