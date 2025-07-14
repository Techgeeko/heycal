"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const featureFlows = [
  {
    title: "Talk, Don't Type",
    content:
      "HeyCal lets you plan your day like texting a friend. No rigid forms, no stress. Just type, 'Lunch with Sarah at 2pm' — it's added instantly.",
    image: "/placeholder.svg?height=360&width=600",
  },
  {
    title: "Let Go of the Overwhelm",
    content:
      "Most tools leave you more exhausted than empowered. HeyCal calms the chaos by giving you a human-first way to organize — without the interface stress.",
    image: "/placeholder.svg?height=360&width=600",
  },
  {
    title: "Reminders That Remember for You",
    content:
      "HeyCal doesn't just store your tasks — it keeps them active. You'll never forget what matters again, even when your brain does.",
    image: "/placeholder.svg?height=360&width=600",
  },
  {
    title: "From Frantic to Flow",
    content:
      "Use HeyCal for a week and you'll feel the difference: clear mind, better focus, and peace knowing everything is handled — in one place.",
    image: "/placeholder.svg?height=360&width=600",
  },
]

export default function FeatureFlowSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate read time based on content length (average 200 words per minute)
  const getReadTime = (content: string) => {
    const wordCount = content.split(" ").length
    const readTimeSeconds = Math.max(4, (wordCount / 200) * 60) // Minimum 4 seconds
    return readTimeSeconds * 1000 // Convert to milliseconds
  }

  const currentReadTime = getReadTime(featureFlows[activeIndex].content)

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % featureFlows.length)
    setProgress(0)
  }

  const handleManualSelect = (index: number) => {
    setActiveIndex(index)
    setProgress(0)
  }

  // Auto-progression logic
  useEffect(() => {
    if (isPaused) return

    // Clear existing timers
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)

    // Reset progress
    setProgress(0)

    // Progress bar animation
    const progressInterval = 50 // Update every 50ms
    const totalSteps = currentReadTime / progressInterval
    let currentStep = 0

    progressRef.current = setInterval(() => {
      currentStep++
      setProgress((currentStep / totalSteps) * 100)

      if (currentStep >= totalSteps) {
        if (progressRef.current) clearInterval(progressRef.current)
      }
    }, progressInterval)

    // Auto advance timer
    timerRef.current = setTimeout(goToNext, currentReadTime)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [activeIndex, isPaused, currentReadTime])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  return (
    <section
      className="py-16 px-4 max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">A Flow You Can Feel</h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Every part of HeyCal is designed to ease anxiety, guide your flow, and make productivity feel natural.
        </p>
      </div>

      <div className="relative grid md:grid-cols-[280px_1fr] gap-8">
        {/* Titles Column with connecting line */}
        <div className="relative space-y-6">
          <div className="absolute left-[9px] top-0 h-full w-px bg-gray-200 z-0" />
          {featureFlows.map((flow, i) => (
            <button
              key={i}
              onClick={() => handleManualSelect(i)}
              className={`relative z-10 text-left group pl-6 transition ${
                activeIndex === i ? "text-black font-semibold" : "text-gray-500 hover:text-black"
              }`}
            >
              <div
                className={`absolute left-0 top-1 w-3 h-3 rounded-full border-2 ${
                  activeIndex === i ? "bg-black border-black" : "bg-white border-gray-300 group-hover:border-black"
                } transition overflow-hidden`}
              >
                {activeIndex === i && (
                  <div
                    className="absolute inset-0 bg-gray-300 rounded-full origin-center"
                    style={{
                      transform: `scale(${progress / 100})`,
                      transition: isPaused ? "none" : "transform 0.05s linear",
                    }}
                  />
                )}
              </div>
              {flow.title}
            </button>
          ))}
        </div>

        {/* Active Flow Content */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Image
                src={featureFlows[activeIndex].image || "/placeholder.svg"}
                alt={featureFlows[activeIndex].title}
                width={600}
                height={360}
                className="rounded-xl w-full h-auto border"
              />
              <h3 className="text-xl font-semibold text-black">{featureFlows[activeIndex].title}</h3>
              <p className="text-gray-600 text-base max-w-prose">{featureFlows[activeIndex].content}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <div className="flex items-center justify-center mt-8 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2 h-2 rounded-full bg-gray-300">
            <div
              className="h-full bg-black rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{isPaused ? "Paused" : "Auto-advancing"}</span>
        </div>
        <button onClick={() => setIsPaused(!isPaused)} className="text-sm text-gray-500 hover:text-black transition">
          {isPaused ? "Resume" : "Pause"}
        </button>
      </div>
    </section>
  )
}