/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { UploadCloudIcon } from './icons';
import { Compare } from './ui/compare';
import { getFriendlyErrorMessage } from '../lib/utils';

interface StartScreenProps {
  onProductFinalized: (productUrl: string) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onProductFinalized }) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
    }
    setError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        // Directly pass the uploaded product image to the main app
        onProductFinalized(dataUrl);
    };
    reader.onerror = () => {
        setError(getFriendlyErrorMessage('Failed to read the selected file.', 'File Read Error'));
        setIsUploading(false);
    }
    reader.readAsDataURL(file);
  }, [onProductFinalized]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const screenVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <motion.div
      key="uploader"
      className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12"
      variants={screenVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
        <div className="max-w-lg">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
            Place Your Product in Any Scene.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Ever wondered how your product would look in action? Stop guessing. Upload a photo and let our AI generate stunning lifestyle shots for your marketing.
          </p>
          <hr className="my-8 border-gray-200" />
          <div className="flex flex-col items-center lg:items-start w-full gap-3">
            <label htmlFor="image-upload-start" className={`w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white rounded-md transition-colors ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-700 cursor-pointer'}`}>
              <UploadCloudIcon className="w-5 h-5 mr-3" />
              {isUploading ? 'Processing...' : 'Upload Product Photo'}
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isUploading} />
            <p className="text-gray-500 text-sm">Select a clear photo of your product, preferably on a simple background.</p>
            <p className="text-gray-500 text-xs mt-1">By uploading, you agree not to create harmful, explicit, or unlawful content. This service is for creative and responsible use only.</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <Compare
          firstImage="https://storage.googleapis.com/gemini-95-icons/potty-trainer-product.jpg"
          secondImage="https://storage.googleapis.com/gemini-95-icons/potty-trainer-lifestyle.jpg"
          className="w-full max-w-lg aspect-[1/1] rounded-2xl bg-gray-200 shadow-xl"
        />
      </div>
    </motion.div>
  );
};

export default StartScreen;