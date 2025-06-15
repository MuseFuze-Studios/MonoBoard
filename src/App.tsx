import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { KanbanBoard } from './components/KanbanBoard';
import { Project, AppState } from './types';
import { loadAppState, saveAppState, exportProject, importProject } from './utils/storage';
import { createDefaultProject } from './utils/defaultData';

function App() {
  const [appState, setAppState] = useState<AppState>({ projects: [], currentProjectId: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedState = loadAppState();
    
    if (savedState.projects.length === 0) {
      const defaultProject = createDefaultProject();
      savedState.projects = [defaultProject];
      savedState.currentProjectId = defaultProject.id;
    }
    
    setAppState(savedState);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      saveAppState(appState);
    }
  }, [appState, loading]);

  const currentProject = appState.projects.find(p => p.id === appState.currentProjectId) || null;

  const createProject = () => {
    const projectName = prompt('Enter project name:');
    if (!projectName?.trim()) return;

    const newProject: Project = {
      id: crypto.randomUUID(),
      name: projectName.trim(),
      columns: [
        { id: 'todo', title: 'To Do', color: '#ef4444' },
        { id: 'in-progress', title: 'In Progress', color: '#f59e0b' },
        { id: 'done', title: 'Done', color: '#10b981' },
      ],
      tasks: [],
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAppState({
      projects: [...appState.projects, newProject],
      currentProjectId: newProject.id,
    });
  };

  const selectProject = (projectId: string) => {
    setAppState({
      ...appState,
      currentProjectId: projectId,
    });
  };

  const deleteProject = (projectId: string) => {
    const updatedProjects = appState.projects.filter(p => p.id !== projectId);
    let newCurrentProjectId = appState.currentProjectId;
    
    if (appState.currentProjectId === projectId) {
      newCurrentProjectId = updatedProjects.length > 0 ? updatedProjects[0].id : null;
    }
    
    setAppState({
      projects: updatedProjects,
      currentProjectId: newCurrentProjectId,
    });
  };

  const renameProject = (projectId: string, newName: string) => {
    setAppState({
      ...appState,
      projects: appState.projects.map(p => 
        p.id === projectId ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p
      ),
    });
  };

  const updateProject = (updatedProject: Project) => {
    setAppState({
      ...appState,
      projects: appState.projects.map(p => 
        p.id === updatedProject.id ? updatedProject : p
      ),
    });
  };

  const handleExportProject = () => {
    if (currentProject) {
      exportProject(currentProject);
    }
  };

  const handleImportProject = async (file: File) => {
    try {
      const importedProject = await importProject(file);
      setAppState({
        projects: [...appState.projects, importedProject],
        currentProjectId: importedProject.id,
      });
    } catch (error) {
      alert(`Failed to import project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading MonoBoard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col">
      <Header
        projects={appState.projects}
        currentProject={currentProject}
        onCreateProject={createProject}
        onSelectProject={selectProject}
        onDeleteProject={deleteProject}
        onRenameProject={renameProject}
        onExportProject={handleExportProject}
        onImportProject={handleImportProject}
      />
      
      {currentProject ? (
        <KanbanBoard
          project={currentProject}
          onUpdateProject={updateProject}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-950">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to MonoBoard</h2>
            <p className="text-gray-400 mb-8">Create or select a project to get started</p>
            <button
              onClick={createProject}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;