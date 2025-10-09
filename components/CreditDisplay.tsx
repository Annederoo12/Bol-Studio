/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { CreditIcon } from './icons';

interface CreditDisplayProps {
  credits: number;
  onBuyCredits: () => void;
}

const CreditDisplay: React.FC<CreditDisplayProps> = ({ credits, onBuyCredits }) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <CreditIcon className="w-6 h-6 text-gray-600" />
        <span className="text-lg font-semibold text-gray-800" title={`${credits} credits beschikbaar`}>{credits}</span>
      </div>
      <button 
        onClick={onBuyCredits}
        className="bg-gray-800 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-sm"
      >
        Koop Credits
      </button>
    </div>
  );
};

export default CreditDisplay;
