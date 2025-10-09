/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { XIcon, CreditIcon } from './icons';

interface BuyCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuy: () => void;
}

const BuyCreditsModal: React.FC<BuyCreditsModalProps> = ({ isOpen, onClose, onBuy }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl w-full max-w-md flex flex-col shadow-xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-2xl font-serif tracking-wider text-gray-800">Geen credits meer</h2>
              <button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800" aria-label="Sluiten">
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-6">
                Je hebt je gratis dagelijkse generatie gebruikt. Koop credits om door te gaan met het creëren van geweldige scènes!
              </p>
              <button
                onClick={onBuy}
                className="w-full flex items-center justify-center text-center bg-gray-900 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-700 active:scale-95 text-base"
              >
                <CreditIcon className="w-5 h-5 mr-2" />
                Koop 10 Credits
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BuyCreditsModal;
