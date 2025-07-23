import { type Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope } from "next/font/google"
import "./globals.css";
import { Toaster } from 'sonner'
import { CalendarProvider } from "@/components/calendar-provider"

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "HeyCal",
  description: "Chat with your calendar to manage events effortlessly - schedule, reschedule, cancel, and stay updated with HeyCal.",
  openGraph: {
    title: "HeyCal",
    description:
      "Chat with your calendar to manage events effortlessly - schedule, reschedule, cancel, and stay updated with HeyCal.",
    url: "https://heycal.com",
    siteName: "HeyCal",
    images: [
      {
        url: "https://heycal.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "HeyCal Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HeyCal",
    description:
      "Chat with your calendar to manage events effortlessly - schedule, reschedule, cancel, and stay updated with HeyCal.",
    images: ["https://heycal.com/og-image.png"],
  },
  icons: {
    icon: "favicon.ico",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <CalendarProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"  integrity="sha512-..." crossOrigin="anonymous"/>
            <link rel="manifest" href="/site.webmanifest" />
          </head>
          <body className={`${manrope.variable} ${manrope.variable} antialiased`}>
            {children}
            <Toaster richColors position="bottom-right" />
          </body>
        </html>
      </CalendarProvider>
    </ClerkProvider>
  );
}
