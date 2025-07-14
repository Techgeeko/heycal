'use client'

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Natural Conversations",
    desc: "Tell HeyCal what you need in plain English — no rigid commands or dropdowns. Just type like you're talking to a friend.",
  },
  {
    title: "Instant Scheduling",
    desc: "From setting up meetings to reminding you to drink water, HeyCal adds things to your day in seconds — so nothing slips.",
  },
  {
    title: "Your Brain, Outsourced",
    desc: "Forget the fear of forgetting. HeyCal thinks ahead, reminds you, and helps you prioritize — even when your brain feels foggy.",
  },
  {
    title: "Built for the Overwhelmed",
    desc: "No dashboards. No decision paralysis. Just clarity — one calming chat at a time.",
  },
]

export default function Features() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        
        {/* Story-Led Intro */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
          From Calendar Chaos to Clear Conversations
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
          Ever stared at your calendar and felt more overwhelmed than organized? You&apos;re not alone. 
          Most tools assume you&apos;re already in control — but HeyCal meets you where you are: busy, distracted, 
          and human.
        </p>

        {/* Features List */}
        <div className="grid md:grid-cols-2 gap-10 text-left">
          {features.map((feat, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-black w-5 h-5 mt-1" />
                <div>
                  <h3 className="text-lg font-medium text-black">{feat.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feat.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="mt-16">
          <h4 className="text-xl font-semibold text-black mb-2">Still doubting?</h4>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            You&apos;re not lazy. You&apos;re just overloaded. HeyCal exists so your calendar works with you — 
            not against you. Give it one minute. Say hi, and see the difference.
          </p>
          <Button className="px-6 py-3 text-base">Start Using HeyCal Now</Button>
        </div>
      </div>
    </section>
  )
}