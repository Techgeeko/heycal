'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Image from 'next/image';
import { History, Plug2, MessageCircle } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface UserProfile {
  initials: string;
  name: string;
  email: string;
}

const navigationItems: NavigationItem[] = [
  { name: 'Chat', href: '/chat', icon: <MessageCircle className="h-5 w-5 mr-3" /> },
  { name: 'Recent Activities', href: '/recent-activities', icon: <History className="h-5 w-5 mr-3" /> },
  // { name: 'Sync Manager', href: '/sync-manager', icon: <CalendarSync className="h-5 w-5 mr-3" /> },
  { name: 'Integrations', href: '/integrations', icon: <Plug2 className="h-5 w-5 mr-3" /> },
  // { name: 'Settings', href: '/settings', icon: <Settings2 className="h-5 w-5 mr-3" /> },
];

const userProfile: UserProfile = {
  initials: 'MA',
  name: 'Micheal Agulonye',
  email: 'calsyncai@gmail.com'
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  const handleInvite = async () => {
    try {
      await navigator.clipboard.writeText('https://heycal.app/invite');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy invite link', err);
    }
  };

  const isActive = (href: string) => {
    if (href === '/chat' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 min-h-screen fixed top-0 left-0 z-40 hidden md:flex flex-col bg-white border-r border-gray-200 overflow-x-hidden">
      {/* App Logo */}
      <div className="p-4 border-b border-gray-200">
        <Link href="/" className="cursor-pointer">
          <div className="flex items-center space-x-1">
            <div className="w-8 h-2 flex items-center justify-center">
              <Image src="/assets/heycal.svg" alt="Icon" width={22} height={10} />
            </div>
            <span className="text-sm font-bold text-gray-900">HeyCal</span>
          </div>
        </Link>
      </div>

      {/* Main Sidebar Content */}
      <div className="flex-1 flex flex-col">
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-2 space-y-1">
            {navigationItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md group transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-blue-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.icon}
                  <span className="truncate">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs ${
                      active
                        ? 'bg-blue-100 text-indigo-800'
                        : 'bg-gray-200 text-gray-600'
                    }`}>{item.badge}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Invite Card */}
          <div className="px-2 mt-4">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
              <CardHeader className="pb-2 space-y-1">
                <CardTitle className="text-sm font-medium text-indigo-800">
                  Invite Your Team
                </CardTitle>
                <CardDescription className="text-indigo-600/80 text-xs">
                  Boost productivity together with CalSync
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={handleInvite}
                  variant="default"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {copied ? 'Copied!' : 'Copy Invite Link'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-indigo-600 font-medium">
              {userProfile.initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-gray-900 truncate">
                {userProfile.name}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {userProfile.email}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}