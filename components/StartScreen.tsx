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
        setError('Selecteer alstublieft een afbeeldingsbestand.');
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
        setError(getFriendlyErrorMessage('Kon het geselecteerde bestand niet lezen.', 'Fout bij het lezen van bestand'));
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
            Zie jouw product tot leven komen.
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Vervang dure fotoshoots en ugc modellen met een paar klikken.
          </p>
          <hr className="my-8 border-gray-200" />
          <div className="flex flex-col items-center lg:items-start w-full gap-3">
            <label htmlFor="image-upload-start" className={`w-full relative flex items-center justify-center px-8 py-3 text-base font-semibold text-white rounded-md transition-colors ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-700 cursor-pointer'}`}>
              <UploadCloudIcon className="w-5 h-5 mr-3" />
              {isUploading ? 'Verwerken...' : 'Upload productfoto'}
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/png, image/jpeg, image/webp, image/avif, image/heic, image/heif" onChange={handleFileChange} disabled={isUploading} />
            <p className="text-gray-500 text-sm">Selecteer een duidelijke foto van je product, bij voorkeur op een eenvoudige achtergrond.</p>
            <p className="text-gray-500 text-xs mt-1">Door te uploaden, ga je ermee akkoord geen schadelijke, expliciete of onwettige inhoud te creëren. Deze service is alleen voor creatief en verantwoordelijk gebruik.</p>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

        </div>
      </div>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
        <Compare
          firstImage="https://storage.googleapis.com/ai-studio-bucket-203192049701-us-west1/services/bol-studio/version-1/compiled/ImagesHomePage/test.jpg"
          secondImage="https://storage.googleapis.com/ai-studio-bucket-203192049701-us-west1/services/bol-studio/version-1/compiled/ImagesHomePage/Image2.jpeg"
          className="w-full max-w-lg aspect-[1/1] rounded-2xl bg-gray-200 shadow-xl"
        />
      </div>
    </motion.div>
  );
};

export default StartScreen;