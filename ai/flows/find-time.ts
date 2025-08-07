'use server';

/**
 * @fileOverview This flow finds available time slots in the user's calendar.
 *
 * - findTime - A function that suggests open time slots based on a user's query.
 * - FindTimeInput - The input type for the findTime function.
 * - FindTimeOutput - The return type for the findTime function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { findFreeTimeSlots } from '@/lib/services/google-calendar';
import { add, endOfDay, startOfToday } from 'date-fns';
import type { Credentials } from 'google-auth-library';

const FindTimeInputSchema = z.object({
  query: z.string().describe("The user's natural language request for finding a time slot."),
  tokens: z.custom<Credentials>().describe('The user\'s Google Calendar credentials object.'),
  userTimezone: z.string().describe('The IANA timezone of the user (e.g., "America/New_York").'),
});
export type FindTimeInput = z.infer<typeof FindTimeInputSchema>;

const FindTimeOutputSchema = z.object({
  suggestions: z.string().describe('A message containing suggested time slots or a reason why none were found.'),
});
export type FindTimeOutput = z.infer<typeof FindTimeOutputSchema>;

export async function findTime(input: FindTimeInput): Promise<FindTimeOutput> {
  return findTimeFlow(input);
}

const TimeRequestSchema = z.object({
    duration: z.number().describe('The duration of the event in minutes.'),
    timeRange: z.string().describe('A simple description of the time range to search within (e.g., "this week", "next month").'),
    start: z.string().describe('The start of the search window in ISO 8601 format.'),
    end: z.string().describe('The end of the search window in ISO 8601 format.'),
});

const extractTimeRequestPrompt = ai.definePrompt({
    name: 'extractTimeRequestPrompt',
    input: { schema: z.object({ query: z.string(), referenceTime: z.string() }) },
    output: { schema: TimeRequestSchema },
    prompt: `You are an expert at extracting time-related details from a user's query. The current date and time is {{referenceTime}}.
    
    The user wants to find an open time slot. Your job is to determine the required duration and the time window they want to search in.

    - duration: The length of the meeting in minutes. If not specified, assume 30 minutes.
    - timeRange: A simple description of the search window (e.g., "tomorrow", "next week").
    - start: The beginning of the search window in ISO 8601 format.
    - end: The end of the search window in ISO 8601 format.

    Query: {{{query}}}
    `,
});

const generateSuggestionsPrompt = ai.definePrompt({
    name: 'generateTimeSuggestionsPrompt',
    input: { schema: z.object({ query: z.string(), freeSlots: z.string() }) },
    output: { schema: FindTimeOutputSchema },
    prompt: `You are a helpful assistant. A user wants to find a time on their calendar. You have been given a list of available time slots.
    
    Your task is to select up to three of the best slots and present them to the user in a friendly, natural way.
    If there are no slots available, inform the user politely.

    User's request: {{{query}}}
    Available slots (JSON): {{{freeSlots}}}
    `,
});


const findTimeFlow = ai.defineFlow(
  {
    name: 'findTimeFlow',
    inputSchema: FindTimeInputSchema,
    outputSchema: FindTimeOutputSchema,
  },
  async (input) => {
    try {
        const referenceTime = new Date().toISOString();
        const { output: timeRequest } = await extractTimeRequestPrompt({ query: input.query, referenceTime });

        if (!timeRequest) {
            return { suggestions: "I'm sorry, I couldn't understand when you'd like to meet or for how long. Could you be more specific?" };
        }
        
        // Define a reasonable default search window if the LLM doesn't provide one
        const searchStart = timeRequest.start || startOfToday().toISOString();
        const searchEnd = timeRequest.end || endOfDay(add(new Date(), { weeks: 2 })).toISOString();


        const freeSlots = await findFreeTimeSlots(input.tokens, {
            timeMin: searchStart,
            timeMax: searchEnd,
            durationMinutes: timeRequest.duration,
            userTimezone: input.userTimezone
        });

        if (freeSlots.length === 0) {
            return { suggestions: `I couldn't find any ${timeRequest.duration}-minute slots available ${timeRequest.timeRange}. Would you like to try a different time?` };
        }

        const { output: suggestionOutput } = await generateSuggestionsPrompt({
            query: input.query,
            freeSlots: JSON.stringify(freeSlots),
        });

        return { suggestions: suggestionOutput?.suggestions || "I found some open slots, but I'm having trouble suggesting them. You can check your calendar." };

    } catch (e) {
        console.error(e);
        return { suggestions: "I had trouble finding open time slots. Please try again later."};
    }
  }
);