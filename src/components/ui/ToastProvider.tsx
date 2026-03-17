import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => {
      const newToasts = [...prev, { id, message, type }];
      if (newToasts.length > 3) {
        return newToasts.slice(newToasts.length - 3);
      }
      return newToasts;
    });

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const success = useCallback((message: string) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message: string) => addToast(message, 'error'), [addToast]);
  const info = useCallback((message: string) => addToast(message, 'info'), [addToast]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ success, error, info }}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`
                pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border min-w-[300px]
                ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-500/30 text-emerald-100' : ''}
                ${toast.type === 'error' ? 'bg-red-900/90 border-red-500/30 text-red-100' : ''}
                ${toast.type === 'info' ? 'bg-blue-900/90 border-blue-500/30 text-blue-100' : ''}
                backdrop-blur-md
              `}
            >
              {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
              {toast.type === 'error' && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
              
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors focus:outline-none flex-shrink-0"
              >
                <X className="w-4 h-4 opacity-70 hover:opacity-100" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
