import { useState, useMemo } from 'react';
import { useSyllabus } from '../hooks/useSyllabus';
import { Subject } from '../types';
import { StatsBar } from '../components/syllabus/StatsBar';
import { SyllabusTable } from '../components/syllabus/SyllabusTable';
import { SubjectModal } from '../components/syllabus/SubjectModal';
import { ConfirmDeleteDialog } from '../components/syllabus/ConfirmDeleteDialog';
import { AddSubjectFAB } from '../components/syllabus/AddSubjectFAB';
import { EmptyState } from '../components/ui/EmptyState';
import { TableSkeleton } from '../components/ui/TableSkeleton';
import { CardSkeleton } from '../components/ui/CardSkeleton';
import { Search, BookX } from 'lucide-react';

export const SyllabusPage = () => {
  const { subjects, loading, toggleCheckbox, deleteSubject } = useSyllabus();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | undefined>(undefined);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState<Subject | undefined>(undefined);

  const filteredSubjects = useMemo(() => {
    if (!searchQuery.trim()) return subjects;
    const query = searchQuery.toLowerCase();
    return subjects.filter(subject => {
      if (subject.name.toLowerCase().includes(query)) return true;
      const chapters = Object.values(subject.chapters || {}) as any[];
      return chapters.some(chapter => chapter.name.toLowerCase().includes(query));
    });
  }, [subjects, searchQuery]);

  const handleAddSubject = () => {
    setSubjectToEdit(undefined);
    setIsSubjectModalOpen(true);
  };

  const handleEditSubject = (subject: Subject) => {
    setSubjectToEdit(subject);
    setIsSubjectModalOpen(true);
  };

  const handleDeleteSubjectClick = (subject: Subject) => {
    setSubjectToDelete(subject);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubject = async () => {
    if (subjectToDelete) {
      await deleteSubject(subjectToDelete.id);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <div className="h-8 w-48 bg-white/10 rounded-md animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-white/10 rounded-md animate-pulse"></div>
          </div>
          <div className="h-10 w-full md:w-72 bg-white/10 rounded-xl animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">My Syllabus</h1>
          <p className="text-blue-200/70">Track your progress across all subjects and chapters.</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            placeholder="Search subjects or chapters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-white/10 rounded-xl leading-5 bg-black/20 text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-black/40 focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-colors"
          />
        </div>
      </div>

      <StatsBar subjects={subjects} />

      {subjects.length === 0 ? (
        <EmptyState
          icon={<BookX className="w-12 h-12 text-cyan-400" />}
          title="No subjects yet"
          description="Get started by adding your first subject to track your exam preparation."
          actionLabel="Add Subject"
          onAction={handleAddSubject}
        />
      ) : filteredSubjects.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-white/10 rounded-2xl">
          <p className="text-gray-400">No subjects or chapters match your search.</p>
        </div>
      ) : (
        <SyllabusTable
          subjects={filteredSubjects}
          onToggleCheckbox={toggleCheckbox}
          onEditSubject={handleEditSubject}
          onDeleteSubject={handleDeleteSubjectClick}
        />
      )}

      <AddSubjectFAB onClick={handleAddSubject} />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        subjectToEdit={subjectToEdit}
      />

      <ConfirmDeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteSubject}
        title="Delete Subject"
        itemName={subjectToDelete?.name || ''}
      />
    </div>
  );
};
