import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

interface AddSubjectFABProps {
  onClick: () => void;
}

export const AddSubjectFAB = ({ onClick }: AddSubjectFABProps) => {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-900 px-5 py-4 rounded-full font-bold shadow-lg shadow-cyan-500/30 transition-colors"
    >
      <motion.div
        animate={{ 
          boxShadow: ['0 0 0 0 rgba(6, 182, 212, 0.7)', '0 0 0 15px rgba(6, 182, 212, 0)'] 
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 2,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full"
      />
      <Plus className="w-6 h-6 relative z-10" />
      <span className="hidden sm:inline relative z-10">Add Subject</span>
    </motion.button>
  );
};
