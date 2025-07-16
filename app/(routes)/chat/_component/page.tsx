"use client"

import type React from "react"
import { useChat } from "ai/react"
import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sparkles, Mic, History, ArrowUp } from "lucide-react"

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) // Ref for the textarea

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Effect to auto-resize textarea and scroll to bottom
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto" // Reset height to recalculate
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px` // Set to scroll height
    }
    scrollToBottom()
  }, [input, messages]) // Re-run when input or messages change

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Prevent default form submission
    handleSubmit(e)
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900">
      {/* Header for the title and recent activities button */}
      <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-neutral-600" />
          AI Calendar Assistant
        </h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="View recent activities"
              className="text-neutral-600 hover:bg-neutral-100"
            >
              <History className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-sm bg-neutral-50 text-neutral-900 border-l border-neutral-200"
          >
            <SheetHeader className="border-b border-neutral-200 pb-4 mb-4">
              <SheetTitle className="text-xl font-semibold">Recent Activities</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] pr-4">
              <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                <li>Scheduled &apos;Team Sync&apos; for tomorrow at 10 AM.</li>
                <li>Set reminder for &apos;Project Deadline&apos; on Friday.</li>
                <li>Checked availability for &apos;Client Meeting&apos; next week.</li>
                <li>Created &apos;Birthday Party&apos; event for John on 2025-07-25.</li>
                <li>Rescheduled &apos;Dentist Appointment&apos; to next Monday.</li>
                <li>Added &apos;Grocery Shopping&apos; to Saturday&apos;s to-do list.</li>
                <li>Confirmed &apos;Flight to NYC&apos; details for next month.</li>
                <li>Searched for &apos;Yoga classes&apos; on Tuesday evenings.</li>
                <li>Updated &apos;Gym Session&apos; to 6 PM daily.</li>
                <li>Deleted &apos;Old Project Review&apos; meeting.</li>
                <li>Scheduled &apos;Team Sync&apos; for tomorrow at 10 AM.</li>
                <li>Set reminder for &apos;Project Deadline&apos; on Friday.</li>
                <li>Checked availability for &apos;Client Meeting&apos; next week.</li>
                <li>Created &apos;Birthday Party&apos; event for John on 2025-07-25.</li>
                <li>Rescheduled &apos;Dentist Appointment&apos; to next Monday.</li>
                <li>Added &apos;Grocery Shopping&apos; to Saturday&apos;s to-do list.</li>
                <li>Confirmed &apos;Flight to NYC&apos; details for next month.</li>
                <li>Searched for &apos;Yoga classes&apos; on Tuesday evenings.</li>
                <li>Updated &apos;Gym Session&apos; to 6 PM daily.</li>
                <li>Deleted &apos;Old Project Review&apos; meeting.</li>
              </ul>
              <p className="text-xs mt-4 text-neutral-500">
                {"This is a placeholder for your recent calendar activities."}
              </p>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main chat content area */}
      <div className="flex-grow p-4 overflow-hidden relative">
        <ScrollArea className="absolute inset-0 pr-4 pb-[100px]">
          {" "}
          {/* Adjusted pb to accommodate new input height */}
          {messages.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 text-center">
              <p className="text-lg">Start a conversation with your AI Calendar Assistant!</p>
              <p className="text-sm mt-2">
                Ask me to schedule events, set reminders, or answer calendar-related questions.
              </p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`p-3 rounded-lg ${
                    m.role === "user"
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-900 border border-neutral-200"
                  }`}
                >
                  <p className="text-sm">{m.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-3 rounded-lg bg-neutral-100 text-neutral-900 border border-neutral-200">
                <p className="text-sm animate-pulse">AI is thinking...</p>
              </div>
            </div>
          )}
          {error && <div className="text-red-500 text-sm mt-2">Error: {error.message}</div>}
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>

      {/* Fixed input at the bottom, now a single component */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-neutral-50 border-t border-neutral-200 flex justify-center">
        <form onSubmit={onSubmit} className="w-full max-w-2xl">
          <div className={`relative flex flex-col rounded-lg border border-neutral-300 p-3 shadow-sm`}>
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
              {/* Left side: Voice button - permanently disabled */}
              <Button
                type="button"
                onClick={() => {}} // No operation on click
                disabled={true} // Always disabled
                variant="ghost"
                size="icon"
                className={`text-neutral-400 cursor-not-allowed`} // Greyed out and no hover
                aria-label={"Voice input (disabled)"}
              >
                <Mic className="w-5 h-5" />
                <span className="sr-only">Voice input (disabled)</span>
              </Button>

              {/* Right side: Send button */}
              <Button
                type="submit"
                disabled={isLoading || input.trim() === ""} // Disable if loading or input is empty
                size="icon"
                className="rounded-md bg-neutral-900 text-white hover:bg-neutral-800"
                aria-label="Send message"
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