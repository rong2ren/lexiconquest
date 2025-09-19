import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useAuthWithAnalytics } from '../hooks/useAuthWithAnalytics';

export function Header() {
  const { logout } = useAuthWithAnalytics();

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
          <div className="flex items-center gap-1 sm:gap-2">
            <Button 
              onClick={handleLogout}
              className="flex items-center gap-1 px-2 sm:px-3 py-2 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500 text-white rounded-lg text-xs sm:text-sm font-medium transition-all duration-200"
              title="Logout from Parent Account"
            >
              <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
