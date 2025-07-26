'use server';

/**
 * @fileOverview This flow breaks down a high-level goal into a series of calendar events.
 *
 * - scheduleGoal - A function that creates a plan for a user's goal.
 * - ScheduleGoalInput - The input type for the scheduleGoal function.
 * - ScheduleGoalOutput - The return type for the scheduleGoal function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { listEvents } from '@/lib/services/google-calendar';

const ScheduleGoalInputSchema = z.object({
  goal: z.string().describe("The user's high-level goal."),
  accessToken: z.string().describe('The user\'s Google Calendar access token.'),
  userTimezone: z.string().describe('The IANA timezone of the user (e.g., "America/New_York").'),
});
export type ScheduleGoalInput = z.infer<typeof ScheduleGoalInputSchema>;

const ScheduleGoalOutputSchema = z.object({
  plan: z.string().describe('A message outlining the scheduled plan or asking for confirmation.'),
});
export type ScheduleGoalOutput = z.infer<typeof ScheduleGoalOutputSchema>;

export async function scheduleGoal(input: ScheduleGoalInput): Promise<ScheduleGoalOutput> {
  return scheduleGoalFlow(input);
}

const generatePlanPrompt = ai.definePrompt({
    name: 'generateGoalPlanPrompt',
    input: { schema: z.object({ goal: z.string(), events: z.string(), referenceTime: z.string() }) },
    output: { schema: ScheduleGoalOutputSchema },
    prompt: `You are an expert project manager and scheduling assistant. A user has given you a high-level goal.
    Your task is to break this goal down into a series of smaller, actionable steps.
    Then, propose a simple, easy-to-read schedule for these steps that the user could add to their calendar.
    Do not schedule them yet, just propose the plan.

    You have access to the user's upcoming events to avoid suggesting times that are already booked.
    The current date and time is {{referenceTime}}.

    User's Goal: {{{goal}}}

    Upcoming Events (JSON): {{{events}}}

    Create a friendly message that outlines the plan.
    Example: "To help you prepare for your presentation, I can schedule 'Draft Slides' for Tuesday at 2pm and 'Practice Presentation' for Thursday at 11am. Would you like me to add these to your calendar?"
    `,
});


const scheduleGoalFlow = ai.defineFlow(
  {
    name: 'scheduleGoalFlow',
    inputSchema: ScheduleGoalInputSchema,
    outputSchema: ScheduleGoalOutputSchema,
  },
  async (input) => {
    try {
        const events = await listEvents(input.accessToken);
        const referenceTime = new Date().toISOString();

        const { output } = await generatePlanPrompt({
            goal: input.goal,
            events: JSON.stringify(events, null, 2),
            referenceTime,
        });
        
        if (output?.plan) {
            return { plan: output.plan };
        } else {
            return { plan: "I had some trouble breaking that goal down. Could you try being more specific?" };
        }

    } catch (e) {
        console.error(e);
        return { plan: "I had an issue creating a plan for that goal. Please try again." };
    }
  }
);