import React, { useState } from 'react';
import { Plus, MoreHorizontal, Edit3, Trash2 } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Column as ColumnType, Task } from '../types';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
  onDeleteColumn?: (columnId: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onEditTask,
  onRenameColumn,
  onDeleteColumn,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(column.title);
  const [showMenu, setShowMenu] = useState(false);

  const startEditing = () => {
    setEditTitle(column.title);
    setIsEditing(true);
    setShowMenu(false);
  };

  const saveTitle = () => {
    if (editTitle.trim() && editTitle.trim() !== column.title) {
      onRenameColumn(column.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const cancelEditing = () => {
    setEditTitle(column.title);
    setIsEditing(false);
  };

  const handleDeleteColumn = () => {
    if (onDeleteColumn && confirm(`Are you sure you want to delete the "${column.title}" column? All tasks in this column will be deleted.`)) {
      onDeleteColumn(column.id);
    }
    setShowMenu(false);
  };

  return (
    <div className="flex-shrink-0 w-80">
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3 flex-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle();
                  if (e.key === 'Escape') cancelEditing();
                }}
                onBlur={saveTitle}
                className="bg-gray-800 text-white px-2 py-1 rounded border border-purple-500 focus:outline-none text-sm font-semibold flex-1"
                autoFocus
              />
            ) : (
              <button
                onClick={startEditing}
                className="text-white font-semibold hover:text-purple-400 transition-colors text-left flex-1"
                title="Click to rename column"
              >
                {column.title}
              </button>
            )}
            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-full text-xs">
              {tasks.length}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onAddTask(column.id)}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="Add task"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                title="Column options"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <div className="p-1">
                    <button
                      onClick={startEditing}
                      className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Rename</span>
                    </button>
                    {onDeleteColumn && column.id !== 'todo' && column.id !== 'done' && (
                      <button
                        onClick={handleDeleteColumn}
                        className="flex items-center space-x-2 w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          ref={setNodeRef}
          className={`p-4 min-h-32 max-h-96 overflow-y-auto transition-colors ${
            isOver ? 'bg-gray-800/50' : ''
          }`}
          onClick={() => setShowMenu(false)}
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={onEditTask} />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No tasks yet</p>
                  <button
                    onClick={() => onAddTask(column.id)}
                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                  >
                    Add your first task
                  </button>
                </div>
              )}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
};