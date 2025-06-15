export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  notes: string;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  checklist: ChecklistItem[];
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  viewMode: 'kanban' | 'timeline';
}

export interface Project {
  id: string;
  name: string;
  columns: Column[];
  tasks: Task[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  projects: Project[];
  currentProjectId: string | null;
}

export interface FilterState {
  tags: string[];
  priority: string[];
  sortBy: 'dueDate' | 'priority' | 'title' | 'created';
  sortOrder: 'asc' | 'desc';
}