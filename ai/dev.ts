import { config } from 'dotenv';
config();

import '@/ai/flows/schedule-event.ts';
import '@/ai/flows/reschedule-event.ts';
import '@/ai/flows/cancel-event.ts';
import '@/ai/flows/command-router.ts';
import '@/ai/flows/answer-question-about-events.ts';