import React, { useState } from 'react';
import { InfoModal } from './InfoModal';
import { trackEvent, getIssueNumber } from '../lib/mixpanel';

export const Footer: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <footer className="bg-slate-800/95 backdrop-blur-md border-t border-slate-700/30 py-3 sm:py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="mb-2">
            <button 
              onClick={() => {
                // Track about button clicked
                trackEvent('Footer About Button Clicked', {
                  issueNumber: getIssueNumber("issue1"),
                  trainerId: null,
                  trainerName: null,
                  trainerAge: null,
                  trainerStats: null,
                  questStartTime: Date.now(),
                  eventTime: Date.now(),
                  aboutType: 'info',
                  location: 'footer'
                });
                setShowInfoModal(true);
              }}
              className="text-slate-400 hover:text-white transition-colors text-sm font-medium cursor-pointer"
            >
              About
            </button>
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
