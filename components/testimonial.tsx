'use client'

import Image from "next/image"

const testimonials = [
  {
    name: "Fatima A.",
    role: "Startup Founder",
    image: "https://i.pravatar.cc/150?img=47",
    quote:
      "HeyCal genuinely feels like having a calm assistant. I stopped dreading my calendar and started feeling in control again.",
  },
  {
    name: "Tunde O.",
    role: "Remote Developer",
    image: "https://i.pravatar.cc/150?img=33",
    quote:
      "I’ve tried Notion, Todoist, Google Calendar — but none matched the simplicity of just chatting my tasks in. This is different.",
  },
  {
    name: "Emily N.",
    role: "Busy Mom & Designer",
    image: "https://i.pravatar.cc/150?img=56",
    quote:
      "I used to forget school events and appointments all the time. Now I just text HeyCal and it handles the rest. Magic.",
  },
]

export default function TestimonialSection() {
  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
          Loved by Everyday Humans
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-12">
          Whether you're juggling work, school, family or all three — people choose HeyCal because it works the way their brain works.
        </p>

        <div className="grid md:grid-cols-3 gap-8 text-left">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-700 italic mb-4">“{t.quote}”</p>
              <div className="flex items-center gap-3">
                <Image
                  src={t.image}
                  alt={t.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-black">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Reinforce CTA below */}
        <div className="mt-16">
          <h4 className="text-xl font-semibold text-black mb-2">Join thousands who’ve simplified their day</h4>
          <p className="text-gray-600 max-w-xl mx-auto mb-6">
            Stop wrestling with tabs, tools, and planners. HeyCal brings it all into one calm, smart chat.
          </p>
          <button className="bg-black text-white text-base px-6 py-3 rounded-md hover:bg-gray-800 transition">
            Start Using HeyCal — It’s Free
          </button>
        </div>
      </div>
    </section>
  )
}
