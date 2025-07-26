"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, Sparkles, Users } from "lucide-react"

const individualFeatures = [
  "AI-powered chat assistant",
  "1 Calendar integration",
  "Unlimited scheduling",
  "Reminders & notifications",
  "Daily agenda summaries",
  "Chat history log",
  "Basic analytics",
  "Solo access",
  "Email support",
]

const enterpriseFeatures = [
  "Unlimited Everything in Individual",
  "Team calendar syncing",
  "Admin controls & analytics",
  "Priority support & SLAs",
]

export default function PricingSection() {
  const [yearly, setYearly] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)

  return (
    <section id="pricing" className="bg-gradient-to-b from-gray-50 to-white py-20 border-t border-gray-100 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl sm:text-4xl font-semibold text-black mb-4">Simple Pricing, Built for Clarity</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Start 14-day trial with no billing, upgrade when you&apos;re ready. One price for peace of mind — no complexity.
          </p>
        </motion.div>

        {/* Enhanced Toggle */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white rounded-full p-1 shadow-lg border border-gray-200">
            <div className="flex items-center gap-4 px-4 py-2">
              <span className={`text-sm font-medium transition-colors ${!yearly ? "text-black" : "text-gray-500"}`}>
                Monthly
              </span>
              <Switch checked={yearly} onCheckedChange={setYearly} className="data-[state=checked]:bg-black" />
              <span className={`text-sm font-medium transition-colors ${yearly ? "text-black" : "text-gray-500"}`}>
                Yearly
              </span>
              {yearly && (
                <motion.span
                  className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                >
                  Save 20%
                </motion.span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Plan - Featured */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onHoverStart={() => setHoveredPlan("individual")}
            onHoverEnd={() => setHoveredPlan(null)}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 to-black rounded-2xl opacity-75"></div>
            <div className="relative bg-black text-white p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105">
              {/* Popular Badge */}
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-black text-sm font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
                animate={{ y: hoveredPlan === "individual" ? -2 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles className="w-4 h-4" />
                Most Popular
              </motion.div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold">Individual</h3>
                  <p className="text-gray-300 text-sm">Perfect for personal productivity</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold">{yearly ? "$8" : "$10"}</span>
                  <span className="text-gray-300 text-lg">/month</span>
                </div>
                <p className="text-gray-400 text-sm mt-1">{yearly ? "Billed $96 yearly" : "Billed monthly"}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {individualFeatures.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                  >
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button
                className="w-full bg-white text-black hover:bg-gray-100 font-semibold py-3 text-base transition-all duration-200 hover:shadow-lg"
                size="lg"
              >
                Start with Individual
              </Button>
            </div>
          </motion.div>

          {/* Enterprise Plan */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onHoverStart={() => setHoveredPlan("enterprise")}
            onHoverEnd={() => setHoveredPlan(null)}
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-700" />
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-black">Enterprise</h3>
                  <p className="text-gray-600 text-sm">Built for teams and organizations</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-black">{yearly ? "$24" : "$30"}</span>
                  <span className="text-gray-500 text-lg">/month</span>
                </div>
                <p className="text-gray-500 text-sm mt-1">{yearly ? "Billed $288 yearly" : "Billed monthly"}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {enterpriseFeatures.map((feature, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-3 text-sm text-gray-700"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
                  >
                    <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-gray-600" />
                    </div>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button
                variant="outline"
                className="w-full border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white font-semibold py-3 text-base transition-all duration-200 bg-transparent"
                size="lg"
              >
                Contact Sales
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          className="mt-16 pt-8 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="text-gray-500 text-sm mb-4">Trusted by thousands of professionals</p>
          <div className="flex items-center justify-center gap-8 text-gray-400 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>No setup fees</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
