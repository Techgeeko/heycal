'use client'

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import type React from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { XIcon } from "lucide-react"
import AppSidebar from "@/components/appSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { CalendarProvider } from "@/components/calendar-provider"

// Logic to display active page but not repeat duplicate page for dashboard
const formatPageName = (path: string) => {
  if (path === '/') return "Home";

  const parts = path.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1];
  // Capitalize the first letter
  return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
};

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const pageName = formatPageName(pathname)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [mounted, setMounted] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  interface NavLink {
    href: string,
    label: string,
  }

  const isActive = (href: string): boolean => pathname === href;

  const navLinks: NavLink[] = [
    { 
      href: "/chat", 
      label: "Chat",
    },
    {
      href: "/integrations",
      label: "Integrations",
    },
    {
      href: "recent-activities",
      label: "Recent Activities",
    },
    {
      href: "/sync-manager",
      label: "sync Manager"
    }
  ]
  
    useEffect(() => {
      const dark = localStorage.theme === 'dark' || (
        !('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
      handleThemeChange(dark);
    }, []);
  
    const handleThemeChange = (dark: boolean) => {
      const root = document.documentElement;
      if (dark) {
        root.classList.add('dark');
        localStorage.theme = 'dark';
        setIsDarkMode(true);
      } else {
        root.classList.remove('dark');
        localStorage.theme = 'light';
        setIsDarkMode(false);
      }
    };
  

  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768) // 768px is the md breakpoint
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    handleResize() // Initial check
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // const toggleTheme = () => setTheme(isDarkMode ? 'light' : 'dark');

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <AppSidebar />
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Content Section */}
      <div className={`flex-1 flex flex-col min-h-screen transition-[padding] duration-300 ease-in-out ${
        isMobile ? 'pl-0' : 'md:pl-64'
      }`}>
        <header className="sticky top-0 z-20 bg-white/95 border-b border-gray-200 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="flex items-center justify-between p-4 h-16 md:py-4">
            <div className="flex items-center md:ml-0 ml-8">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/" className="text-gray-600 hover:text-gray-900">
                      HeyCal
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-gray-900 font-medium">
                      {pageName}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            {/* Mobile Hamburger Menu */}
            <div className="z-50 md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="text-gray-100 p-2 rounded-lg focus:outline-none">
                    {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><line x1="4" y1="7" x2="20" y2="7" /><line x1="4" y1="17" x2="16" y2="17" /></svg>}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="p-6 sm:p-16 bg-white rounded-l-lg shadow-lg w-full max-w-xs">
                  <nav className="space-y-3">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`block w-full px-4 py-2 rounded-md text-sm text-center transition-colors ${
                          isActive(href)
                            ? "bg-gray-200 text-black font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                  {/* Invitation Block */}
                  <div className="mt-8 space-y-3 p-4 bg-stone-900 border border-stone-800 rounded-lg">
                    <p className="text-[11px] font-medium tracking-wider text-stone-500">Invitation</p>
                    <div className="flex items-center justify-between text-sm">
                      <span>Invited</span>
                      <span>8.2 GB of 15 GB</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-800 relative">
                      <span className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-stone-400 to-stone-300 rounded-full"></span>
                    </div>
                    <button
                      onClick={handleInvite}
                      className="w-full text-center text-xs text-stone-400 hover:text-stone-200 transition"
                    >
                      {copied ? 'Copied!' : 'Share HeyCal'}
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <CalendarProvider>
            <div>
              {children}
            </div>
          </CalendarProvider>
        </main>
      </div>
    </div>
  )
}