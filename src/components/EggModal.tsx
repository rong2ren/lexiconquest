import { motion } from 'framer-motion';
import { X, Sparkles, Star } from 'lucide-react';

interface EggModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EggModal({ isOpen, onClose }: EggModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-600/20 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-slate-600/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="/kowai/egg.png" 
                alt="Mystery Egg"
                className="h-16 rounded-xl"
              />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Mystery Egg</h2>
              <p className="text-slate-400">A mysterious Kowai awaits inside...</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 mb-4">
              <Star className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">Your First Kowai Awaits!</h3>
              <p className="text-slate-300 leading-relaxed">
                This mysterious egg contains your very first Kowai companion. Complete your first quest to hatch this egg and discover which Kowai will join you on your adventure!
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300"
            >
              Begin Your Adventure!
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
