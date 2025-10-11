import type { Timestamp } from "firebase/firestore";

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface TaskData {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Timestamp;
}

export interface Task extends Omit<TaskData, 'createdAt'> {
  id: string;
  createdAt: number;
}
