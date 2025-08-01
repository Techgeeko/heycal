'use client'

import { motion } from "framer-motion"
import Breadcrumb from "@/components/breadcrumb"
import Content from "../content.mdx"

export default function PrivacyPolicyPage() {
  const breadcrumbItems = [{ label: "Privacy Policy", href: "/privacy" }]

  return (
    <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="py-20 px-4 max-w-4xl mx-auto min-h-screen bg-white text-black"
    >
        <Breadcrumb items={breadcrumbItems} />
        <h1 className="text-2xl font-semibold mb-8 text-center">Privacy Policy</h1>
        <div className="space-y-8 text-gray-800 leading-relaxed">
        <Content />
        </div>
    </motion.section>
  )
}