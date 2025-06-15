import { AppState, Project } from '../types';

const STORAGE_KEY = 'monoboard-data';

export const loadAppState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading app state:', error);
  }
  
  return {
    projects: [],
    currentProjectId: null,
  };
};

export const saveAppState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Error saving app state:', error);
  }
};

export const exportProject = (project: Project): void => {
  const dataStr = JSON.stringify(project, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${project.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const importProject = (file: File): Promise<Project> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const project = JSON.parse(result) as Project;
        
        // Validate project structure
        if (!project.id || !project.name || !Array.isArray(project.columns) || !Array.isArray(project.tasks)) {
          throw new Error('Invalid project format');
        }
        
        // Generate new ID to avoid conflicts
        project.id = crypto.randomUUID();
        project.updatedAt = new Date().toISOString();
        
        resolve(project);
      } catch (error) {
        reject(new Error('Failed to parse project file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};