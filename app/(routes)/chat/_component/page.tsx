"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sparkles, Mic, ArrowUp } from "lucide-react"
import { toast } from "sonner"
import { useCalendar } from "@/components/calendar-provider"
import { useChat } from "ai/react"

import { routeCommand } from "@/ai/flows/command-router"
import { cancelEvent } from "@/ai/flows/cancel-events"
import { getUpcomingEvents } from "@/lib/services/get-upcoming-events"
import { answerQuestionAboutEvents } from "@/ai/flows/answer-question-about-events"
import { scheduleEvent } from "@/ai/flows/schedule-events"
import { rescheduleEvent } from "@/ai/flows/reschedule-events"
import { findTime } from "@/ai/flows/find-time"
import { getProactiveSuggestion } from '@/ai/flows/proactive-suggestion';
import { scheduleGoal } from '@/ai/flows/goal-scheduling';

export default function ChatComponent() {
  const { accessToken, isConnected } = useCalendar()

  const { messages, input, handleInputChange, append, isLoading, error, setInput } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [hasWelcomed, setHasWelcomed] = useState(false)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input, messages])

  // Welcome messages
  useEffect(() => {
    if (!hasWelcomed && messages.length === 0) {
      setHasWelcomed(true)

      const welcomeMessages = [
        { content: "Hey, welcome 👋", delay: 1000 },
        { content: "What can I help you do today?", delay: 3000 },
        {
          content: "Ask me to schedule events, set reminders, or answer calendar-related questions.",
          delay: 5000,
        },
        {
          content: "Try typing: “Set a meeting tomorrow at 10am”",
          delay: 7000,
        },
      ]

      welcomeMessages.forEach(({ content, delay }) => {
        setTimeout(() => {
          append({ role: "assistant", content })
        }, delay)
      })
    }
  }, [messages, hasWelcomed, append])

  const handleCustomSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userMessage = input.trim()
    if (!userMessage) return

    // Append user message
    append({ role: "user", content: userMessage })
    setInput("")

    if (!isConnected || !accessToken) {
      append({
        role: "assistant",
        content: "Please connect your Google Calendar to get started. [Go to Integrations](/integrations)"
      })
      return
    }

    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    try {
      const { command } = await routeCommand({ message: userMessage })

      let aiResponse = "I’m sorry, I didn’t understand that. I can help schedule, reschedule, cancel, or answer questions about your events."

      switch (command) {
        case "schedule":
          const scheduled = await scheduleEvent({ description: userMessage, accessToken, userTimezone })
          aiResponse = scheduled.message
          break
        case "cancel":
          const cancelled = await cancelEvent({ command: userMessage, accessToken })
          aiResponse = cancelled.message
          break
        case "reschedule":
          const rescheduled = await rescheduleEvent({ command: userMessage, accessToken, userTimezone })
          aiResponse = rescheduled.message
          break
        case "view_events":
          const events = await getUpcomingEvents(accessToken)
          const answered = await answerQuestionAboutEvents({ question: userMessage, events: JSON.stringify(events, null, 2) })
          aiResponse = answered.answer
          break
        case "find_time": {
          const result = await findTime({ query: userMessage, accessToken, userTimezone });
          aiResponse = result.suggestions;
          break;
        }
        case "proactive_suggestion": {
          const result = await getProactiveSuggestion({ query: userMessage, accessToken, userTimezone });
          aiResponse = result.suggestion;
          break;
        }
        case "goal_scheduling": {
          const result = await scheduleGoal({ goal: userMessage, accessToken, userTimezone });
          aiResponse = result.plan;
          break;
        }
        case "chat":
          if (userMessage.toLowerCase().includes("hello") || userMessage.toLowerCase().includes("hi") || userMessage.toLowerCase().includes("hey")) {
            aiResponse = "Hello there! How can I assist you with your schedule today?"
          } else {
            aiResponse = "I can help with scheduling, rescheduling, and canceling events. What would you like to do?"
          }
          break
      }
      append({ role: "assistant", content: aiResponse })
    } catch (err) {
      console.error("Error handling message:", err)
      toast.error("Something went wrong: I had trouble processing your request. Please try again.")
      append({ role: "assistant", content: "Oops! Something went wrong. Try again later." })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Messages */}
      <div className="flex-grow p-4 overflow-hidden relative">
        <ScrollArea className="absolute inset-0 pr-4 pb-[100px]">
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-center">
              <p className="text-lg">Start a conversation with your AI Calendar Assistant!</p>
              <p className="text-sm mt-2">
                Ask me to schedule events, set reminders, or answer calendar-related questions.
              </p>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-3 rounded-lg ${
                      m.role === "user"
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                    }`}
                  >
                    {m.content.startsWith("Try typing:") ? (
                      <div className="px-4 py-2 bg-white text-neutral-900 rounded-full flex items-center gap-2 text-sm font-medium shadow border border-neutral-200">
                        <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
                        <span className="italic">{m.content}</span>
                      </div>
                    ) : (
                      <p className="text-sm">{m.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-3 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200">
                <p className="text-sm animate-pulse">HeyCal is thinking...</p>
              </div>
            </div>
          )}

          {error && <div className="text-red-500 text-sm mt-2">Error: {error.message}</div>}

          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-neutral-50 border-t border-neutral-200 flex justify-center">
        <form onSubmit={handleCustomSubmit} className="w-full max-w-2xl">
          <div className="relative flex flex-col rounded-lg border border-neutral-300 p-3 shadow-sm">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              placeholder={"Ask a follow-up..."}
              rows={1}
              className="min-h-[24px] resize-none overflow-hidden bg-transparent text-sm focus:outline-none disabled:cursor-not-allowed"
              disabled={isLoading}
              aria-label={"Type your message"}
            />
            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                disabled
                variant="ghost"
                size="icon"
                className="text-neutral-400 cursor-not-allowed"
              >
                <Mic className="w-5 h-5" />
                <span className="sr-only">Voice input (disabled)</span>
              </Button>
              <Button
                type="submit"
                disabled={isLoading || input.trim() === ""}
                size="icon"
                className="rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
              >
                <ArrowUp className="w-5 h-5" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
