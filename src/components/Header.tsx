import { motion } from 'framer-motion';
import { UserPlus, Users, ShoppingCart, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthWithAnalytics } from '../hooks/useAuthWithAnalytics';

export function Header() {
  const { logout } = useAuthWithAnalytics();

  // Action handlers
  const handleAddProfile = () => {
    // Open add profile modal for new child under current parent email
    console.log('Add Profile clicked');
  };

  const handleSwitchProfile = () => {
    // Open profile switcher modal to switch between child profiles
    console.log('Switch Profile clicked');
  };

  const handleBuyIssue = () => {
    // Navigate to purchase page for current parent account
    console.log('Buy Issue clicked');
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
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
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 4 Essential Action Buttons */}
            <Button 
              onClick={handleAddProfile}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:from-purple-400 hover:via-purple-500 hover:to-purple-600 text-white rounded-xl shadow-md hover:shadow-purple-500/25 hover:shadow-lg transition-all duration-300 text-sm font-semibold border border-purple-400/20 hover:border-purple-300/40 hover:scale-105"
              title="Add New Child Profile"
            >
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline font-medium">Add</span>
            </Button>

            <Button 
              onClick={handleSwitchProfile}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 hover:from-indigo-400 hover:via-indigo-500 hover:to-indigo-600 text-white rounded-xl shadow-md hover:shadow-indigo-500/25 hover:shadow-lg transition-all duration-300 text-sm font-semibold border border-indigo-400/20 hover:border-indigo-300/40 hover:scale-105"
              title="Switch Between Child Profiles"
            >
              <Users className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline font-medium">Switch</span>
            </Button>

            <Button 
              onClick={handleBuyIssue}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-400 hover:via-green-500 hover:to-teal-500 text-white rounded-xl shadow-md hover:shadow-emerald-500/25 hover:shadow-lg transition-all duration-300 text-sm font-semibold border border-emerald-400/20 hover:border-emerald-300/40 hover:scale-105"
              title="Buy Next Issue"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline font-medium">Buy Issue</span>
            </Button>

            <Button 
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 hover:from-slate-400 hover:via-slate-500 hover:to-slate-600 text-white rounded-xl shadow-md hover:shadow-slate-500/25 hover:shadow-lg transition-all duration-300 text-sm font-semibold border border-slate-400/20 hover:border-slate-300/40 hover:scale-105"
              title="Logout from Parent Account"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 group-hover:scale-110" />
              <span className="hidden sm:inline font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
