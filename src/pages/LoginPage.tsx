import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const LoginPage = () => {
  const { user, loading, signInWithGoogle } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <LoadingSpinner size="lg" color="text-cyan-400" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/syllabus" replace />;
  }

  const handleSignIn = async () => {
    setIsSigningIn(true);
    await signInWithGoogle();
    setIsSigningIn(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0a0e1a] overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 animate-[pulse_4s_ease-in-out_infinite]" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-900/20" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[128px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 text-center">
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-cyan-400/30 blur-xl rounded-full" />
            <div className="relative bg-gradient-to-br from-blue-500 to-cyan-400 p-4 rounded-2xl shadow-lg">
              <div className="relative">
                <BookOpen className="w-10 h-10 text-white" />
                <Zap className="w-5 h-5 text-yellow-300 absolute -bottom-2 -right-2 drop-shadow-md" />
              </div>
            </div>
          </div>

          <h1 className="font-display text-4xl font-bold text-white mb-3 tracking-tight">
            ExamQuest
          </h1>
          <p className="text-blue-200/80 text-sm mb-10 font-medium">
            Track your half-yearly prep. Conquer every chapter.
          </p>

          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="group relative w-full flex items-center justify-center gap-3 bg-white text-gray-900 px-6 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/10 active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100"
          >
            {isSigningIn ? (
              <LoadingSpinner size="sm" color="text-gray-900" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
