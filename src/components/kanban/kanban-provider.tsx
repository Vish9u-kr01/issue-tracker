'use client';

import { useState, createContext, useContext, type ReactNode, Dispatch, SetStateAction } from 'react';
import type { Task } from '@/lib/types';

interface KanbanContextType {
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (task: Task) => void;
  draggedTaskId: string | null;
  setDraggedTaskId: Dispatch<SetStateAction<string | null>>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
}

export const KanbanProvider = ({ initialTasks, children }: { initialTasks: Task[], children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const addTask = (newTask: Task) => {
    setTasks(currentTasks => [newTask, ...currentTasks]);
  };
  
  const value = {
    tasks,
    setTasks,
    addTask,
    draggedTaskId,
    setDraggedTaskId,
  }

  return (
    <KanbanContext.Provider value={value}>
      {children}
    </KanbanContext.Provider>
  );
}
