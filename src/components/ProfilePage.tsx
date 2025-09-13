import { motion } from 'framer-motion';
import { Shield, Star, Search, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { KowaiCard } from './KowaiCard';
import { Header } from './Header';
import { KowaiModal } from './KowaiModal';
import { useState } from 'react';
import { trackEvent } from '../lib/mixpanel';

const ownedKowai = [
  {
    id: '1',
    name: 'fanelle'
  },
  {
    id: '2',
    name: 'scorki'
  }
];

const encounteredKowai = [
  {
    id: '3',
    name: 'peblaff'
  }
];


export function ProfilePage() {
  const [selectedKowai, setSelectedKowai] = useState<string | null>(null);

  const handleKowaiClick = (kowai: { id: string; name: string }) => {
    setSelectedKowai(kowai.name);
  };

  const handleCloseModal = () => {
    setSelectedKowai(null);
  };

  // Handle opening the Tally survey
  const handleBeginQuest = () => {
    // Track the survey click with Mixpanel
    trackEvent('Issue 2 Survey Clicked');
    // Open the Tally form in the same tab
    window.location.href = 'https://tally.so/r/3yQ4q4';
  };

  return (
    <div className="min-h-screen bg-slate-900 relative pt-20">
      <Header />
      
      <div className="p-4">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-green-500/10 rounded-full blur-xl"></div>
        </div>

        {/* Welcome Banner */}
        <header className="max-w-4xl mx-auto mb-6 relative z-10">
          <div className="relative rounded-3xl overflow-hidden shadow-lg border-2 border-slate-600/30 welcome-banner-bg">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-slate-900/80 to-blue-900/70"></div>
            <div className="relative z-10 p-6 sm:p-8 md:p-12 py-12 sm:py-16 md:py-20 text-center">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-3 bg-gradient-to-r from-yellow-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                    Welcome to Lexicon Quest
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 mx-auto rounded-full"></div>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-100 mb-6 sm:mb-10 drop-shadow-lg font-medium">Your magical adventure awaits</p>
                <div className="relative inline-block">
                  <Button 
                    onClick={handleBeginQuest}
                    className="relative px-8 sm:px-16 py-4 sm:py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg sm:text-2xl rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0"
                  >
                    <span className="relative z-10">Begin Your Quest</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto relative">
          {/* User Profile Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/30 shadow-lg rounded-2xl">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  R
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Rongrong</h3>
                  <p className="text-slate-400 text-sm">Trainer ID: LQ-00123</p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="mb-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/20">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-pink-400" />
                      <p className="text-pink-400 text-sm sm:text-base md:text-xl font-medium">Bravery</p>
                    </div>
                    <p className="text-white text-lg sm:text-xl font-bold">78</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/20">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                      <Star className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400" />
                      <p className="text-blue-400 text-sm sm:text-base md:text-xl font-medium">Wisdom</p>
                    </div>
                    <p className="text-white text-lg sm:text-xl font-bold">85</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/20">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                      <Search className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400" />
                      <p className="text-purple-400 text-sm sm:text-base md:text-xl font-medium">Curiosity</p>
                    </div>
                    <p className="text-white text-lg sm:text-xl font-bold">72</p>
                  </div>
                  <div className="bg-slate-700/30 rounded-lg p-3 text-center border border-slate-600/20">
                    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-1">
                      <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
                      <p className="text-green-400 text-sm sm:text-base md:text-xl font-medium">Empathy</p>
                    </div>
                    <p className="text-white text-lg sm:text-xl font-bold">90</p>
                  </div>
                </div>
              </div>

              {/* Owned Kowai Section */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-white">Owned Kowai</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {ownedKowai.map((kowai) => (
                    <KowaiCard key={kowai.id} kowai={kowai} onClick={handleKowaiClick} />
                  ))}
                </div>
              </div>

              {/* Encountered Kowai Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-xl font-bold text-white">Encountered Kowai</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {encounteredKowai.map((kowai) => (
                    <KowaiCard key={kowai.id} kowai={kowai} onClick={handleKowaiClick} />
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>

        </main>
      </div>

      {/* Kowai Modal */}
      <KowaiModal 
        kowaiName={selectedKowai || ''} 
        isOpen={selectedKowai !== null} 
        onClose={handleCloseModal} 
      />
    </div>
  );
}
