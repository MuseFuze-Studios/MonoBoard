export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  tags: string[];
  dueDate?: string;
  checklist: ChecklistItem[];
  columnId: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
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