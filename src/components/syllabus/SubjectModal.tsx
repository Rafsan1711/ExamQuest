import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Plus, Trash2 } from 'lucide-react';
import { Subject } from '../../types';
import { clsx } from 'clsx';
import { useSyllabus } from '../../hooks/useSyllabus';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject;
}

const COLORS = [
  { name: 'blue', value: '#3b82f6' },
  { name: 'green', value: '#22c55e' },
  { name: 'amber', value: '#f59e0b' },
  { name: 'red', value: '#ef4444' },
  { name: 'purple', value: '#a855f7' },
  { name: 'pink', value: '#ec4899' },
  { name: 'cyan', value: '#06b6d4' },
  { name: 'orange', value: '#f97316' },
];

type UIChapter = {
  id?: string;
  name: string;
  order: number;
  _isDeleted?: boolean;
};

export const SubjectModal = ({ isOpen, onClose, subjectToEdit }: SubjectModalProps) => {
  const { addSubject, updateSubject, addChapter, updateChapter, deleteChapter, refreshLeaderboard, subjects } = useSyllabus();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS[0].value);
  const [chapters, setChapters] = useState<UIChapter[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (subjectToEdit) {
        setName(subjectToEdit.name);
        setColor(subjectToEdit.color);
        const existingChapters = Object.values(subjectToEdit.chapters || {})
          .sort((a, b) => a.order - b.order)
          .map(c => ({ id: c.id, name: c.name, order: c.order }));
        setChapters(existingChapters.length > 0 ? existingChapters : [{ name: '', order: 0 }]);
      } else {
        setName('');
        setColor(COLORS[0].value);
        setChapters([{ name: '', order: 0 }]);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, subjectToEdit]);

  const handleAddChapter = () => {
    const maxOrder = chapters.reduce((max, c) => Math.max(max, c.order), -1);
    setChapters([...chapters, { name: '', order: maxOrder + 1 }]);
  };

  const handleChapterNameChange = (index: number, newName: string) => {
    const newChapters = [...chapters];
    newChapters[index].name = newName;
    setChapters(newChapters);
  };

  const handleDeleteChapter = (index: number) => {
    const newChapters = [...chapters];
    if (newChapters[index].id) {
      newChapters[index]._isDeleted = true;
    } else {
      newChapters.splice(index, 1);
    }
    setChapters(newChapters);
  };

  const handleSave = async () => {
    if (!name.trim()) return;
    const activeChapters = chapters.filter(c => !c._isDeleted && c.name.trim());
    if (activeChapters.length === 0) return;

    setIsSaving(true);
    try {
      let currentSubjectId = subjectToEdit?.id;

      if (currentSubjectId) {
        await updateSubject(currentSubjectId, { name, color });
      } else {
        const order = subjects.length > 0 ? Math.max(...subjects.map(s => s.order)) + 1 : 0;
        currentSubjectId = await addSubject({ name, color, order });
      }

      if (currentSubjectId) {
        for (let i = 0; i < chapters.length; i++) {
          const c = chapters[i];
          if (c._isDeleted && c.id) {
            await deleteChapter(currentSubjectId, c.id);
          } else if (!c._isDeleted && c.name.trim()) {
            if (c.id) {
              await updateChapter(currentSubjectId, c.id, { name: c.name, order: i });
            } else {
              await addChapter(currentSubjectId, { 
                name: c.name, 
                order: i, 
                mcq: false, 
                abQuestion: false, 
                cdQuestion: false 
              });
            }
          }
        }
      }

      await refreshLeaderboard();
      onClose();
    } catch (error) {
      console.error('Error saving subject:', error);
    } finally {
      setIsSaving(false);
    }
  };

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
          className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
            <h2 className="text-xl font-bold text-white">
              {subjectToEdit ? 'Edit Subject' : 'New Subject'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar">
            {/* Subject Name */}
            <div>
              <label className="block text-sm font-medium text-blue-200/70 mb-2">
                Subject Name
              </label>
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Physics, Mathematics"
                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-blue-200/70 mb-2">
                Color Theme
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setColor(c.value)}
                    className={clsx(
                      'w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none',
                      color === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111827] scale-110' : ''
                    )}
                    style={{ backgroundColor: c.value }}
                  />
                ))}
              </div>
            </div>

            {/* Chapters */}
            <div>
              <label className="block text-sm font-medium text-blue-200/70 mb-2">
                Chapters
              </label>
              <div className="space-y-2 mb-4">
                {chapters.map((chapter, index) => {
                  if (chapter._isDeleted) return null;
                  return (
                    <div key={chapter.id || index} className="flex items-center gap-2 group">
                      <div className="p-2 text-gray-500 cursor-grab active:cursor-grabbing hover:text-gray-300">
                        <GripVertical className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={chapter.name}
                        onChange={(e) => handleChapterNameChange(index, e.target.value)}
                        placeholder={`Chapter ${index + 1}`}
                        className="flex-1 bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      />
                      <button
                        onClick={() => handleDeleteChapter(index)}
                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={handleAddChapter}
                className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-medium transition-colors px-2 py-1 rounded-md hover:bg-cyan-400/10"
              >
                <Plus className="w-4 h-4" />
                Add Chapter
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-blue-200/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !name.trim() || chapters.filter(c => !c._isDeleted && c.name.trim()).length === 0}
              className="flex items-center justify-center min-w-[100px] px-4 py-2 text-sm font-medium text-gray-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <LoadingSpinner size="sm" color="text-gray-900" /> : 'Save Subject'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
