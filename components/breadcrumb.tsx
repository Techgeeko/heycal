"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
          <Link href="/" className="hover:text-black transition-colors">
            Home
          </Link>
        </motion.li>
        {items.map((item, index) => (
          <motion.li
            key={item.href}
            className="flex items-center"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
          >
            <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
            {index === items.length - 1 ? (
              <span className="font-medium text-black">{item.label}</span>
            ) : (
              <Link href={item.href} className="hover:text-black transition-colors">
                {item.label}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  )
}
