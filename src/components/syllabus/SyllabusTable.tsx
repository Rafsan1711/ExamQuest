import React from 'react';
import { Subject, Chapter } from '../../types';
import { AnimatedCheckbox } from './AnimatedCheckbox';
import { Edit2, Trash2 } from 'lucide-react';

interface SyllabusTableProps {
  subjects: Subject[];
  onToggleCheckbox: (subjectId: string, chapterId: string, field: 'mcq' | 'abQuestion' | 'cdQuestion', value: boolean) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
}

const ChapterRow = React.memo(({ 
  subject, 
  chapter, 
  index, 
  rowSpan, 
  chaptersLength, 
  onToggleCheckbox, 
  onEditSubject, 
  onDeleteSubject 
}: { 
  subject: Subject; 
  chapter: Chapter; 
  index: number; 
  rowSpan: number; 
  chaptersLength: number;
  onToggleCheckbox: (subjectId: string, chapterId: string, field: 'mcq' | 'abQuestion' | 'cdQuestion', value: boolean) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (subject: Subject) => void;
}) => {
  return (
    <tr className="group/row hover:bg-white/[0.02] transition-colors">
      {index === 0 && (
        <td
          rowSpan={rowSpan}
          className="p-4 align-top border-r border-white/5 relative group/subject"
        >
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: subject.color }}
          />
          <div className="flex items-start justify-between">
            <div>
              <div className="font-bold text-white mb-1">{subject.name}</div>
              <div
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-opacity-20"
                style={{ color: subject.color, backgroundColor: `${subject.color}33` }}
              >
                {chaptersLength} Chapters
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover/subject:opacity-100 transition-opacity">
              <button
                onClick={() => onEditSubject(subject)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteSubject(subject)}
                className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </td>
      )}
      <td className="p-4 border-r border-white/5">
        <span className="text-gray-200">{chapter.name}</span>
      </td>
      <td className="p-4 text-center">
        <div className="flex justify-center">
          <AnimatedCheckbox
            checked={chapter.mcq}
            onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'mcq', val)}
            accentColor="#22c55e"
          />
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex justify-center">
          <AnimatedCheckbox
            checked={chapter.abQuestion}
            onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'abQuestion', val)}
            accentColor="#f59e0b"
          />
        </div>
      </td>
      <td className="p-4 text-center">
        <div className="flex justify-center">
          <AnimatedCheckbox
            checked={chapter.cdQuestion}
            onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'cdQuestion', val)}
            accentColor="#a855f7"
          />
        </div>
      </td>
    </tr>
  );
});

export const SyllabusTable = ({ subjects, onToggleCheckbox, onEditSubject, onDeleteSubject }: SyllabusTableProps) => {
  if (subjects.length === 0) return null;

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white/5 border border-white/10 rounded-2xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-black/20">
              <th className="p-4 text-sm font-semibold text-blue-200/70 w-1/4">Subject</th>
              <th className="p-4 text-sm font-semibold text-blue-200/70 w-1/4">Chapter</th>
              <th className="p-4 text-sm font-semibold text-blue-200/70 text-center">MCQ ✓</th>
              <th className="p-4 text-sm font-semibold text-blue-200/70 text-center">A & B ✓</th>
              <th className="p-4 text-sm font-semibold text-blue-200/70 text-center">C & D ✓</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {subjects.map((subject) => {
              const chapters = Object.values(subject.chapters || {}).sort((a, b) => a.order - b.order);
              const rowSpan = Math.max(1, chapters.length);

              return chapters.length > 0 ? chapters.map((chapter, index) => (
                <ChapterRow
                  key={chapter.id}
                  subject={subject}
                  chapter={chapter}
                  index={index}
                  rowSpan={rowSpan}
                  chaptersLength={chapters.length}
                  onToggleCheckbox={onToggleCheckbox}
                  onEditSubject={onEditSubject}
                  onDeleteSubject={onDeleteSubject}
                />
              )) : (
                <tr key={subject.id} className="group/row hover:bg-white/[0.02] transition-colors">
                  <td
                    className="p-4 align-top border-r border-white/5 relative group/subject"
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: subject.color }}
                    />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-white mb-1">{subject.name}</div>
                        <div
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-opacity-20"
                          style={{ color: subject.color, backgroundColor: `${subject.color}33` }}
                        >
                          0 Chapters
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover/subject:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditSubject(subject)}
                          className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSubject(subject)}
                          className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                  <td colSpan={4} className="p-4 text-center text-gray-500 italic">
                    No chapters added yet.
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {subjects.map((subject) => {
          const chapters = Object.values(subject.chapters || {}).sort((a, b) => a.order - b.order);
          return (
            <div key={subject.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 flex items-center justify-between relative">
                <div
                  className="absolute left-0 top-0 bottom-0 w-1"
                  style={{ backgroundColor: subject.color }}
                />
                <div className="pl-2">
                  <h3 className="font-bold text-white">{subject.name}</h3>
                  <span className="text-xs text-blue-200/70">{chapters.length} Chapters</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => onEditSubject(subject)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded-lg">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDeleteSubject(subject)} className="p-2 text-gray-400 hover:text-red-400 bg-white/5 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {chapters.length > 0 ? chapters.map((chapter) => (
                  <div key={chapter.id} className="p-4">
                    <div className="font-medium text-gray-200 mb-3">{chapter.name}</div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-blue-200/70">MCQ</span>
                        <AnimatedCheckbox
                          checked={chapter.mcq}
                          onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'mcq', val)}
                          accentColor="#22c55e"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-blue-200/70">A & B</span>
                        <AnimatedCheckbox
                          checked={chapter.abQuestion}
                          onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'abQuestion', val)}
                          accentColor="#f59e0b"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs text-blue-200/70">C & D</span>
                        <AnimatedCheckbox
                          checked={chapter.cdQuestion}
                          onChange={(val) => onToggleCheckbox(subject.id, chapter.id, 'cdQuestion', val)}
                          accentColor="#a855f7"
                        />
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-center text-gray-500 italic text-sm">
                    No chapters added yet.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
