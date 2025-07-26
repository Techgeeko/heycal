'use client'

import { Button } from "@/components/ui/button"

export default function FinalCtaSection() {
  return (
    <section className="bg-black text-white py-24 text-center">
      <div className="max-w-2xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          Your calendar doesn’t need to be overwhelming
        </h2>
        <p className="text-gray-300 text-base sm:text-lg mb-8">
          HeyCal helps you take back control — one message at a time. 
          No clutter, no chaos, just calm productivity you can chat with.
        </p>
        <Button size="lg" className="text-base px-6 py-3">
          Get Started Free — Try HeyCal Now
        </Button>
      </div>
    </section>
  )
}
