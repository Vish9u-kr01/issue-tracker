'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addTask, suggestPriorityAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, Sparkles, Wand2 } from 'lucide-react';
import type { TaskPriority } from '@/lib/types';
import type { PrioritizeTaskOutput } from '@/ai/flows/intelligent-task-prioritization';
import { useKanban } from './kanban-provider';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  priority: z.enum(['High', 'Medium', 'Low']),
});

export default function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestion, setSuggestion] = useState<PrioritizeTaskOutput | null>(null);
  const { toast } = useToast();
  const { addTask: addTaskToBoard } = useKanban();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'Medium',
    },
  });

  const descriptionValue = form.watch('description');

  const handleSuggestPriority = async () => {
    setIsSuggesting(true);
    setSuggestion(null);
    const result = await suggestPriorityAction(descriptionValue);
    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'AI Suggestion Failed',
        description: result.error,
      });
    } else {
      setSuggestion(result);
      form.setValue('priority', result.priority as TaskPriority);
    }
    setIsSuggesting(false);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const result = await addTask({ ...values, status: 'Todo' });

    if ('error' in result) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    } else {
      toast({
        title: 'Success',
        description: 'Task has been added.',
      });
      addTaskToBoard(result.data); // Optimistically update UI
      form.reset();
      setSuggestion(null);
      setOpen(false);
    }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Create a new task</DialogTitle>
          <DialogDescription>
            Fill in the details below. You can also use our AI to suggest a priority.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Design the new dashboard" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., Create mockups for all user flows and component states."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
                <FormLabel>Priority Suggestion</FormLabel>
                <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSuggestPriority}
                    disabled={!descriptionValue || isSuggesting}
                >
                    {isSuggesting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                    )}
                    Suggest Priority
                </Button>
                {suggestion && (
                    <div className="p-3 bg-secondary/50 rounded-md text-sm text-secondary-foreground border">
                        <p className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary"/> AI Suggestion: {suggestion.priority}</p>
                        <p className="text-muted-foreground mt-1">{suggestion.reason}</p>
                    </div>
                )}
            </div>

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
