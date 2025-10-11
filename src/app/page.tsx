import { getTasks } from '@/lib/actions';
import KanbanBoard from '@/components/kanban/kanban-board';
import AddTaskDialog from '@/components/kanban/add-task-dialog';
import { CheckSquare } from 'lucide-react';

export default async function Home() {
  const tasks = await getTasks();

  return (
    <main className="flex min-h-screen flex-col">
       <KanbanBoard initialTasks={tasks}>
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckSquare className="w-8 h-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                TaskFlow
              </h1>
            </div>
            <AddTaskDialog />
          </header>

          {/* KanbanBoard children will be rendered here, which is the grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* This will be populated by KanbanBoard */}
          </div>
        </div>
      </KanbanBoard>
    </main>
  );
}
