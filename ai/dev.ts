import { config } from 'dotenv';
config();

import '@/ai/flows/schedule-event.ts';
import '@/ai/flows/reschedule-event.ts';
import '@/ai/flows/cancel-event.ts';
import '@/ai/flows/command-router.ts';
import '@/ai/flows/answer-question-about-events.ts';
import '@/ai/flows/find-time.ts';
import '@/ai/flows/proactive-suggestion.ts';
import '@/ai/flows/goal-scheduling.ts';