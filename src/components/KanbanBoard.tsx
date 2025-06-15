import React, { useState, useMemo } from 'react';
import { Plus, FileText } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { Project, Task, Column as ColumnType, FilterState } from '../types';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { NotesPanel } from './NotesPanel';
import { FilterToolbar } from './FilterToolbar';

interface KanbanBoardProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ project, onUpdateProject }) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    tags: [],
    priority: [],
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Get all available tags from tasks
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    project.tasks.forEach(task => {
      task.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [project.tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = project.tasks;

    // Apply tag filters
    if (filters.tags.length > 0) {
      filtered = filtered.filter(task =>
        filters.tags.some(tag => task.tags.includes(tag))
      );
    }

    // Apply priority filters
    if (filters.priority.length > 0) {
      filtered = filtered.filter(task =>
        filters.priority.includes(task.priority)
      );
    }

    // Sort tasks
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (filters.sortBy) {
        case 'dueDate':
          if (a.dueDate && !b.dueDate) comparison = -1;
          else if (!a.dueDate && b.dueDate) comparison = 1;
          else if (a.dueDate && b.dueDate) {
            comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[b.priority] - priorityOrder[a.priority];
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'created':
          comparison = a.id.localeCompare(b.id); // Using ID as proxy for creation order
          break;
      }

      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [project.tasks, filters]);

  const handleDragStart = (event: DragStartEvent) => {
    const task = project.tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeTask = project.tasks.find(t => t.id === active.id);
    const overColumn = project.columns.find(c => c.id === over.id);
    
    if (!activeTask || !overColumn || activeTask.columnId === overColumn.id) return;

    const updatedTasks = project.tasks.map(task =>
      task.id === activeTask.id ? { ...task, columnId: overColumn.id } : task
    );

    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    
    const { active, over } = event;
    if (!over) return;

    const activeTask = project.tasks.find(t => t.id === active.id);
    const overTask = project.tasks.find(t => t.id === over.id);
    
    if (!activeTask) return;

    if (overTask && activeTask.columnId === overTask.columnId) {
      const columnTasks = project.tasks.filter(t => t.columnId === activeTask.columnId);
      const oldIndex = columnTasks.findIndex(t => t.id === activeTask.id);
      const newIndex = columnTasks.findIndex(t => t.id === overTask.id);
      
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
      const otherTasks = project.tasks.filter(t => t.columnId !== activeTask.columnId);
      
      onUpdateProject({
        ...project,
        tasks: [...otherTasks, ...reorderedTasks],
        updatedAt: new Date().toISOString(),
      });
    }
  };

  const handleAddTask = (columnId: string) => {
    setEditingTask({
      id: '',
      title: '',
      description: '',
      notes: '',
      tags: [],
      priority: 'medium',
      checklist: [],
      columnId,
    });
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    let updatedTasks;
    
    if (task.id && project.tasks.find(t => t.id === task.id)) {
      updatedTasks = project.tasks.map(t => t.id === task.id ? task : t);
    } else {
      updatedTasks = [...project.tasks, { ...task, id: crypto.randomUUID() }];
    }

    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = project.tasks.filter(t => t.id !== taskId);
    onUpdateProject({
      ...project,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleRenameColumn = (columnId: string, newTitle: string) => {
    const updatedColumns = project.columns.map(col =>
      col.id === columnId ? { ...col, title: newTitle } : col
    );
    
    onUpdateProject({
      ...project,
      columns: updatedColumns,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleToggleViewMode = (columnId: string) => {
    const updatedColumns = project.columns.map(col =>
      col.id === columnId 
        ? { ...col, viewMode: col.viewMode === 'kanban' ? 'timeline' : 'kanban' }
        : col
    );
    
    onUpdateProject({
      ...project,
      columns: updatedColumns,
      updatedAt: new Date().toISOString(),
    });
  };

  const addColumn = () => {
    const colors = ['#ef4444', '#f59e0b', '#8b5cf6', '#10b981', '#06b6d4', '#f97316'];
    const usedColors = project.columns.map(c => c.color);
    const availableColor = colors.find(c => !usedColors.includes(c)) || colors[0];
    
    const newColumn: ColumnType = {
      id: crypto.randomUUID(),
      title: `Column ${project.columns.length + 1}`,
      color: availableColor,
      viewMode: 'kanban',
    };

    onUpdateProject({
      ...project,
      columns: [...project.columns, newColumn],
      updatedAt: new Date().toISOString(),
    });
  };

  const deleteColumn = (columnId: string) => {
    const updatedColumns = project.columns.filter(c => c.id !== columnId);
    const updatedTasks = project.tasks.filter(t => t.columnId !== columnId);
    
    onUpdateProject({
      ...project,
      columns: updatedColumns,
      tasks: updatedTasks,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleNotesChange = (notes: string) => {
    onUpdateProject({
      ...project,
      notes,
      updatedAt: new Date().toISOString(),
    });
  };

  const clearFilters = () => {
    setFilters({
      tags: [],
      priority: [],
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  return (
    <div className="flex-1 overflow-hidden relative flex flex-col">
      <FilterToolbar
        availableTags={availableTags}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 p-6 overflow-x-auto">
          <div className="flex space-x-6 h-full">
            <SortableContext items={project.columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
              {project.columns.map((column) => {
                const columnTasks = filteredTasks.filter(t => t.columnId === column.id);
                return (
                  <Column
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onRenameColumn={handleRenameColumn}
                    onDeleteColumn={deleteColumn}
                    onToggleViewMode={handleToggleViewMode}
                  />
                );
              })}
            </SortableContext>
            
            <div className="flex-shrink-0">
              <button
                onClick={addColumn}
                className="flex items-center justify-center w-80 h-32 border-2 border-dashed border-gray-700 hover:border-gray-600 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-2 text-gray-400 group-hover:text-gray-300">
                  <Plus className="w-5 h-5" />
                  <span>Add Column</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-6 opacity-90">
              <TaskCard task={activeTask} onEdit={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        columns={project.columns}
      />

      <NotesPanel
        notes={project.notes}
        onNotesChange={handleNotesChange}
        isOpen={isNotesOpen}
        onToggle={() => setIsNotesOpen(!isNotesOpen)}
      />
    </div>
  );
};