'use client'

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Send } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export default function Hero() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! What would you like to schedule?" }
  ])
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (!input.trim()) return
    setMessages([...messages, { sender: "user", text: input }])
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: input.toLowerCase().includes("meeting")
            ? "✅ Your meeting has been added to the calendar."
            : "Got it! I’ve scheduled that for you."
        }
      ])
    }, 800)
    setInput("")
  }

  return (
    <section className="w-full bg-white pt-28 pb-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-16">
        
        {/* Left Content */}
        <div className="max-w-xl space-y-6 text-center md:text-left relative">
          <div className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-sm border border-gray-200 mb-2">
            New – Chat-based Scheduling
          </div>

          <h1 className="text-4xl sm:text-5xl font-semibold text-black leading-tight">
            Organize your day <br className="hidden sm:block" /> by simply chatting
          </h1>

          <p className="text-base text-gray-600">
            HeyCal helps you manage tasks and events with natural conversation — no complex setup, just type what you need.
          </p>

          {/* User avatars + trust */}
          <div className="flex items-center gap-4 mt-6">
            <div className="flex -space-x-3">
              <Image src="https://i.pravatar.cc/40?img=11" alt="User 1" width={36} height={36} className="rounded-full border-2 border-white" />
              <Image src="https://i.pravatar.cc/40?img=22" alt="User 2" width={36} height={36} className="rounded-full border-2 border-white" />
              <Image src="https://i.pravatar.cc/40?img=33" alt="User 3" width={36} height={36} className="rounded-full border-2 border-white" />
            </div>
            <span className="text-sm text-gray-500">
              0 users currently using HeyCal
            </span>
          </div>

          {/* CTA */}
          <Link href="/sign-up" passHref>
            <Button asChild className="mt-6 text-base px-6 py-2"><p>Start Talking to Your Calendar</p></Button>
          </Link>
        </div>

        {/* Interactive Demo Card */}
        <Card className="w-full md:w-[500px] relative overflow-hidden border shadow-sm">
            <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute top-3 left-3 z-10 text-xs bg-white border border-gray-200 px-2 py-1 rounded-sm shadow-sm text-gray-500 hover:animate-pulse transition"
            >
            Interactive Demo
            </motion.div>

            <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-3 right-3 z-10 text-xs bg-black text-white px-2 py-1 rounded-sm shadow-sm hover:animate-bounce transition"
            >
            Simulated Chat
            </motion.div>


          <CardHeader className="text-sm text-gray-500 font-medium">
            Try HeyCal
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {/* Messages */}
            <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`max-w-[80%] px-3 py-2 rounded-md text-sm ${
                    msg.sender === "bot"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-black text-white ml-auto"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick reply chips */}
            <div className="flex flex-wrap gap-2">
            {["Schedule meeting", "Add task tomorrow", "Cancel 2pm call"].map((text, idx) => (
                <button
                key={idx}
                onClick={() => setInput(text)}
                className="text-xs px-3 py-1 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                >
                {text}
                </button>
            ))}
            </div>

            {/* Input + send */}
            <div className="flex gap-2 pt-2 border-t">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="e.g. Schedule call at 3pm"
                className="text-sm"
              />
              <Button onClick={handleSend} size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}