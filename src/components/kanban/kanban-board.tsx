'use client';

import { useMemo } from 'react';
import { updateTaskStatus } from '@/lib/actions';
import type { TaskStatus } from '@/lib/types';
import KanbanColumn from './kanban-column';
import { useKanban } from './kanban-provider';

const STATUSES: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

export default function KanbanBoard() {
  const { tasks, setTasks, draggedTaskId, setDraggedTaskId } = useKanban();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    setDraggedTaskId(taskId);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
  };

  const handleDrop = (newStatus: TaskStatus) => {
    if (!draggedTaskId) return;

    const originalTask = tasks.find(t => t.id === draggedTaskId);
    if (!originalTask) return;

    const originalStatus = originalTask.status;

    // Optimistic UI update
    const updatedTasks = tasks.map(task =>
      task.id === draggedTaskId ? { ...task, status: newStatus } : task
    );
    setTasks(updatedTasks);

    // Call server action and revert on failure
    updateTaskStatus(draggedTaskId, newStatus).catch(() => {
        // Revert UI if the server update fails
        setTasks(currentTasks => currentTasks.map(t => t.id === draggedTaskId ? { ...t, status: originalStatus } : t));
    });
  };

  const columns = useMemo(() => {
    return STATUSES.map(status => ({
      status,
      tasks: tasks.filter(task => task.status === status),
    }));
  }, [tasks]);

  return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(({ status, tasks }) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks}
            onDrop={handleDrop}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </div>
  );
}
