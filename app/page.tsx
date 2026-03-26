import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from "@/components/logo"
import {
  Baby,
  Calendar,
  Camera,
  Heart,
  Hospital,
  Shield,
  Brain,
  AlertTriangle,
  Check,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: Calendar,
    title: "Week-by-Week Tracking",
    description: "Visual guides showing your baby&apos;s growth and expected changes throughout pregnancy.",
  },
  {
    icon: Camera,
    title: "AI Safety Scanner",
    description: "Snap a photo of food, supplements, or medicine labels to check if they&apos;re safe.",
  },
  {
    icon: Hospital,
    title: "Hospital Locator",
    description: "Find nearby maternity wards and NICU-equipped hospitals with one tap.",
  },
  {
    icon: AlertTriangle,
    title: "Red Flag Alerts",
    description: "Symptom checker that identifies danger signs and prompts immediate action.",
  },
  {
    icon: Baby,
    title: "Baby Logs",
    description: "Track feeding, diaper changes, and sleep patterns for your newborn.",
  },
  {
    icon: Brain,
    title: "Mental Health Check-ins",
    description: "Regular wellness assessments with resources for postpartum support.",
  },
]

const steps = [
  {
    number: "01",
    title: "Create Your Profile",
    description: "Enter your due date and basic health information to personalize your experience.",
  },
  {
    number: "02",
    title: "Track Your Journey",
    description: "Follow week-by-week milestones and prepare for checkups with smart reminders.",
  },
  {
    number: "03",
    title: "Stay Safe & Informed",
    description: "Use AI tools to check safety, find hospitals, and monitor your health.",
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MedicalDisclaimer />
      <Navigation variant="landing" />

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-16 sm:py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute right-0 top-1/2 h-[400px] w-[400px] rounded-full bg-accent/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-medium text-secondary-foreground">
              <Heart className="h-4 w-4 text-primary" />
              Your Trusted Pregnancy Companion
            </div>
            
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Supporting You Through Every Step of
              <span className="text-primary"> Motherhood</span>
            </h1>
            
            <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
              AI-powered pregnancy tracking, safety checking, and maternal health support. 
              From your first week to your fourth trimester, we&apos;re here for you.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
                <Link href="/register">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
            {[
              { value: "40+", label: "Weeks of Guidance" },
              { value: "1000+", label: "Safety Items Checked" },
              { value: "24/7", label: "Support Available" },
              { value: "100%", label: "Privacy Protected" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary sm:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need for a Healthy Pregnancy
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive tools designed by healthcare professionals to support your journey.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How MamaCare Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, intuitive, and always focused on your well-being.
            </p>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-16 hidden h-full w-px bg-border lg:block" />
                )}
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="mt-2 text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section id="safety" className="bg-secondary/50 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Shield className="h-4 w-4" />
                Your Privacy Matters
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Built with Safety & Privacy First
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                We understand the sensitivity of your health data. That&apos;s why we&apos;ve implemented 
                industry-leading security measures to protect you and your family.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "End-to-end encryption for all data",
                  "Zero data sharing or selling policy",
                  "HIPAA-compliant data storage",
                  "Medical advisory board reviewed content",
                  "Regular security audits",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 p-8 lg:p-12">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Shield className="h-24 w-24 text-primary opacity-50" />
                  <p className="mt-6 text-xl font-semibold">Your Data is Protected</p>
                  <p className="mt-2 text-muted-foreground">AES-256 encryption at rest</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of mothers who trust MamaCare for their pregnancy and postpartum journey.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto text-base px-8" asChild>
              <Link href="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <Logo size="md" />
              <p className="mt-4 max-w-sm text-sm text-muted-foreground">
                AI-powered pregnancy tracking and maternal health support. 
                Always consult your healthcare provider for medical decisions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold">Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/pregnancy-tracker" className="hover:text-foreground transition-colors">Pregnancy Tracker</Link></li>
                <li><Link href="/safety-scanner" className="hover:text-foreground transition-colors">Safety Scanner</Link></li>
                <li><Link href="/hospitals" className="hover:text-foreground transition-colors">Hospital Finder</Link></li>
                <li><Link href="/baby-logs" className="hover:text-foreground transition-colors">Baby Logs</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/disclaimer" className="hover:text-foreground transition-colors">Medical Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} MamaCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
