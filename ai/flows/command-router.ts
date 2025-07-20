'use server';

/**
 * @fileOverview This flow routes user commands to the appropriate action.
 *
 * - routeCommand - A function that determines the user's intent.
 * - RouteCommandInput - The input type for the routeCommand function.
 * - RouteCommandOutput - The return type for the routeCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export async function routeCommand(
  input: { message: string }
): Promise<{ command: 'schedule' | 'reschedule' | 'cancel' | 'view_events' | 'chat' }> {
  const RouteCommandInputSchema = z.object({
    message: z.string().describe("The user's message."),
  });

  const commandSchema = z.enum(['schedule', 'reschedule', 'cancel', 'view_events', 'chat']);

  const RouteCommandOutputSchema = z.object({
    command: commandSchema.describe(
      "The command the user wants to execute. If the user is asking a question about their events, respond with 'view_events'. If the user is just making small talk, respond with 'chat'."
    ),
  });

  const commandRouterPrompt = ai.definePrompt({
    name: 'commandRouterPrompt',
    input: {schema: RouteCommandInputSchema},
    output: {schema: RouteCommandOutputSchema},
    prompt: `You are a command router for a calendar assistant. Your job is to determine what the user wants to do based on their message.

The available commands are:
- \`schedule\`: To create a new event.
- \`reschedule\`: To move an existing event.
- \`cancel\`: To delete an event.
- \`view_events\`: To answer a question about the schedule.
- \`chat\`: For general conversation, greetings, or anything that doesn't fit the other commands.

Analyze the user's message and respond with the appropriate command in JSON format.

User Message: {{{message}}}

Examples:
- "Hey, can you set up a meeting for tomorrow at 2pm?" -> {"command": "schedule"}
- "I need to cancel my dentist appointment." -> {"command": "cancel"}
- "Move my 3pm meeting to 4pm." -> {"command": "reschedule"}
- "How many meetings do I have tomorrow?" -> {"command": "view_events"}
- "What's on my schedule for today?" -> {"command": "view_events"}
- "Hello there!" -> {"command": "chat"}
- "Thank you" -> {"command": "chat"}
- "Who are you?" -> {"command": "chat"}
`,
  });

  const commandRouterFlow = ai.defineFlow(
    {
      name: 'commandRouterFlow',
      inputSchema: RouteCommandInputSchema,
      outputSchema: RouteCommandOutputSchema,
    },
    async input => {
      const {output} = await commandRouterPrompt(input);
      return output!;
    }
  );

  return commandRouterFlow(input);
}