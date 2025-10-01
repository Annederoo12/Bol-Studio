/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import Canvas from './components/Canvas';
import SceneGeneratorPanel from './components/WardrobeModal';
import { generateProductScene } from './services/geminiService';
import { GeneratedScene } from './types';
import { ChevronDownIcon, ChevronUpIcon } from './components/icons';
import Footer from './components/Footer';
import Header from './components/Header';
import { getFriendlyErrorMessage } from './lib/utils';
import Spinner from './components/Spinner';

const App: React.FC = () => {
  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [generatedScenes, setGeneratedScenes] = useState<GeneratedScene[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSheetCollapsed, setIsSheetCollapsed] = useState(false);

  const handleProductFinalized = (url: string) => {
    setProductImageUrl(url);
    setGeneratedScenes([]);
  };

  const handleStartOver = () => {
    setProductImageUrl(null);
    setGeneratedScenes([]);
    setIsLoading(false);
    setLoadingMessage('');
    setError(null);
    setIsSheetCollapsed(false);
  };

  const handleGenerateScene = useCallback(async (prompt: string) => {
    if (!productImageUrl || isLoading) return;

    setError(null);
    setIsLoading(true);
    setLoadingMessage(`Generating scene...`);

    try {
      // Always generate from the original, clean product image for best results.
      const newImageUrl = await generateProductScene(productImageUrl, prompt);
      const newScene: GeneratedScene = {
        id: `scene-${Date.now()}`,
        url: newImageUrl,
        prompt: prompt,
      };
      setGeneratedScenes(prev => [...prev, newScene]);
    } catch (err) {
      setError(getFriendlyErrorMessage(err, 'Failed to generate scene'));
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [productImageUrl, isLoading]);

  const viewVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -15 },
  };

  const latestGeneratedSceneUrl = generatedScenes.length > 0 ? generatedScenes[generatedScenes.length - 1].url : null;
  const displayImageUrl = latestGeneratedSceneUrl || productImageUrl;

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {!productImageUrl ? (
          <motion.div
            key="start-screen"
            className="w-screen min-h-screen flex items-start sm:items-center justify-center bg-gray-50 p-4 pb-20"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <StartScreen onProductFinalized={handleProductFinalized} />
          </motion.div>
        ) : (
          <motion.div
            key="main-app"
            className="relative flex flex-col h-screen bg-white overflow-hidden"
            variants={viewVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          >
            <Header />
            <main className="flex-grow relative flex flex-col md:flex-row overflow-hidden">
              <div className="w-full h-full flex-grow flex items-center justify-center bg-white pb-16 relative">
                <Canvas 
                  displayImageUrl={displayImageUrl}
                  onStartOver={handleStartOver}
                  isLoading={isLoading}
                  loadingMessage={loadingMessage}
                />
              </div>

              <aside 
                className={`absolute md:relative md:flex-shrink-0 bottom-0 right-0 h-auto md:h-full w-full md:w-1/3 md:max-w-sm bg-white/80 backdrop-blur-md flex flex-col border-t md:border-t-0 md:border-l border-gray-200/60 transition-transform duration-500 ease-in-out ${isSheetCollapsed ? 'translate-y-[calc(100%-4.5rem)]' : 'translate-y-0'} md:translate-y-0`}
                style={{ transitionProperty: 'transform' }}
              >
                  <button 
                    onClick={() => setIsSheetCollapsed(!isSheetCollapsed)} 
                    className="md:hidden w-full h-8 flex items-center justify-center bg-gray-100/50"
                    aria-label={isSheetCollapsed ? 'Expand panel' : 'Collapse panel'}
                  >
                    {isSheetCollapsed ? <ChevronUpIcon className="w-6 h-6 text-gray-500" /> : <ChevronDownIcon className="w-6 h-6 text-gray-500" />}
                  </button>
                  <div className="p-4 md:p-6 pb-20 overflow-y-auto flex-grow flex flex-col gap-8">
                    {error && (
                      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-md" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                      </div>
                    )}
                    <SceneGeneratorPanel
                      onGenerateScene={handleGenerateScene}
                      isLoading={isLoading}
                    />
                    {generatedScenes.length > 0 && (
                       <div className="pt-6 border-t border-gray-400/50">
                        <h2 className="text-xl font-serif tracking-wider text-gray-800 mb-3">History</h2>
                        <div className="grid grid-cols-3 gap-3">
                          {[...generatedScenes].reverse().map(scene => (
                            <div key={scene.id} className="relative aspect-square border rounded-lg overflow-hidden group" title={scene.prompt}>
                              <img src={scene.url} alt={scene.prompt} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                <p className="text-white text-xs leading-tight">{scene.prompt}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
              </aside>
            </main>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer isOnDressingScreen={!!productImageUrl} />
    </div>
  );
};

export default App;