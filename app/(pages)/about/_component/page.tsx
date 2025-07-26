'use client'

import { motion } from "framer-motion"
import Content  from '../content.mdx'
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
        <h1 className="text-2xl font-semibold mb-8 text-center">About HeyCal</h1>
        <Content />
    </motion.section>
  )
}