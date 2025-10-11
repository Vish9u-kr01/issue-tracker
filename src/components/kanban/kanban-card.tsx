'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { deleteTask, updateTaskStatus } from '@/lib/actions';
import type { Task, TaskPriority, TaskStatus } from '@/lib/types';
import {
  Flame,
  Minus,
  ArrowDown,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const priorityConfig: {
  [key in TaskPriority]: { icon: React.ElementType; variant: 'destructive' | 'secondary' | 'outline', colorClass: string };
} = {
  High: { icon: Flame, variant: 'destructive', colorClass: 'text-destructive' },
  Medium: { icon: Minus, variant: 'secondary', colorClass: 'text-yellow-500' },
  Low: { icon: ArrowDown, variant: 'outline', colorClass: 'text-blue-500' },
};

const statusOrder: TaskStatus[] = ['Todo', 'In Progress', 'Done'];

interface KanbanCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd: () => void;
}

export default function KanbanCard({ task, onDragStart, onDragEnd }: KanbanCardProps) {
  const { toast } = useToast();
  const currentStatusIndex = statusOrder.indexOf(task.status);

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      toast({ title: 'Task deleted' });
    } catch {
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to delete task.' });
    }
  };

  const moveTask = async (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentStatusIndex - 1 : currentStatusIndex + 1;
    if (newIndex >= 0 && newIndex < statusOrder.length) {
      const newStatus = statusOrder[newIndex];
      await updateTaskStatus(task.id, newStatus);
      toast({ title: `Task moved to ${newStatus}` });
    }
  };

  const PriorityIcon = priorityConfig[task.priority].icon;

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className="mb-4 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg mb-2">{task.title}</CardTitle>
          <Badge variant={priorityConfig[task.priority].variant} className="flex items-center gap-1.5 shrink-0">
             <PriorityIcon className={`h-4 w-4 ${priorityConfig[task.priority].colorClass}`} />
            {task.priority}
          </Badge>
        </div>
        <CardDescription>{task.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex gap-2">
           <Button
            variant="ghost"
            size="icon"
            onClick={() => moveTask('prev')}
            disabled={currentStatusIndex === 0}
            aria-label="Move task to previous column"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => moveTask('next')}
            disabled={currentStatusIndex === statusOrder.length - 1}
            aria-label="Move task to next column"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleDelete}
          className="text-muted-foreground hover:text-destructive"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
