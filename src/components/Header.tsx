import React, { useRef, useState } from 'react';
import { Plus, Download, Upload, Settings, Gamepad2, ChevronDown, Trash2, Edit3 } from 'lucide-react';
import { Project } from '../types';

interface HeaderProps {
  projects: Project[];
  currentProject: Project | null;
  onCreateProject: () => void;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onRenameProject: (projectId: string, newName: string) => void;
  onExportProject: () => void;
  onImportProject: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  currentProject,
  onCreateProject,
  onSelectProject,
  onDeleteProject,
  onRenameProject,
  onExportProject,
  onImportProject,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImportProject(file);
      event.target.value = '';
    }
  };

  const startRenaming = (project: Project) => {
    setEditingProjectId(project.id);
    setEditingName(project.name);
    setShowProjectMenu(false);
  };

  const saveRename = () => {
    if (editingProjectId && editingName.trim()) {
      onRenameProject(editingProjectId, editingName.trim());
    }
    setEditingProjectId(null);
    setEditingName('');
  };

  const cancelRename = () => {
    setEditingProjectId(null);
    setEditingName('');
  };

  const handleDeleteProject = (projectId: string) => {
    if (projects.length <= 1) {
      alert('Cannot delete the last project. Create another project first.');
      return;
    }
    
    const project = projects.find(p => p.id === projectId);
    if (project && confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
      onDeleteProject(projectId);
    }
    setShowProjectMenu(false);
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-purple-400" />
            <h1 className="text-2xl font-bold text-white">MonoBoard</h1>
          </div>
          
          <div className="h-6 w-px bg-gray-700" />
          
          <div className="relative">
            {editingProjectId === currentProject?.id ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveRename();
                    if (e.key === 'Escape') cancelRename();
                  }}
                  onBlur={saveRename}
                  className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-purple-500 focus:outline-none text-sm"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setShowProjectMenu(!showProjectMenu)}
                className="flex items-center space-x-2 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 hover:border-gray-600 focus:border-purple-500 focus:outline-none transition-colors"
              >
                <span>{currentProject?.name || 'Select Project'}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
            
            {showProjectMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <div className="text-xs text-gray-400 px-2 py-1 mb-1">Projects</div>
                  {projects.map((project) => (
                    <div key={project.id} className="group flex items-center justify-between hover:bg-gray-700 rounded px-2 py-2">
                      <button
                        onClick={() => {
                          onSelectProject(project.id);
                          setShowProjectMenu(false);
                        }}
                        className={`flex-1 text-left text-sm ${
                          currentProject?.id === project.id ? 'text-purple-400' : 'text-white'
                        }`}
                      >
                        {project.name}
                      </button>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startRenaming(project)}
                          className="text-gray-400 hover:text-white p-1 rounded transition-colors"
                          title="Rename project"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        {projects.length > 1 && (
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-gray-400 hover:text-red-400 p-1 rounded transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onCreateProject}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
          
          <button
            onClick={onExportProject}
            disabled={!currentProject}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          
          <button
            onClick={handleImportClick}
            className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Import</span>
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
};