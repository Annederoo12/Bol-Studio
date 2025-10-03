/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import type { WardrobeItem } from './types';

// Suggested scene prompts for the AI
export const defaultScenePrompts: string[] = [
  "Een persoon die met het product speelt in een zonnig park",
  "Op een professioneel sportveld tijdens een wedstrijd",
  "In de etalage van een luxe sportwinkel",
  "Close-up op gras met ochtenddauw",
  "In een prijzenkast met medailles",
  "Een kind dat opgewonden naar het product kijkt",
  "Op een plank in een tienerkamer",
  "In een rugzak met andere sportuitrusting",
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