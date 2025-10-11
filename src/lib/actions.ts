'use server';

import { revalidatePath } from 'next/cache';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, orderBy, query } from 'firebase/firestore';
import { db } from './firebase';
import type { Task, TaskData, TaskPriority, TaskStatus } from './types';
import { prioritizeTask, PrioritizeTaskOutput } from '@/ai/flows/intelligent-task-prioritization';

export async function getTasks(): Promise<Task[]> {
  try {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        createdAt: data.createdAt?.toMillis() || Date.now(),
      } as Task;
    });
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    return [];
  }
}

export async function addTask(task: Omit<TaskData, 'createdAt'>): Promise<{ id: string } | { error: string }> {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: serverTimestamp(),
    });
    revalidatePath('/');
    return { id: docRef.id };
  } catch (error) {
    console.error("Error adding task: ", error);
    return { error: 'Failed to add task.' };
  }
}

export async function updateTaskStatus(id: string, status: TaskStatus): Promise<void> {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await updateDoc(taskDoc, { status });
    revalidatePath('/');
  } catch (error) {
    console.error("Error updating task status: ", error);
    // Optionally return an error object
  }
}

export async function deleteTask(id: string): Promise<void> {
  try {
    const taskDoc = doc(db, 'tasks', id);
    await deleteDoc(taskDoc);
    revalidatePath('/');
  } catch (error) {
    console.error("Error deleting task: ", error);
    // Optionally return an error object
  }
}

export async function suggestPriorityAction(description: string): Promise<PrioritizeTaskOutput | { error: string }> {
    try {
        if (!description.trim()) {
            return { error: 'Description cannot be empty.' };
        }
        const result = await prioritizeTask({ description });
        return result;
    } catch (error) {
        console.error("Error suggesting priority: ", error);
        return { error: 'Failed to get priority suggestion from AI.' };
    }
}
