import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { usePlayAuth } from '../contexts/PlayAuthContext';

export function PlayLogin() {
  const { 
    availableTrainers, 
    switchTrainer, 
    removeTrainer, 
    getTrainerDisplayName,
    signup 
  } = usePlayAuth();
  
  const [loginData, setLoginData] = useState({
    firstName: '',
    lastName: '',
    birthday: ''
  });
  const [loginError, setLoginError] = useState('');

  const handleActivateTrainer = async (trainerId: string) => {
    try {
      await switchTrainer(trainerId);
    } catch (error) {
      console.error('Error activating trainer:', error);
    }
  };

  const handleDeleteTrainer = (trainerId: string) => {
    removeTrainer(trainerId);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      // Try to find existing trainer first
      const trainerId = `${loginData.firstName.toLowerCase()}_${loginData.lastName.toLowerCase()}_${loginData.birthday}`;
      const existingTrainer = availableTrainers.find(t => t.trainerId === trainerId);
      
      if (existingTrainer) {
        await switchTrainer(trainerId);
      } else {
        // Create new trainer
        await signup(loginData.firstName, loginData.lastName, loginData.birthday);
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Failed to login');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginError) setLoginError('');
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(/images/castle.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 drop-shadow-2xl" style={{
            textShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1), 0 0 60px rgba(255, 255, 255, 0.05)'
          }}>
            Lexicon Quest
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 font-medium drop-shadow-lg">Begin your magical adventure</p>
        </div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 rounded-2xl p-8 shadow-2xl border border-slate-700"
        >
          {/* Active Sessions - Show above login form when available */}
          {availableTrainers.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-base font-semibold text-slate-200">Previous Login Trainers</h2>
                <span className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded-full">
                  {availableTrainers.length}
                </span>
              </div>
              <div className="space-y-3">
                {availableTrainers.map((trainer) => (
                  <div
                    key={trainer.trainerId}
                    className="flex items-center justify-between p-3 bg-slate-700 border border-slate-600 rounded-lg hover:border-purple-500 transition-all duration-200"
                  >
                    <span className="font-medium text-white">
                      {getTrainerDisplayName(trainer)}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleActivateTrainer(trainer.trainerId)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-1.5 px-3 rounded-md text-sm transition-all duration-200 cursor-pointer"
                      >
                        Login
                      </button>
                        <button
                          onClick={() => handleDeleteTrainer(trainer.trainerId)}
                          className="text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Divider */}
              <div className="mt-6 mb-2">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-3 bg-slate-800 text-slate-400">or create new</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Login Form - Always visible */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                First Name:
              </label>
              <input
                type="text"
                value={loginData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter first name"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Last Name:
              </label>
              <input
                type="text"
                value={loginData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter last name"
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Birthday:
              </label>
              <input
                type="date"
                value={loginData.birthday}
                onChange={(e) => handleInputChange('birthday', e.target.value)}
                required
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="mt-4 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start Your Adventure!
            </button>
          </form>

        </motion.div>
      </motion.div>
    </div>
  );
}
