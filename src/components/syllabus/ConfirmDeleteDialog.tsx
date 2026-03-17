import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName: string;
}

export const ConfirmDeleteDialog = ({ isOpen, onClose, onConfirm, title, itemName }: ConfirmDeleteDialogProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-sm bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col"
        >
          <div className="p-6">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {title}
            </h2>
            <p className="text-blue-200/70 text-sm">
              Are you sure you want to delete <span className="text-white font-semibold">"{itemName}"</span>? This action cannot be undone and will remove all associated progress.
            </p>
          </div>

          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-blue-200/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
