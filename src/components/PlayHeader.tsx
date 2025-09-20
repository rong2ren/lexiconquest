import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Users, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { usePlayAuth } from '../contexts/PlayAuthContext';
import { TrainerManagementModal } from './TrainerManagementModal';
import { NewTrainerForm } from './NewTrainerForm';

export function PlayHeader() {
  const { logout, availableTrainers } = usePlayAuth();
  const [showTrainerManagement, setShowTrainerManagement] = useState(false);
  const [showNewTrainerForm, setShowNewTrainerForm] = useState(false);

  // Action handlers
  const handleAddProfile = () => {
    setShowNewTrainerForm(true);
  };

  const handleSwitchProfile = () => {
    setShowTrainerManagement(true);
  };

  const handleNewTrainerSuccess = () => {
    setShowNewTrainerForm(false);
  };

  const handleBuyIssue = () => {
    // Navigate to purchase page for current parent account
    window.open('https://buy.stripe.com/bJe28t8MxdW6bbI3YdgMw01', '_blank');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-800/95 to-slate-700/95 backdrop-blur-md border-b border-slate-600/30 shadow-lg"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-lg">
              LQ
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white">Lexicon Quest</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Add New Trainer Button */}
            <Button 
              onClick={handleAddProfile}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              title="Add New Trainer"
            >
              <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline cursor-pointer">Add New Trainer</span>
            </Button>

            {/* Switch Trainer Button - Show when multiple trainers exist */}
            {availableTrainers.length > 1 && (
              <Button 
                onClick={handleSwitchProfile}
                className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
                title="Switch or Delete Trainers"
              >
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline cursor-pointer">Switch Trainer</span>
              </Button>
            )}

            <Button 
              onClick={handleBuyIssue}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              title="Buy Next Issue"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline cursor-pointer">Get Next Issue</span>
            </Button>

            <Button 
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              title="Logout from Trainer Account"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline cursor-pointer">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      {/* New Trainer Form Modal */}
      <NewTrainerForm
        isOpen={showNewTrainerForm}
        onClose={() => setShowNewTrainerForm(false)}
        onSuccess={handleNewTrainerSuccess}
      />

      {/* Trainer Management Modal */}
      <TrainerManagementModal
        isOpen={showTrainerManagement}
        onClose={() => setShowTrainerManagement(false)}
      />
    </motion.div>
  );
}
