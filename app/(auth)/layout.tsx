import { Manrope } from "next/font/google";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({ children, }: Readonly<{  children: React.ReactNode;}>) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
        className={`${manrope.variable} ${manrope.variable} antialiased`}
    >
        {children}
    </body>
    </html>
  );
}