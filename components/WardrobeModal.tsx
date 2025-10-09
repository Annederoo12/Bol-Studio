/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { PlusIcon } from './icons';
import { defaultScenePrompts } from '../wardrobe';

interface SceneGeneratorPanelProps {
  onGenerateScene: (prompt: string) => void;
  isLoading: boolean;
  credits: number;
  isFreeCreditAvailable: boolean;
}

const SceneGeneratorPanel: React.FC<SceneGeneratorPanelProps> = ({ onGenerateScene, isLoading, credits, isFreeCreditAvailable }) => {
    const [customPrompt, setCustomPrompt] = useState('');
    const hasCredits = credits > 0 || isFreeCreditAvailable;

    const handleGenerateClick = () => {
        if (customPrompt.trim()) {
            onGenerateScene(customPrompt.trim());
            setCustomPrompt('');
        }
    };
    
    const getButtonDisabledState = () => isLoading || !hasCredits;

    const getCreditInfoText = () => {
        if (isFreeCreditAvailable) {
            return "Je gratis dagelijkse generatie is beschikbaar.";
        }
        if (credits > 0) {
            return `Je hebt ${credits} credit${credits === 1 ? '' : 's'}.`;
        }
        return "Je hebt geen credits meer.";
    }

  return (
    <div className="flex flex-col">
        <h2 className="text-xl font-serif tracking-wider text-gray-800 mb-3 border-b border-gray-400/50 pb-2">Genereer Scène</h2>
        <p className="text-sm text-gray-600 mb-3">Selecteer een suggestie of schrijf je eigen prompt om een nieuwe scène voor je product te genereren.</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
            {defaultScenePrompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onGenerateScene(prompt)}
                    disabled={getButtonDisabledState()}
                    className="w-full text-left text-sm font-medium text-gray-800 p-2 rounded-md bg-gray-100/80 hover:bg-gray-200/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                >
                    {prompt}
                </button>
            ))}
        </div>
        
        <div className="mt-auto pt-4 flex flex-col gap-2">
            <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="bv. Op een zonnig strand bij zonsondergang"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent transition disabled:bg-gray-100"
                rows={3}
                disabled={getButtonDisabledState()}
            />
            <button 
                onClick={handleGenerateClick}
                disabled={getButtonDisabledState() || !customPrompt.trim()}
                className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Genereer Aangepaste Scène
            </button>
            <p className="text-xs text-center text-gray-500 mt-1">{getCreditInfoText()}</p>
      </div>
    </div>
  );
};

export default SceneGeneratorPanel;
