
'use server';

/**
 * @fileOverview This flow is responsible for canceling events based on natural language commands.
 *
 * - cancelEvent - A function that handles the event cancellation process.
 * - CancelEventInput - The input type for the cancelEvent function.
 * - CancelEventOutput - The return type for the cancelEvent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { deleteEvent, listEvents } from '@/lib/services/google-calendar';
import type { calendar_v3 } from 'googleapis';

const CancelEventInputSchema = z.object({
  command: z.string().describe('The user\'s command to cancel an event.'),
  accessToken: z.string().describe('The user\'s Google Calendar access token.'),
});
export type CancelEventInput = z.infer<typeof CancelEventInputSchema>;

const CancelEventOutputSchema = z.object({
  success: z.boolean().describe('Whether the event cancellation was successful.'),
  message: z.string().describe('A confirmation message to display to the user.'),
});
export type CancelEventOutput = z.infer<typeof CancelEventOutputSchema>;

export async function cancelEvent(input: CancelEventInput): Promise<CancelEventOutput> {
  return cancelEventFlow(input);
}

const FindEventToCancelSchema = z.object({
    eventName: z.string().describe("The name of the event the user wants to cancel. Be specific.")
});

const findEventPrompt = ai.definePrompt({
    name: 'findEventToCancelPrompt',
    input: { schema: z.object({ command: z.string() }) },
    output: { schema: FindEventToCancelSchema },
    prompt: `The user wants to cancel an event. Identify the name of the event from their command.
    
    Command: {{{command}}}`,
});

const cancelEventFlow = ai.defineFlow(
  {
    name: 'cancelEventFlow',
    inputSchema: CancelEventInputSchema,
    outputSchema: CancelEventOutputSchema,
  },
  async (input) => {
    try {
        const { output } = await findEventPrompt({ command: input.command });
        if (!output?.eventName) {
            return { success: false, message: "I couldn't figure out which event you want to cancel. Can you be more specific?" };
        }

        const events = await listEvents(input.accessToken);
        const eventToCancel = events.find(event => event.summary?.toLowerCase().includes(output.eventName.toLowerCase()));

        if (!eventToCancel || !eventToCancel.id) {
            return { success: false, message: `I couldn't find an event called "${output.eventName}" on your calendar.` };
        }

        const success = await deleteEvent(input.accessToken, eventToCancel.id);
        if (success) {
            return { success: true, message: `OK, I've cancelled "${eventToCancel.summary}".` };
        } else {
            return { success: false, message: `I had trouble cancelling "${eventToCancel.summary}". Please try again.` };
        }

    } catch (e) {
        console.error(e);
        return { success: false, message: "An unexpected error occurred while cancelling your event." };
    }
  }
);