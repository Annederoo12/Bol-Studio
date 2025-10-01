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
}

const SceneGeneratorPanel: React.FC<SceneGeneratorPanelProps> = ({ onGenerateScene, isLoading }) => {
    const [customPrompt, setCustomPrompt] = useState('');

    const handleGenerateClick = () => {
        if (customPrompt.trim()) {
            onGenerateScene(customPrompt.trim());
            setCustomPrompt('');
        }
    };

  return (
    <div className="flex flex-col">
        <h2 className="text-xl font-serif tracking-wider text-gray-800 mb-3 border-b border-gray-400/50 pb-2">Generate Scene</h2>
        <p className="text-sm text-gray-600 mb-3">Select a suggestion or write your own prompt to generate a new scene for your product.</p>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
            {defaultScenePrompts.map((prompt) => (
                <button
                    key={prompt}
                    onClick={() => onGenerateScene(prompt)}
                    disabled={isLoading}
                    className="w-full text-left text-sm font-medium text-gray-800 p-2 rounded-md bg-gray-100/80 hover:bg-gray-200/70 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {prompt}
                </button>
            ))}
        </div>
        
        <div className="mt-auto pt-4 flex flex-col gap-2">
            <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="e.g., On a sandy beach at sunset"
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-800 focus:border-transparent transition disabled:bg-gray-100"
                rows={3}
                disabled={isLoading}
            />
            <button 
                onClick={handleGenerateClick}
                disabled={isLoading || !customPrompt.trim()}
                className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <PlusIcon className="w-5 h-5 mr-2" />
                Generate Custom Scene
            </button>
      </div>
    </div>
  );
};

export default SceneGeneratorPanel;