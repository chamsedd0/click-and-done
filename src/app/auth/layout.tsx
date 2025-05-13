import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { cn } from "@/lib/utils"
import "../globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Authentication - Click & Done",
  description: "Sign in or create an account to get started.",
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "min-h-screen bg-background antialiased")}>
        <ThemeProvider>
          <AuthProvider>
            <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
              <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                <div className="absolute inset-0 bg-primary" />
                <div className="relative z-20 flex items-center text-lg font-medium">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold">Click & Done</span>
                  </Link>
                </div>
                <div className="relative z-20 mt-auto">
                  <blockquote className="space-y-2">
                    <p className="text-lg">
                      "Click & Done has transformed how we handle website development. It's simple, fast, and professional."
                    </p>
                    <footer className="text-sm">Sofia Davis</footer>
                  </blockquote>
                </div>
              </div>
              <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                  {children}
                </div>
              </div>
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
} 