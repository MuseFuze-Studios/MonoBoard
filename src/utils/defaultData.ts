import { Project, Column } from '../types';

export const createDefaultProject = (): Project => {
  const defaultColumns: Column[] = [
    { id: 'todo', title: 'To Do', color: '#ef4444', viewMode: 'kanban' },
    { id: 'in-progress', title: 'In Progress', color: '#f59e0b', viewMode: 'kanban' },
    { id: 'testing', title: 'Testing', color: '#8b5cf6', viewMode: 'kanban' },
    { id: 'done', title: 'Done', color: '#10b981', viewMode: 'kanban' },
  ];

  return {
    id: crypto.randomUUID(),
    name: 'My Game Project',
    columns: defaultColumns,
    tasks: [
      {
        id: crypto.randomUUID(),
        title: 'Design game mechanics',
        description: 'Create core gameplay loop and define player interactions',
        notes: 'Research inspiration from similar games like Celeste and Hollow Knight. Focus on tight controls and satisfying feedback loops.',
        tags: ['design', 'gameplay'],
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checklist: [
          { id: crypto.randomUUID(), text: 'Research similar games', completed: true },
          { id: crypto.randomUUID(), text: 'Create mockups', completed: false },
          { id: crypto.randomUUID(), text: 'Test with friends', completed: false },
        ],
        columnId: 'todo',
      },
      {
        id: crypto.randomUUID(),
        title: 'Implement player movement',
        description: 'Code basic player controls and physics',
        notes: 'Use Unity\'s CharacterController for consistent movement. Consider coyote time and jump buffering for better feel.',
        tags: ['programming', 'physics'],
        priority: 'high',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        checklist: [
          { id: crypto.randomUUID(), text: 'Set up input system', completed: true },
          { id: crypto.randomUUID(), text: 'Add collision detection', completed: false },
        ],
        columnId: 'in-progress',
      },
      {
        id: crypto.randomUUID(),
        title: 'Create sprite animations',
        description: 'Design and animate character sprites',
        notes: 'Keep animations at 12fps for pixel art style. Use Aseprite for animation work.',
        tags: ['art', 'animation'],
        priority: 'medium',
        checklist: [
          { id: crypto.randomUUID(), text: 'Sketch character designs', completed: true },
          { id: crypto.randomUUID(), text: 'Create walk cycle', completed: true },
          { id: crypto.randomUUID(), text: 'Export sprite sheets', completed: true },
        ],
        columnId: 'done',
      },
    ],
    notes: `Welcome to your game development project!

Use this notes section to:
• Brainstorm new features and mechanics
• Track bugs and issues
• Document art style decisions
• Keep meeting notes and feedback
• Store useful links and resources

This space is perfect for those random ideas that pop up during development!`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};