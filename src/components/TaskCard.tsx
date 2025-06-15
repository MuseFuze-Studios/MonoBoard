import React from 'react';
import { Calendar, Tag, CheckSquare, Square, Edit3 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedItems = task.checklist.filter(item => item.completed).length;
  const totalItems = task.checklist.length;
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-gray-800 border border-gray-700 rounded-lg p-4 cursor-move hover:border-gray-600 transition-all duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-white font-medium line-clamp-2 flex-1">{task.title}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {task.description && (
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">{task.description}</p>
      )}

      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      )}

      {task.dueDate && (
        <div className={`flex items-center text-sm mb-3 ${
          isOverdue ? 'text-red-400' : 'text-gray-400'
        }`}>
          <Calendar className="w-4 h-4 mr-2" />
          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          {isOverdue && <span className="ml-2 text-red-400 font-medium">Overdue</span>}
        </div>
      )}

      {task.checklist.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <CheckSquare className="w-4 h-4 mr-2" />
            <span>{completedItems}/{totalItems} completed</span>
          </div>
          <div className="w-16 bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalItems > 0 ? (completedItems / totalItems) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};