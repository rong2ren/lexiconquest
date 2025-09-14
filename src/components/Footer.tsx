import React, { useState } from 'react';
import { InfoModal } from './InfoModal';

export const Footer: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <footer className="bg-slate-800/95 backdrop-blur-md border-t border-slate-700/30 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex justify-center gap-6 text-sm text-slate-400 mb-2">
            <button 
              onClick={() => setShowInfoModal(true)}
              className="hover:text-white transition-colors"
            >
              About
            </button>
            <a 
              href="mailto:lexiconquestforkids@gmail.com"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          <p className="text-xs text-slate-500">© 2024 Lexicon Quest. All rights reserved.</p>
        </div>
      </footer>

      {/* Info Modal */}
      <InfoModal 
        isOpen={showInfoModal} 
        onClose={() => setShowInfoModal(false)} 
      />
    </>
  );
};
