import { getTasks } from '@/lib/actions';
import KanbanBoard from '@/components/kanban/kanban-board';
import AddTaskDialog from '@/components/kanban/add-task-dialog';
import { CheckSquare } from 'lucide-react';
import { KanbanProvider } from '@/components/kanban/kanban-provider';

export default async function Home() {
  const tasks = await getTasks();

  return (
    <KanbanProvider initialTasks={tasks}>
      <main className="flex min-h-screen flex-col">
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
          <KanbanBoard />
        </div>
      </main>
    </KanbanProvider>
  );
}
