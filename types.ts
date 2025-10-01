/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface GeneratedScene {
  id: string;
  url: string;
  prompt: string;
}

// FIX: Define and export WardrobeItem and OutfitLayer types.
// These types were missing, causing import errors in several components.
export interface WardrobeItem {
  id: string;
  name: string;
  url: string;
}

export interface OutfitLayer {
  garment: WardrobeItem | null;
}
