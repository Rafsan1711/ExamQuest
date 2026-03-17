import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle2, BarChart3, Trophy } from 'lucide-react';

interface HowToUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToUseModal = ({ isOpen, onClose }: HowToUseModalProps) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <BookOpen className="w-6 h-6 text-blue-400" />,
      title: "1. Build Your Syllabus",
      description: "Start by adding your subjects. Inside each subject, add the chapters you need to study."
    },
    {
      icon: <CheckCircle2 className="w-6 h-6 text-green-400" />,
      title: "2. Track Your Progress",
      description: "For each chapter, check off tasks as you complete them: MCQs, Section A & B questions, and Section C & D questions."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-purple-400" />,
      title: "3. Analyze Your Performance",
      description: "Visit the Analytics page to visualize your overall completion, task distribution, and see a heatmap of your progress."
    },
    {
      icon: <Trophy className="w-6 h-6 text-yellow-400" />,
      title: "4. Climb the Leaderboard",
      description: "Your progress is automatically synced. Check the Leaderboard to see how you rank against other students!"
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6">
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
          className="relative w-full max-w-2xl bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white">
              How to Use ExamQuest
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
            <p className="text-blue-200/80 text-sm md:text-base">
              Welcome to ExamQuest! This dashboard is designed to help you organize your study materials and track your exam preparation effectively.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {steps.map((step, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-blue-200/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-gray-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
            >
              Got it!
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
