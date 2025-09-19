import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Trash2, X, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';

interface TrainerManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TrainerManagementModal({ isOpen, onClose }: TrainerManagementModalProps) {
  const { 
    currentTrainer, 
    availableTrainers, 
    switchTrainer, 
    removeTrainer, 
    getTrainerDisplayName 
  } = usePlayAuth();
  const [trainerToDelete, setTrainerToDelete] = useState<string | null>(null);

  const handleSwitchTrainer = async (trainerId: string) => {
    try {
      await switchTrainer(trainerId);
    } catch (error) {
      console.error('Error switching trainer:', error);
    }
  };

  const handleDeleteTrainer = (trainerId: string) => {
    setTrainerToDelete(trainerId);
  };

  const confirmDelete = () => {
    if (trainerToDelete) {
      removeTrainer(trainerToDelete);
      setTrainerToDelete(null);
    }
  };


  if (!isOpen) return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100] p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-2xl w-full max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Trainer Management</h2>
                  <p className="text-sm text-slate-300">Manage your trainer profiles</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="space-y-4">
              {/* Trainers List */}
              <div className="space-y-3">
                {availableTrainers.map((trainer) => (
                  <div
                    key={trainer.trainerId}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      currentTrainer?.uid === trainer.trainerId
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            currentTrainer?.uid === trainer.trainerId ? 'bg-purple-500' : 'bg-slate-400'
                          }`} />
                          <div>
                            <h3 className="font-semibold text-white">
                              {getTrainerDisplayName(trainer)}
                            </h3>
                            <p className="text-sm text-slate-400">
                              Last login: {new Date(trainer.lastLogin).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentTrainer?.uid !== trainer.trainerId && (
                          <button
                            onClick={() => handleSwitchTrainer(trainer.trainerId)}
                            className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all duration-200 cursor-pointer"
                          >
                            Switch
                          </button>
                        )}
                        {currentTrainer?.uid === trainer.trainerId && (
                          <span className="text-sm font-medium text-purple-400 bg-purple-500/20 px-3 py-1.5 rounded-lg border border-purple-500/30">
                            Active
                          </span>
                        )}
                        <button
                          onClick={() => handleDeleteTrainer(trainer.trainerId)}
                          className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>


      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {trainerToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-[110] p-4"
            onClick={() => setTrainerToDelete(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Trainer</h3>
                  <p className="text-sm text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete this trainer profile? All progress and data will be permanently lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTrainerToDelete(null)}
                  className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white hover:bg-slate-600 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}
