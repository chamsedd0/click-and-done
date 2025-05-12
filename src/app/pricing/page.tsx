import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container py-16 space-y-16">
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-4xl font-bold">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">
          Choose the perfect plan for your website needs with no hidden fees or surprises.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Basic Plan */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="p-6 bg-muted/30">
            <h3 className="text-xl font-medium">Basic</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$499</span>
              <span className="ml-2 text-muted-foreground">one-time payment</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Perfect for small businesses and personal websites.
            </p>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Up to 5 pages</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Mobile responsive design</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Contact form</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Basic SEO optimization</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>1 revision round</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Delivery in 2 weeks</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 pt-0">
            <Button className="w-full" asChild>
              <Link href="/request/start?plan=basic">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Premium Plan - Highlighted */}
        <div className="flex flex-col border rounded-lg overflow-hidden border-primary shadow-md relative">
          <div className="absolute top-0 inset-x-0 h-2 bg-primary"></div>
          <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
          
          <div className="p-6 bg-muted/30">
            <h3 className="text-xl font-medium">Premium</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$999</span>
              <span className="ml-2 text-muted-foreground">one-time payment</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Ideal for growing businesses and professional services.
            </p>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Up to 10 pages</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Mobile responsive design</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Contact form & interactive elements</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Advanced SEO optimization</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Blog or news section</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Social media integration</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>3 revision rounds</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Delivery in 3 weeks</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 pt-0">
            <Button className="w-full" asChild>
              <Link href="/request/start?plan=premium">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Enterprise Plan */}
        <div className="flex flex-col border rounded-lg overflow-hidden">
          <div className="p-6 bg-muted/30">
            <h3 className="text-xl font-medium">Enterprise</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-4xl font-bold">$2,499</span>
              <span className="ml-2 text-muted-foreground">one-time payment</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Advanced solutions for larger businesses and e-commerce.
            </p>
          </div>
          
          <div className="p-6 flex-grow">
            <ul className="space-y-3">
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Up to 20 pages</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Custom mobile responsive design</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>E-commerce functionality</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Comprehensive SEO package</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Content management system</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>User authentication system</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Advanced analytics integration</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Unlimited revision rounds</span>
              </li>
              <li className="flex">
                <Check className="h-5 w-5 text-primary mr-2" />
                <span>Delivery in 4-6 weeks</span>
              </li>
            </ul>
          </div>
          
          <div className="p-6 pt-0">
            <Button className="w-full" asChild>
              <Link href="/request/start?plan=enterprise">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Services */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Additional Services</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Ongoing Maintenance</h3>
            <p className="text-sm text-muted-foreground mb-4">Keep your website up-to-date and secure with our monthly maintenance package.</p>
            <p className="text-lg font-bold">$99/month</p>
          </div>
          
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">SEO Package</h3>
            <p className="text-sm text-muted-foreground mb-4">Boost your website's visibility with our comprehensive SEO optimization.</p>
            <p className="text-lg font-bold">$299</p>
          </div>
          
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Logo Design</h3>
            <p className="text-sm text-muted-foreground mb-4">Professional logo design to enhance your brand identity.</p>
            <p className="text-lg font-bold">$199</p>
          </div>
          
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Content Creation</h3>
            <p className="text-sm text-muted-foreground mb-4">Professional copywriting to elevate your website content.</p>
            <p className="text-lg font-bold">$0.10/word</p>
          </div>
          
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Additional Pages</h3>
            <p className="text-sm text-muted-foreground mb-4">Expand your website with additional custom pages.</p>
            <p className="text-lg font-bold">$99/page</p>
          </div>
          
          <div className="border rounded-lg p-5">
            <h3 className="font-medium mb-2">Custom Feature</h3>
            <p className="text-sm text-muted-foreground mb-4">Need something specific? Contact us for custom functionality.</p>
            <Button variant="outline" className="mt-2" asChild>
              <Link href="/contact">Get a Quote</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-2">How does the payment process work?</h3>
            <p className="text-muted-foreground">We require a 50% deposit to start your project, with the remaining 50% due upon completion before the final delivery of files.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">What if I need changes after the project is completed?</h3>
            <p className="text-muted-foreground">Minor changes within 30 days of completion are included. For larger changes, we offer hourly rates or maintenance packages.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Do you provide web hosting?</h3>
            <p className="text-muted-foreground">We don't provide hosting directly, but we can recommend reliable hosting providers and help you set everything up.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">How long does the website development process take?</h3>
            <p className="text-muted-foreground">Development time varies by plan complexity, from 2 weeks for Basic to 4-6 weeks for Enterprise projects. Timeline is provided at project start.</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto bg-primary text-primary-foreground rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-6">Start building your dream website today with our professional team.</p>
        <Button size="lg" variant="secondary" asChild>
          <Link href="/request/start">Start Your Project</Link>
        </Button>
      </div>
    </div>
  );
} 