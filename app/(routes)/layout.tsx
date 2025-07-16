'use client'

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import type React from "react"
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Menu, XIcon } from "lucide-react"
import AppSidebar from "@/components/appSidebar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

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
    <div className="flex min-h-screen bg-gray-50/50">
      {/* Mobile Menu Button */}
      {/* <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5" />
      </Button> */}
      

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

            {/* Theme Toggle Button */}
            {/* {mounted && (
              <button
                type="button"
                aria-label="Toggle dark mode"
                onClick={toggleTheme}
                className="inline-flex hidden md:flex gap-2 items-center rounded-full px-4 py-2 bg-black/5 dark:bg-white/10 text-gray-700 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition font-medium text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
                <span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
              </button>
            )} */}

            {/* Mobile Hamburger Menu */}
            <div className="z-50 md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <button className="text-gray-100 bg-indigo-900 p-2 rounded-lg focus:outline-none">
                    {isMobileMenuOpen ? <XIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </SheetTrigger>
                <SheetContent side="right" className="p-16 bg-white rounded-l-lg shadow-lg">
                  <nav className="space-y-4">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`block px-4 py-2 rounded-lg text-center ${
                          isActive(href)
                            ? "bg-gray-200 text-black font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                  {/* Invite Card */}
                  <div className="px-2 mt-4">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
                      <CardHeader className="pb-2 space-y-1">
                        <CardTitle className="text-sm font-medium text-indigo-800">
                          Invite Your Team
                        </CardTitle>
                        <CardDescription className="text-indigo-600/80 text-xs">
                          Boost productivity together with HeyCal
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          onClick={handleInvite}
                          variant="default"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        >
                          {copied ? 'Copied!' : 'Copy Invite Link'}
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}