"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

const testimonials = [
  {
    name: "Fatima A.",
    handle: "@fatima_builds",
    role: "Startup Founder",
    image: "https://i.pravatar.cc/150?img=47",
    quote:
      "HeyCal genuinely feels like having a calm assistant. I stopped dreading my calendar and started feeling in control again.",
    likes: 247,
    retweets: 89,
    verified: true,
  },
  {
    name: "Tunde O.",
    handle: "@tunde_codes",
    role: "Remote Developer",
    image: "https://i.pravatar.cc/150?img=33",
    quote:
      "I've tried Notion, Todoist, Google Calendar — but none matched the simplicity of just chatting my tasks in. This is different.",
    likes: 156,
    retweets: 43,
    verified: false,
  },
  {
    name: "Emily N.",
    handle: "@emily_designs",
    role: "Busy Mom & Designer",
    image: "https://i.pravatar.cc/150?img=56",
    quote:
      "I used to forget school events and appointments all the time. Now I just text HeyCal and it handles the rest. Magic.",
    likes: 312,
    retweets: 127,
    verified: true,
  },
]

const FloatingDot = ({ delay }: { delay: number }) => (
  <motion.div
    className="absolute w-1 h-1 bg-gray-300 rounded-full"
    initial={{ y: 100, opacity: 0 }}
    animate={{
      y: -100,
      opacity: [0, 0.3, 0],
      x: [0, 10, -10, 0],
    }}
    transition={{
      duration: 6,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
    style={{
      left: `${Math.random() * 100}%`,
    }}
  />
)

export default function TestimonialSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (isHovered) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isHovered])

  return (
    <section className="relative bg-gray-50 py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.01),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.01),transparent_60%)]" />

        {/* Subtle Floating Dots */}
        {Array.from({ length: 6 }).map((_, i) => (
          <FloatingDot key={i} delay={i * 1} />
        ))}
      </div>

      <div id="testimonials" className="relative max-w-6xl mx-auto px-4 text-center scroll-mt-20">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">Loved by Everyday Humans</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg">
            Whether you&apos;re juggling work, school, family or all three — people choose HeyCal because it works the way
            their brain works.
          </p>
        </motion.div>

        {/* Main Featured Testimonial */}
        <div
          className="relative mb-12"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative max-w-2xl mx-auto"
            >
              <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {/* X/Twitter Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <Image
                      src={testimonials[activeIndex].image || "/placeholder.svg"}
                      alt={testimonials[activeIndex].name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <motion.div
                      className="absolute -inset-0.5 rounded-full border border-gray-200"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <h3 className="text-black font-semibold">{testimonials[activeIndex].name}</h3>
                      {testimonials[activeIndex].verified && (
                        <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">
                      {testimonials[activeIndex].handle} • {testimonials[activeIndex].role}
                    </p>
                  </div>
                  <div className="text-gray-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                </div>

                {/* Quote */}
                <motion.p
                  className="text-gray-800 text-lg leading-relaxed mb-6 text-left"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  "{testimonials[activeIndex].quote}"
                </motion.p>

                {/* Engagement Stats */}
                <div className="flex items-center gap-6 text-gray-500 text-sm">
                  <div className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{testimonials[activeIndex].likes}</span>
                  </div>
                  <div className="flex items-center gap-2 hover:text-gray-700 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    <span>{testimonials[activeIndex].retweets}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-black w-8" : "bg-gray-300 w-2 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secondary Testimonials Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-md transition-all duration-300 cursor-pointer group"
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => setActiveIndex(i)}
            >
              <div className="flex items-center gap-3 mb-4">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={testimonial.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                <div className="text-left">
                  <p className="text-black text-sm font-medium">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs">{testimonial.handle}</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm text-left line-clamp-3">"{testimonial.quote}"</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative"
        >
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
            <h4 className="text-2xl font-bold text-black mb-2">Join thousands who&apos;ve simplified their day</h4>
            <p className="text-gray-600 max-w-xl mx-auto mb-6">
              Stop wrestling with tabs, tools, and planners. HeyCal brings it all into one calm, smart chat.
            </p>
            <motion.button
              className="bg-black text-white text-lg px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Using HeyCal — It&apos;s Free
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}