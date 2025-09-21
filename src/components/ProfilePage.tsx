import { Button } from './ui/button';
import { Header } from './Header';
import { trackEvent } from '../lib/mixpanel';
export function ProfilePage() {

  // Handle opening the Tally survey
  const handleBeginQuest = () => {
    // Track the Tally form link click with Mixpanel
    trackEvent('Tally Form Link Clicked', {
      issueNumber: 2,
      surveyUrl: 'https://tally.so/r/3yQ4q4'
    });
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
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3 bg-gradient-to-r from-yellow-200 via-white to-blue-200 bg-clip-text text-transparent drop-shadow-lg">
                    Your Legend Awaits, adventurer
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-blue-400 mx-auto rounded-full"></div>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl text-slate-100 mb-6 sm:mb-10 drop-shadow-lg font-medium">What will you discover today?</p>
                <div className="relative inline-block">
                  <Button 
                    onClick={handleBeginQuest}
                    className="relative px-8 sm:px-16 py-4 sm:py-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-500 hover:via-blue-500 hover:to-indigo-500 text-white font-black text-lg sm:text-2xl rounded-2xl shadow-xl hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 border-0"
                  >
                    <span className="relative z-10">Resume Your Quest</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </header>

      </div>

    </div>
  );
}
