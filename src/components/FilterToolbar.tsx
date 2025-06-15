import React, { useState } from 'react';
import { Filter, SortAsc, SortDesc, X, Tag, AlertCircle, Calendar } from 'lucide-react';
import { FilterState } from '../types';

interface FilterToolbarProps {
  availableTags: string[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  availableTags,
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = filters.tags.length > 0 || filters.priority.length > 0;

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    
    onFiltersChange({ ...filters, tags: newTags });
  };

  const togglePriority = (priority: string) => {
    const newPriority = filters.priority.includes(priority)
      ? filters.priority.filter(p => p !== priority)
      : [...filters.priority, priority];
    
    onFiltersChange({ ...filters, priority: newPriority });
  };

  const updateSort = (sortBy: FilterState['sortBy']) => {
    const sortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    onFiltersChange({ ...filters, sortBy, sortOrder });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              hasActiveFilters || showFilters
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                {filters.tags.length + filters.priority.length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Sort by:</span>
          <button
            onClick={() => updateSort('dueDate')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              filters.sortBy === 'dueDate'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Due Date</span>
            {filters.sortBy === 'dueDate' && (
              filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => updateSort('priority')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              filters.sortBy === 'priority'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-4 h-4" />
            <span>Priority</span>
            {filters.sortBy === 'priority' && (
              filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => updateSort('title')}
            className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
              filters.sortBy === 'title'
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Title</span>
            {filters.sortBy === 'title' && (
              filters.sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Filter by Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {availableTags.length === 0 && (
                  <span className="text-gray-500 text-sm">No tags available</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Filter by Priority
              </h4>
              <div className="flex flex-wrap gap-2">
                {['high', 'medium', 'low'].map((priority) => (
                  <button
                    key={priority}
                    onClick={() => togglePriority(priority)}
                    className={`px-3 py-1 rounded-full text-sm capitalize transition-colors ${
                      filters.priority.includes(priority)
                        ? getPriorityColor(priority)
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};