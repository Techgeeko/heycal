"use client"

import { motion } from "framer-motion"
import Content from "./content.mdx"
import Image from "next/image"
import { Lightbulb, Zap, User } from "lucide-react"
import Breadcrumb from "@/components/breadcrumb"

export default function AboutUsPage() {
  const breadcrumbItems = [{ label: "About Us", href: "/about" }]

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-20 px-4 max-w-5xl mx-auto min-h-screen bg-white text-black"
    >
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="text-4xl font-bold mb-8 text-center">About HeyCal</h1>
      <Content />

      {/* Problem Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-16 p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-center mb-6">
          <Lightbulb className="w-10 h-10 text-gray-700" />
        </div>
        <h2 className="text-3xl font-semibold mb-4 text-center">The Problem: Overwhelm & Complexity</h2>
        <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          In a world full of digital tools, managing your schedule and tasks has become paradoxically complex. We're
          drowning in tabs, struggling with rigid interfaces, and constantly switching between apps just to keep track
          of our day. This complexity leads to anxiety, missed deadlines, and a feeling of being constantly behind. Your
          calendar should be a source of calm, not chaos.
        </p>
      </motion.div>

      {/* Solution Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-16 p-8 bg-white rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-center mb-6">
          <Zap className="w-10 h-10 text-black" />
        </div>
        <h2 className="text-3xl font-semibold mb-4 text-center">Our Solution: Intuitive, AI-Powered Calm</h2>
        <p className="text-gray-700 text-lg leading-relaxed text-center max-w-3xl mx-auto">
          HeyCal was born from the frustration of over-engineered productivity tools. We believe managing your time
          should be as natural as texting a friend. Our AI-powered chat assistant understands your natural language,
          instantly adding events and tasks without rigid forms. It's designed to be your calm, smart assistant, keeping
          you in flow and ensuring you never forget what matters.
        </p>
      </motion.div>

      {/* Founder Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="p-8 bg-gray-50 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center justify-center mb-6">
          <User className="w-10 h-10 text-gray-700" />
        </div>
        <h2 className="text-3xl font-semibold mb-8 text-center">Meet the Founder</h2>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 max-w-3xl mx-auto">
          <div className="flex-shrink-0">
            <Image
              src="/placeholder.svg?height=160&width=160"
              alt="Founder Name"
              width={160}
              height={160}
              className="rounded-full border-4 border-gray-200 shadow-md"
            />
          </div>
          <div className="text-left md:text-left">
            <h3 className="text-2xl font-bold text-black mb-2">Alex Johnson</h3>
            <p className="text-gray-600 text-lg mb-4">CEO & Founder of HeyCal</p>
            <p className="text-gray-700 leading-relaxed">
              Alex, a seasoned software engineer and a busy parent, constantly found himself overwhelmed by the myriad
              of tools needed to manage his professional and personal life. He envisioned a simpler, more human-centric
              approach to productivity. With HeyCal, he aims to bring peace of mind back to daily scheduling, allowing
              everyone to focus on what truly matters without the digital clutter.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}