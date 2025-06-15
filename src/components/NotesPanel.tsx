import React, { useState, useEffect } from 'react';
import { FileText, X, Maximize2, Minimize2 } from 'lucide-react';

interface NotesPanelProps {
  notes: string;
  onNotesChange: (notes: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const NotesPanel: React.FC<NotesPanelProps> = ({
  notes,
  onNotesChange,
  isOpen,
  onToggle,
}) => {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleNotesChange = (value: string) => {
    setLocalNotes(value);
    onNotesChange(value);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 z-40"
        title="Open notes"
      >
        <FileText className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-0 right-0 bg-gray-900 border-l border-t border-gray-800 shadow-2xl transition-all duration-300 z-40 ${
      isExpanded ? 'w-full h-full' : 'w-96 h-80'
    }`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-semibold">Project Notes</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-white p-1 rounded transition-colors"
            title="Close notes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 h-full">
        <textarea
          value={localNotes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Jot down your game dev ideas, thoughts, and reminders here...

• Character concepts
• Gameplay mechanics
• Art style notes
• Technical todos
• Bug reports
• Meeting notes"
          className="w-full h-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none resize-none"
          style={{ height: isExpanded ? 'calc(100vh - 120px)' : 'calc(100% - 60px)' }}
        />
      </div>
    </div>
  );
};