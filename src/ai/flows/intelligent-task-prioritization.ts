'use server';

/**
 * @fileOverview A flow that suggests task prioritization based on the task description.
 *
 * - prioritizeTask - A function that suggests task prioritization.
 * - PrioritizeTaskInput - The input type for the prioritizeTask function.
 * - PrioritizeTaskOutput - The return type for the prioritizeTask function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PrioritizeTaskInputSchema = z.object({
  description: z.string().describe('The description of the task.'),
});
export type PrioritizeTaskInput = z.infer<typeof PrioritizeTaskInputSchema>;

const PrioritizeTaskOutputSchema = z.object({
  priority: z
    .string()
    .describe(
      'The suggested priority for the task, can be High, Medium, or Low.'
    ),
  reason: z
    .string()
    .describe('The reasoning behind the suggested priority.'),
});
export type PrioritizeTaskOutput = z.infer<typeof PrioritizeTaskOutputSchema>;

export async function prioritizeTask(
  input: PrioritizeTaskInput
): Promise<PrioritizeTaskOutput> {
  return prioritizeTaskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'prioritizeTaskPrompt',
  input: {schema: PrioritizeTaskInputSchema},
  output: {schema: PrioritizeTaskOutputSchema},
  prompt: `You are a task prioritization expert. Given the following task description, suggest a priority (High, Medium, or Low) and explain your reasoning.\n\nTask Description: {{{description}}}`,
});

const prioritizeTaskFlow = ai.defineFlow(
  {
    name: 'prioritizeTaskFlow',
    inputSchema: PrioritizeTaskInputSchema,
    outputSchema: PrioritizeTaskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
