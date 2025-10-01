/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { RotateCcwIcon } from './icons';
import Spinner from './Spinner';
import { AnimatePresence, motion } from 'framer-motion';

interface CanvasProps {
  displayImageUrl: string | null;
  onStartOver: () => void;
  isLoading: boolean;
  loadingMessage: string;
}

const Canvas: React.FC<CanvasProps> = ({ displayImageUrl, onStartOver, isLoading, loadingMessage }) => {
  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative animate-zoom-in group">
      {/* Start Over Button */}
      <button 
          onClick={onStartOver}
          className="absolute top-4 left-4 z-30 flex items-center justify-center text-center bg-white/60 border border-gray-300/80 text-gray-700 font-semibold py-2 px-4 rounded-full transition-all duration-200 ease-in-out hover:bg-white hover:border-gray-400 active:scale-95 text-sm backdrop-blur-sm"
      >
          <RotateCcwIcon className="w-4 h-4 mr-2" />
          Start Over
      </button>

      <div className="w-full max-w-2xl aspect-square bg-white rounded-xl border border-gray-200/80 shadow-lg flex items-center justify-center p-2 relative overflow-hidden">
          <AnimatePresence>
              {displayImageUrl && !isLoading && (
                  <motion.img
                      key={displayImageUrl} // Force re-render on change
                      src={displayImageUrl}
                      alt="Product scene"
                      className="max-w-full max-h-full object-contain rounded-lg"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                  />
              )}
          </AnimatePresence>
          
          {!displayImageUrl && !isLoading && (
              <div className="text-center p-4 text-gray-400">
                  <p className="font-serif">Your generated scene will appear here.</p>
              </div>
          )}
          
          <AnimatePresence>
          {isLoading && (
              <motion.div
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 rounded-xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
              >
                  <Spinner />
                  {loadingMessage && (
                      <p className="text-lg font-serif text-gray-700 mt-4 text-center px-4">{loadingMessage}</p>
                  )}
              </motion.div>
          )}
          </AnimatePresence>
      </div>
    </div>
  );
};

export default Canvas;