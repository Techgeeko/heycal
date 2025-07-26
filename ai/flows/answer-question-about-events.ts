'use server';

/**
 * @fileOverview This flow answers user questions about their upcoming events.
 *
 * - answerQuestionAboutEvents - A function that provides a natural language answer based on event data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export async function answerQuestionAboutEvents(
  input: { question: string, events: string }
): Promise<{ answer: string }> {

  const AnswerQuestionInputSchema = z.object({
    question: z.string().describe("The user's question about their schedule."),
    events: z.string().describe("A JSON string of upcoming events."),
  });

  const AnswerQuestionOutputSchema = z.object({
    answer: z.string().describe("A helpful, natural language answer to the user's question."),
  });

  const prompt = ai.definePrompt({
    name: 'answerQuestionPrompt',
    input: { schema: AnswerQuestionInputSchema },
    output: { schema: AnswerQuestionOutputSchema },
    prompt: `You are a helpful calendar assistant. A user is asking a question about their schedule.
Use the provided event data to answer their question.

User's Question: {{{question}}}

Event Data (JSON):
{{{events}}}

Formulate a friendly and direct answer to the user's question based on the event data.
If the event data doesn't contain the answer, say that you don't have that information.`,
  });

  const answerQuestionFlow = ai.defineFlow(
    {
      name: 'answerQuestionFlow',
      inputSchema: AnswerQuestionInputSchema,
      outputSchema: AnswerQuestionOutputSchema,
    },
    async (input) => {
      const { output } = await prompt(input);
      return output!;
    }
  );

  return answerQuestionFlow(input);
}