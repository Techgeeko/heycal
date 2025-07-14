'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, MessageSquare, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LiveSupport() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{ text: "Hi! How can we help you today?", sender: "bot" }])
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  const sendMessage = () => {
    if (!input.trim()) return
    setMessages([...messages, { text: input, sender: "user" }])
    setInput("")

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Thanks for reaching out! We'll get back to you shortly.", sender: "bot" }
      ])
    }, 1000)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open ? (
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full p-3 shadow-lg"
          variant="default"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
      ) : (
        <div className="w-80 bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
            <h4 className="font-medium text-sm">Live Support</h4>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 px-4 py-3 space-y-2 overflow-y-auto max-h-60">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "text-sm px-3 py-2 rounded-lg max-w-[80%]",
                  msg.sender === "user"
                    ? "bg-black text-white ml-auto"
                    : "bg-gray-100 text-gray-800"
                )}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2 bg-white">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              className="text-sm"
            />
            <Button size="icon" onClick={sendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}