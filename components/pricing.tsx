'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"

const individualFeatures = [
  "Unlimited scheduling",
  "AI-powered chat assistant",
  "Daily agenda summaries",
  "Reminders & notifications",
]

const enterpriseFeatures = [
  "Everything in Individual",
  "Team calendar syncing",
  "Admin controls & analytics",
  "Priority support & SLAs",
]

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)

  return (
    <section className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">
          Simple Pricing, Built for Clarity
        </h2>
        <p className="text-gray-600 mb-8">
          Start 14-day trial with no billing, upgrade when you&apos;re ready. One price for peace of mind — no complexity.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="text-sm text-gray-500">Monthly</span>
          <Switch checked={yearly} onCheckedChange={setYearly} />
          <span className="text-sm text-gray-500">Yearly <span className="text-green-600 font-medium">(Save 20%)</span></span>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Individual Plan */}
          <div className="relative bg-black text-white p-8 rounded-xl shadow-md border-2 border-black">
            <div className="absolute -top-4 left-4 bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow-sm">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold mb-2">Individual</h3>
            <p className="text-sm text-gray-200 mb-6">For personal productivity and calm scheduling.</p>
            <div className="text-4xl font-bold mb-2">
              {yearly ? "$8" : "$10"}
              <span className="text-base font-normal text-gray-300"> /mo</span>
            </div>
            <p className="text-xs text-gray-400 mb-6">{yearly ? "Billed $96 yearly" : "Billed monthly"}</p>
            <ul className="space-y-3 mb-6 text-sm">
              {individualFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="secondary" className="bg-white text-black hover:bg-gray-100 w-full">
              Start with Individual
            </Button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white text-black p-8 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
            <p className="text-sm text-gray-600 mb-6">For teams and organizations that need more control.</p>
            <div className="text-4xl font-bold mb-2">
              {yearly ? "$24" : "$30"}
              <span className="text-base font-normal text-gray-500"> /mo</span>
            </div>
            <p className="text-xs text-gray-500 mb-6">{yearly ? "Billed $288 yearly" : "Billed monthly"}</p>
            <ul className="space-y-3 mb-6 text-sm">
              {enterpriseFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-600" />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="w-full">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}