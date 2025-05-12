"use client";

import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ToastProvider } from "@/components/ui";
import { usePathname } from "next/navigation";

// Use a better font combination
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Dashboard pages will have their own layout with navbar and sidebar
  const isDashboardPage = pathname?.startsWith('/dashboard');
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Click & Done - Professional Website Creation Platform</title>
        <meta name="description" content="Turn your vision into a beautiful website. Transparent process, professional results." />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <ToastProvider>
              <div className="flex min-h-screen flex-col bg-background">
                {!isDashboardPage && <Navbar />}
                <main className="flex-1 w-full">{children}</main>
                {!isDashboardPage && <Footer />}
              </div>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
