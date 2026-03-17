import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Menu, X, LogOut, ChevronDown, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useLeaderboard } from '../../hooks/useLeaderboard';
import { clsx } from 'clsx';
import { HowToUseModal } from './HowToUseModal';

const navLinks = [
  { name: 'Syllabus', path: '/syllabus' },
  { name: 'Analytics', path: '/analytics' },
  { name: 'Leaderboard', path: '/leaderboard' },
];

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { entries } = useLeaderboard();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);

  if (!user) return null;

  const currentUserEntry = entries.find(e => e.uid === user.uid);
  const percentage = currentUserEntry ? Math.round(currentUserEntry.percentage) : 0;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#0a0e1a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/syllabus" className="flex items-center gap-2 group">
              <div className="relative">
                <BookOpen className="w-6 h-6 text-cyan-400 transition-transform group-hover:scale-110" />
                <Zap className="w-3 h-3 text-yellow-300 absolute -bottom-1 -right-1" />
              </div>
              <span className="font-display font-bold text-xl text-white tracking-tight">
                ExamQuest
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={clsx(
                      'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive ? 'text-white' : 'text-blue-200/70 hover:text-white hover:bg-white/5'
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu (Desktop) */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsHowToUseOpen(true)}
                className="p-2 text-blue-200/70 hover:text-white hover:bg-white/5 rounded-full transition-colors focus:outline-none"
                title="How to use"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/5 transition-colors focus:outline-none"
                >
                  <div className="flex items-center gap-2 bg-white/5 pl-2 pr-1 py-1 rounded-full border border-white/10">
                    <span className="text-xs font-bold text-emerald-400">{percentage}% done</span>
                    <img
                      src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D8ABC&color=fff`}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-sm font-medium text-white max-w-[120px] truncate ml-1">
                    {user.displayName}
                  </span>
                  <ChevronDown className="w-4 h-4 text-blue-200/70" />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-[#111827] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm text-white truncate">{user.displayName}</p>
                        <p className="text-xs text-blue-200/70 truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setIsDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </motion.div>
                  </>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setIsHowToUseOpen(true)}
                className="p-2 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/5 focus:outline-none"
              >
                <HelpCircle className="w-6 h-6" />
              </button>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-blue-200/70 hover:text-white hover:bg-white/5 focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#0a0e1a]/95 backdrop-blur-xl"
          >
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={clsx(
                      'block px-3 py-2 rounded-lg text-base font-medium transition-colors',
                      isActive ? 'bg-white/10 text-white' : 'text-blue-200/70 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 mt-4 border-t border-white/10">
                <div className="flex items-center px-3 mb-4">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D8ABC&color=fff`}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user.displayName}</div>
                    <div className="text-sm font-medium text-blue-200/70">{user.email}</div>
                    <div className="text-xs font-bold text-emerald-400 mt-0.5">{percentage}% done</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    signOut();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-red-400 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Sign out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      <HowToUseModal 
        isOpen={isHowToUseOpen} 
        onClose={() => setIsHowToUseOpen(false)} 
      />
    </>
  );
};
