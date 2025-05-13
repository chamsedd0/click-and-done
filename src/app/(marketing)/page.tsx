import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Zap } from "lucide-react"

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background px-4 py-32 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              Website Development
              <span className="block text-primary">Made Simple</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Get your website developed quickly and professionally. No complex processes,
              just click and get it done.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Choose Click & Done?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We make website development simple, fast, and professional.
            </p>
          </div>
          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-card p-6">
              <Zap className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Fast Delivery</h3>
              <p className="mt-2 text-muted-foreground">
                Get your website up and running in record time with our efficient process.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <CheckCircle className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">Quality Assured</h3>
              <p className="mt-2 text-muted-foreground">
                Every website is built to the highest standards with attention to detail.
              </p>
            </div>
            <div className="rounded-lg border bg-card p-6">
              <Clock className="h-8 w-8 text-primary" />
              <h3 className="mt-4 text-xl font-semibold">24/7 Support</h3>
              <p className="mt-2 text-muted-foreground">
                Our team is always here to help you with any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of satisfied customers who have built their online presence with us.
            </p>
            <div className="mt-10">
              <Button size="lg" asChild>
                <Link href="/auth/signup">
                  Create Your Account <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 