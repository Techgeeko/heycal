import Link from "next/link"
import { Facebook, Twitter, Linkedin, Github } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20">
      
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and About */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <Image
                src="/assets/heycal.svg"
                alt="HeyCal logo"
                width={40}
                height={40}
                className="h-8 w-auto"
                />
            <span className="text-lg font-medium text-black">HeyCal</span>
          </div>
          <p className="text-sm text-gray-600 max-w-xs">
            HeyCal helps you take control of your time by simply chatting with your calendar.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="/terms" className="hover:text-black">Terms</Link></li>
            <li><Link href="/privacy" className="hover:text-black">Privacy Policy</Link></li>
            <li><Link href="/about" className="hover:text-black">About</Link></li>
            <li><Link href="/support" className="hover:text-black">Support</Link></li>
          </ul>
        </div>

        {/* Newsletter or CTA */}
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-4">Stay Connected</h4>
          <p className="text-sm text-gray-600 mb-4">
            Get updates and productivity tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Input type="email" placeholder="you@example.com" className="w-full sm:w-auto" />
            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>

      {/* Subfooter */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4 text-gray-500">
            <a href="#" className="hover:text-black"><Facebook size={18} /></a>
            <a href="#" className="hover:text-black"><Twitter size={18} /></a>
            <a href="#" className="hover:text-black"><Linkedin size={18} /></a>
            <a href="#" className="hover:text-black"><Github size={18} /></a>
          </div>
          <p className="text-sm text-gray-500">
            Built by <a href="https://yourwebsite.com" className="text-black font-medium hover:underline">Micheal Agulonye</a>
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} HeyCal. All rights reserved.
        </div>
      </div>
    </footer>
  )
}