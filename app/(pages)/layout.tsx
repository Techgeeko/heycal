'use client'

import { MDXProvider } from '@mdx-js/react';
import { Manrope } from "next/font/google";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children, }: Readonly<{  children: React.ReactNode;}>) {
  return (
    <MDXProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${manrope.variable} ${manrope.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </MDXProvider>
  );
}
