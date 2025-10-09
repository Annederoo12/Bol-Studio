/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { CameraIcon, LogInIcon, LogOutIcon, UserIcon } from './icons';
import CreditDisplay from './CreditDisplay';
import { useAuth } from '../contexts/AuthContext';
import Spinner from './Spinner';

interface HeaderProps {
    credits: number;
    onBuyCredits: () => void;
}

const Header: React.FC<HeaderProps> = ({ credits, onBuyCredits }) => {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  return (
    <header className="w-full py-4 px-4 md:px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200/60">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
            <CameraIcon className="w-6 h-6 text-gray-700" />
            <h1 className="text-2xl font-serif tracking-widest text-gray-800">
              AI Product Studio
            </h1>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
            <CreditDisplay credits={credits} onBuyCredits={onBuyCredits} />
            <div className="h-8 border-l border-gray-300"></div>
            <div className="w-48 flex items-center justify-end">
                {loading ? (
                    <Spinner />
                ) : user ? (
                    <div className="flex items-center gap-3">
                        <img src={user.photoURL || undefined} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full hidden sm:inline-block" referrerPolicy="no-referrer"/>
                        <span className="text-sm font-medium text-gray-700 hidden md:inline-block truncate" title={user.displayName || ''}>
                            Welkom, {user.displayName?.split(' ')[0]}
                        </span>
                        <button onClick={logout} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors" title="Uitloggen">
                            <LogOutIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center bg-transparent border border-gray-800 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors duration-200 ease-in-out hover:bg-gray-800 hover:text-white active:scale-95 text-sm"
                    >
                        <LogInIcon className="w-4 h-4 mr-2"/>
                        Inloggen
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;