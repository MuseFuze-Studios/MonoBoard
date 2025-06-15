import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, Tag } from 'lucide-react';
import { Task, ChecklistItem } from '../types';

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  columns: Array<{ id: string; title: string; color: string }>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  columns,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [dueDate, setDueDate] = useState('');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [columnId, setColumnId] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setTags(task.tags);
      setDueDate(task.dueDate || '');
      setChecklist(task.checklist);
      setColumnId(task.columnId);
    } else {
      setTitle('');
      setDescription('');
      setTags([]);
      setDueDate('');
      setChecklist([]);
      setColumnId(columns[0]?.id || '');
    }
  }, [task, columns]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title.trim()) return;

    const taskData: Task = {
      id: task?.id || crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      tags,
      dueDate: dueDate || undefined,
      checklist,
      columnId,
    };

    onSave(taskData);
    onClose();
  };

  const addChecklistItem = () => {
    const newItem: ChecklistItem = {
      id: crypto.randomUUID(),
      text: '',
      completed: false,
    };
    setChecklist([...checklist, newItem]);
  };

  const updateChecklistItem = (id: string, updates: Partial<ChecklistItem>) => {
    setChecklist(checklist.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {task ? 'Edit Task' : 'Create Task'}
          </h2>
          <div className="flex items-center space-x-2">
            {task && onDelete && (
              <button
                onClick={() => {
                  onDelete(task.id);
                  onClose();
                }}
                className="text-red-400 hover:text-red-300 p-2 rounded transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white p-2 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6" onKeyDown={handleKeyPress}>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Enter task title..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none resize-none"
              placeholder="Enter task description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Column
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
              >
                {columns.map((column) => (
                  <option key={column.id} value={column.id}>
                    {column.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-purple-600/20 text-purple-300 text-sm rounded-full"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-purple-300 hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                placeholder="Add tag..."
              />
              <button
                onClick={addTag}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                Checklist
              </label>
              <button
                onClick={addChecklistItem}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                <Plus className="w-4 h-4 inline mr-1" />
                Add item
              </button>
            </div>
            <div className="space-y-2">
              {checklist.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={(e) => updateChecklistItem(item.id, { completed: e.target.checked })}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateChecklistItem(item.id, { text: e.target.value })}
                    className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white text-sm focus:border-purple-500 focus:outline-none"
                    placeholder="Checklist item..."
                  />
                  <button
                    onClick={() => removeChecklistItem(item.id)}
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            {task ? 'Update' : 'Create'} Task
            <span className="ml-2 text-xs opacity-70">(Ctrl+Enter)</span>
          </button>
        </div>
      </div>
    </div>
  );
};