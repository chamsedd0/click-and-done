import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code, Clock, BarChart, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-4">
            Beautiful Websites <span className="text-primary">Made Simple</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Click and Done simplifies the website creation process. Submit your
            requirements, track progress, and get your website delivered faster than
            ever.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/pricing"
              className="px-6 py-3 bg-transparent border border-muted text-foreground font-medium rounded-md hover:bg-muted/20 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Our streamlined process makes getting your perfect website easier than ever before.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Code className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Submit Request</h3>
              <p className="text-muted-foreground">
                Fill out our simple form with your website requirements and preferences.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Review & Approve</h3>
              <p className="text-muted-foreground">
                We'll create designs based on your requirements. Review, provide feedback, and approve.
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Get Your Website</h3>
              <p className="text-muted-foreground">
                Our team develops your approved design into a fully functional website ready for launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="w-full py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose Click and Done</h2>
          <p className="text-lg text-muted-foreground mb-12">
            We've reimagined the website creation process to be faster, transparent, and hassle-free.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Turnaround</h3>
              <p className="text-muted-foreground">
                Get your website delivered in days, not months. Our streamlined process ensures quick results.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Updates</h3>
              <p className="text-muted-foreground">
                Track your project's progress at every stage with our transparent dashboard.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Transparent Pricing</h3>
              <p className="text-muted-foreground">
                No hidden fees or surprise costs. Pay only for what you need with our clear pricing structure.
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Code className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
              <p className="text-muted-foreground">
                We don't disappear after launch. Get continued support and maintenance for your website.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Clients Say</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Don't just take our word for it. Here's what our clients have to say about their experience.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="font-semibold">JD</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Small Business Owner</p>
                </div>
              </div>
              <p className="text-left">
                "Click and Done delivered my e-commerce website in just two weeks. The entire process was smooth, and the final result exceeded my expectations."
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="font-semibold">SJ</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-muted-foreground">Marketing Director</p>
                </div>
              </div>
              <p className="text-left">
                "The dashboard made it so easy to track progress and provide feedback. I loved being able to see my website come to life stage by stage."
              </p>
            </div>
            
            <div className="bg-background p-6 rounded-lg border shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="font-semibold">RM</span>
                </div>
                <div className="text-left">
                  <h4 className="font-semibold">Robert Miller</h4>
                  <p className="text-sm text-muted-foreground">Startup Founder</p>
                </div>
              </div>
              <p className="text-left">
                "As a non-technical founder, I was worried about the website creation process. Click and Done made it painless and delivered a stunning website."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 px-4 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 mb-8">
            Turn your website idea into reality. Our team is ready to create the perfect website for your business.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="px-6 py-3 bg-white text-primary font-medium rounded-md hover:bg-blue-50 transition-colors"
            >
              Start Your Project
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-primary-foreground/10 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
