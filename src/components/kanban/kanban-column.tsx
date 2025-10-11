'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Task, TaskStatus } from '@/lib/types';
import KanbanCard from './kanban-card';
import { StatusIcon } from '../icons';

interface KanbanColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onDrop: (status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
  isDraggedOver: boolean;
}

export default function KanbanColumn({
  status,
  tasks,
  onDrop,
  onDragStart,
  onDragEnd
}: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsOver(false);
    onDrop(status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col rounded-lg bg-secondary/50 p-4 transition-colors duration-200',
        isOver ? 'bg-accent/40' : ''
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <StatusIcon status={status} className="h-5 w-5" />
        <h2 className="text-lg font-semibold text-foreground">{status}</h2>
        <span className="ml-2 text-sm font-medium bg-muted text-muted-foreground rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>
      <div className="flex-grow min-h-[100px]">
        {tasks.map(task => (
          <KanbanCard key={task.id} task={task} onDragStart={onDragStart} onDragEnd={onDragEnd} />
        ))}
        {tasks.length === 0 && (
           <div className="flex items-center justify-center h-full border-2 border-dashed border-border rounded-md text-muted-foreground p-4">
            <p>Drop tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
}
