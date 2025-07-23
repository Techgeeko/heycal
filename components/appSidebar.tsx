'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';
import { History, Plug2, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navigationItems: NavigationItem[] = [
  { name: 'Chat', href: '/chat', icon: <MessageCircle className="h-5 w-5 mr-3" /> },
  { name: 'Recent Activities', href: '/recent-activities', icon: <History className="h-5 w-5 mr-3" /> },
  { name: 'Integrations', href: '/integrations', icon: <Plug2 className="h-5 w-5 mr-3" /> },
];

export default function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/chat' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden lg:flex w-64 min-h-screen fixed top-0 left-0 z-40 flex-col bg-white border-r border-gray-200 overflow-x-hidden">
      {/* Top */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/assets/heycal.svg" alt="HeyCal logo" width={40} height={40} className="h-8 w-auto" />
          <span className="text-lg font-medium text-black">HeyCal</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-6 scrollbar-thin scrollbar-thumb-stone-800">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              isActive(item.href)
                ? 'bg-gradient-to-r from-stone-800 to-stone-900 text-stone-50 shadow-inner shadow-black/30'
                : 'hover:bg-stone-800/60 text-stone-400'
            }`}
          >
            {item.icon}
            <span className="flex-1 text-sm">{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}