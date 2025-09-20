import { AuthProvider } from './contexts/AuthContext';
import { PlayAuthProvider } from './contexts/PlayAuthContext';
import { AppContent } from './components/AppContent';

export default function App() {
  return (
    <AuthProvider>
      <PlayAuthProvider>
        <AppContent />
      </PlayAuthProvider>
    </AuthProvider>
  );
}