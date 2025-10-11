'use client';

import { useState, useMemo, createContext, useContext } from 'react';
import { updateTaskStatus } from '@/lib/actions';
import type { Task, TaskStatus } from '@/lib/types';
import KanbanColumn from './kanban-column';

const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

interface KanbanContextType {
  addTask: (task: Task) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within a KanbanBoard');
  }
  return context;
}

export default function KanbanBoard({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const addTaskToBoard = (newTask: Task) => {
    setTasks(currentTasks => [newTask, ...currentTasks]);
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (newStatus: TaskStatus) => {
    if (!draggedTaskId) return;

    // Optimistic UI update
    const updatedTasks = tasks.map(task =>
      task.id === draggedTaskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    // Call server action
    updateTaskStatus(draggedTaskId, newStatus);
  };

  const columns = useMemo(() => {
    return STATUSES.map(status => ({
      status,
      tasks: tasks.filter(task => task.status === status),
    }));
  }, [tasks]);

  return (
    <KanbanContext.Provider value={{ addTask: addTaskToBoard }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ status, tasks }) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            isDraggedOver={draggedTaskId !== null}
          />
        ))}
      </div>
    </KanbanContext.Provider>
  );
}
