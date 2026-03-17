/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { SyllabusPage } from './pages/SyllabusPage';
import { Navbar } from './components/ui/Navbar';
import { PageWrapper } from './components/ui/PageWrapper';
import { ToastProvider } from './components/ui/ToastProvider';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

const AnalyticsPage = React.lazy(() => import('./pages/AnalyticsPage').then(module => ({ default: module.AnalyticsPage })));
const LeaderboardPage = React.lazy(() => import('./pages/LeaderboardPage').then(module => ({ default: module.LeaderboardPage })));

const RootRoute = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0e1a]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/syllabus" replace /> : <Navigate to="/login" replace />;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex flex-col">
      {user && location.pathname !== '/login' && <Navbar />}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {/* @ts-ignore */}
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<RootRoute />} />
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/syllabus" 
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <SyllabusPage />
                  </PageWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
                      <AnalyticsPage />
                    </Suspense>
                  </PageWrapper>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leaderboard" 
              element={
                <ProtectedRoute>
                  <PageWrapper>
                    <Suspense fallback={<div className="flex justify-center items-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>}>
                      <LeaderboardPage />
                    </Suspense>
                  </PageWrapper>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </ToastProvider>
  );
}

