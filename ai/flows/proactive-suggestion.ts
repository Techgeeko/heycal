'use server';

/**
 * @fileOverview This flow provides proactive suggestions about the user's schedule.
 *
 * - getProactiveSuggestion - A function that analyzes the schedule and offers advice.
 * - ProactiveSuggestionInput - The input type for the getProactiveSuggestion function.
 * - ProactiveSuggestionOutput - The return type for the getProactiveSuggestion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { listEvents } from '@/lib/services/google-calendar';

const ProactiveSuggestionInputSchema = z.object({
  query: z.string().describe("The user's question or concern about their schedule."),
  accessToken: z.string().describe('The user\'s Google Calendar access token.'),
  userTimezone: z.string().describe('The IANA timezone of the user (e.g., "America/New_York").'),
});
export type ProactiveSuggestionInput = z.infer<typeof ProactiveSuggestionInputSchema>;

const ProactiveSuggestionOutputSchema = z.object({
  suggestion: z.string().describe('A helpful suggestion based on the user\'s schedule.'),
});
export type ProactiveSuggestionOutput = z.infer<typeof ProactiveSuggestionOutputSchema>;

export async function getProactiveSuggestion(input: ProactiveSuggestionInput): Promise<ProactiveSuggestionOutput> {
  return proactiveSuggestionFlow(input);
}

const generateSuggestionPrompt = ai.definePrompt({
    name: 'generateProactiveSuggestionPrompt',
    input: { schema: z.object({ query: z.string(), events: z.string() }) },
    output: { schema: ProactiveSuggestionOutputSchema },
    prompt: `You are a helpful calendar assistant. The user is asking for advice about their schedule.
    Analyze their upcoming events and provide a proactive, helpful suggestion.
    Look for things like back-to-back meetings, lack of breaks, or opportunities to be more productive.
    
    User's query: {{{query}}}
    Upcoming Events (JSON): {{{events}}}
    `,
});

const proactiveSuggestionFlow = ai.defineFlow(
  {
    name: 'proactiveSuggestionFlow',
    inputSchema: ProactiveSuggestionInputSchema,
    outputSchema: ProactiveSuggestionOutputSchema,
  },
  async (input) => {
    try {
        const events = await listEvents(input.accessToken);
        const { output } = await generateSuggestionPrompt({
            query: input.query,
            events: JSON.stringify(events, null, 2),
        });

        if (output?.suggestion) {
            return { suggestion: output.suggestion };
        } else {
            return { suggestion: "I looked at your calendar but couldn't find any specific suggestions right now. Is there anything else I can help with?" };
        }

    } catch (e) {
        console.error(e);
        return { suggestion: "I had some trouble analyzing your schedule. Please try again later." };
    }
  }
);