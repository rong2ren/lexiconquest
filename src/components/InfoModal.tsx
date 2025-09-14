import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          backgroundColor: '#1e293b',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '448px',
          width: '100%',
          maxHeight: '80vh',
          overflowY: 'auto',
          border: '1px solid #334155',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">About Lexicon Quest</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-700/50 hover:bg-slate-600/50 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="space-y-6 text-slate-300">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">What is Lexicon Quest?</h3>
            <p className="text-sm leading-relaxed">
              Lexicon Quest is a magical STEM learning adventure that combines 
              <strong className="text-yellow-400"> physical workbooks</strong> with 
              <strong className="text-blue-400"> digital experiences</strong>. 
              Kids collect and interact with magical Kowai pets, solve puzzles, 
              and embark on quests that make STEM learning fun and engaging!
            </p>
            <div className="mt-3 text-xs text-slate-400">
              <p>📚 Physical workbooks + 🎮 Digital adventures = Complete learning experience</p>
            </div>
          </div>

          {/* Privacy Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Privacy & Safety</h3>
            <p className="text-sm leading-relaxed">
              We take your child's privacy seriously. All data is encrypted and 
              stored securely. We never share personal information with third parties 
              and comply with COPPA regulations for children's online safety.
            </p>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Contact Support</h3>
            <p className="text-sm leading-relaxed">
              Need help? Have questions? We're here to assist you and your child 
              on this magical learning journey.
            </p>
            <div className="mt-2 text-sm">
              <p>📧 Email: lexiconquestforkids@gmail.com</p>
              <p>🌐 Website: <a href="https://lexicon-quest.super.site/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">lexicon-quest.super.site</a></p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
          >
            Got it!
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
