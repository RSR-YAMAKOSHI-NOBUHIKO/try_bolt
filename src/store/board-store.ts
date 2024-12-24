import { create } from 'zustand';

export type Id = string | number;

export type Column = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  columnId: Id;
  content: string;
};

interface BoardState {
  columns: Column[];
  tasks: Task[];
  addColumn: (title: string) => void;
  addTask: (columnId: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  deleteColumn: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  moveTask: (taskId: Id, toColumnId: Id) => void;
}

export const useBoardStore = create<BoardState>((set) => ({
  columns: [
    { id: 1, title: 'To Do' },
    { id: 2, title: 'In Progress' },
    { id: 3, title: 'Done' },
  ],
  tasks: [],
  addColumn: (title) =>
    set((state) => ({
      columns: [...state.columns, { id: Date.now(), title }],
    })),
  addTask: (columnId, content) =>
    set((state) => ({
      tasks: [...state.tasks, { id: Date.now(), columnId, content }],
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  deleteColumn: (id) =>
    set((state) => ({
      columns: state.columns.filter((col) => col.id !== id),
      tasks: state.tasks.filter((task) => task.columnId !== id),
    })),
  updateTask: (id, content) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, content } : task
      ),
    })),
  moveTask: (taskId, toColumnId) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, columnId: toColumnId } : task
      ),
    })),
}));