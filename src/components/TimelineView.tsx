import React from 'react';
import { Calendar, AlertCircle, Clock } from 'lucide-react';
import { Task } from '../types';

interface TimelineViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ tasks, onEditTask }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by due date first (tasks with due dates come first)
    if (a.dueDate && !b.dueDate) return -1;
    if (!a.dueDate && b.dueDate) return 1;
    if (a.dueDate && b.dueDate) {
      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
    }
    
    // Then by priority
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Finally by title
    return a.title.localeCompare(b.title);
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const getDaysUntilDue = (dueDate?: string) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDaysUntilDue = (days: number | null) => {
    if (days === null) return '';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <Clock className="w-8 h-8 text-gray-500 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">No tasks in timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedTasks.map((task, index) => {
        const daysUntil = getDaysUntilDue(task.dueDate);
        const overdue = isOverdue(task.dueDate);
        
        return (
          <div
            key={task.id}
            onClick={() => onEditTask(task)}
            className="bg-gray-800 border border-gray-700 rounded-lg p-3 cursor-pointer hover:border-gray-600 transition-all duration-200 relative"
          >
            {/* Timeline connector */}
            {index < sortedTasks.length - 1 && (
              <div className="absolute left-4 top-full w-px h-3 bg-gray-600"></div>
            )}
            
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs">{getPriorityIcon(task.priority)}</span>
                    <h4 className="text-white font-medium text-sm line-clamp-1">{task.title}</h4>
                  </div>
                  <div className={`flex items-center text-xs ${getPriorityColor(task.priority)}`}>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span className="capitalize">{task.priority}</span>
                  </div>
                </div>
                
                {task.description && (
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">{task.description}</p>
                )}
                
                <div className="flex items-center justify-between">
                  {task.dueDate ? (
                    <div className={`flex items-center text-xs ${
                      overdue ? 'text-red-400' : daysUntil !== null && daysUntil <= 3 ? 'text-yellow-400' : 'text-gray-400'
                    }`}>
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                      {daysUntil !== null && (
                        <span className="ml-2 font-medium">
                          {formatDaysUntilDue(daysUntil)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>No due date</span>
                    </div>
                  )}
                  
                  {task.checklist.length > 0 && (
                    <div className="text-xs text-gray-400">
                      {task.checklist.filter(item => item.completed).length}/{task.checklist.length} done
                    </div>
                  )}
                </div>
                
                {task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {task.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="inline-block px-2 py-0.5 bg-purple-600/20 text-purple-300 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {task.tags.length > 3 && (
                      <span className="inline-block px-2 py-0.5 bg-gray-600/20 text-gray-400 text-xs rounded-full">
                        +{task.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};