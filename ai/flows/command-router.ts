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
): Promise<{ command: 'schedule' | 'reschedule' | 'cancel' | 'view_events' | 'chat' | 'find_time' | 'proactive_suggestion' | 'goal_scheduling' }> {
  const RouteCommandInputSchema = z.object({
    message: z.string().describe("The user's message."),
  });

  const commandSchema = z.enum(['schedule', 'reschedule', 'cancel', 'view_events', 'chat', 'find_time', 'proactive_suggestion', 'goal_scheduling']);

  const RouteCommandOutputSchema = z.object({
    command: commandSchema.describe(
      `The command the user wants to execute.
- 'schedule': To create a new event at a specific time.
- 'reschedule': To move an existing event.
- 'cancel': To delete an event.
- 'view_events': To answer a question about the schedule.
- 'find_time': To find an open time slot.
- 'proactive_suggestion': When the user asks for advice or suggestions about their schedule.
- 'goal_scheduling': When the user asks for help with a high-level goal that needs to be broken down into multiple calendar events.
- 'chat': For general conversation, greetings, or anything that doesn't fit the other commands.`
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
- \`find_time\`: To find an open time slot on the calendar.
- \`proactive_suggestion\`: For when the user asks for advice or suggestions about their schedule.
- \`goal_scheduling\`: For when the user wants help planning a multi-step goal.
- \`chat\`: For general conversation, greetings, or anything that doesn't fit the other commands.

Analyze the user's message and respond with the appropriate command in JSON format.

User Message: {{{message}}}

Examples:
- "Hey, can you set up a meeting for tomorrow at 2pm?" -> {"command": "schedule"}
- "I need to cancel my dentist appointment." -> {"command": "cancel"}
- "Move my 3pm meeting to 4pm." -> {"command": "reschedule"}
- "How many meetings do I have tomorrow?" -> {"command": "view_events"}
- "Find a 30 minute slot for me next week" -> {"command": "find_time"}
- "I have back to back meetings, can you help?" -> {"command": "proactive_suggestion"}
- "Help me plan my launch party for next month." -> {"command": "goal_scheduling"}
- "Hello there!" -> {"command": "chat"}
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