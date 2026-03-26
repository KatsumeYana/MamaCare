"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Baby,
  Calendar,
  Camera,
  Heart,
  Hospital,
  AlertTriangle,
  Brain,
  ArrowRight,
  ChevronRight,
  Apple,
  Droplets,
  Moon,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { doc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore"

// Mock weekly details for dashboard - in real app this would be more comprehensive
const weeklyDetails: Record<number, { babySize: string, babyLength: string, babyWeight: string }> = {
  24: { babySize: "an ear of corn", babyLength: "30 cm", babyWeight: "600 grams" },
  25: { babySize: "a rutabaga", babyLength: "34 cm", babyWeight: "680 grams" },
  // ... more weeks
}

const upcomingCheckups = [
  { name: "Glucose Tolerance Test", date: "April 2, 2026", daysUntil: 7 },
  { name: "Anatomy Scan Follow-up", date: "April 15, 2026", daysUntil: 20 },
]

const quickActions = [
  { icon: Camera, label: "Safety Scanner", href: "/safety-scanner", color: "bg-primary/10 text-primary" },
  { icon: Hospital, label: "Find Hospital", href: "/hospitals", color: "bg-accent/10 text-accent" },
  { icon: Baby, label: "Baby Logs", href: "/baby-logs", color: "bg-chart-3 text-chart-3" },
  { icon: Brain, label: "Mental Health", href: "/mental-health", color: "bg-chart-4 text-chart-4" },
]

const dailyTips = [
  { icon: Apple, text: "Remember to eat iron-rich foods today", color: "text-accent" },
  { icon: Droplets, text: "Stay hydrated - aim for 8-10 glasses of water", color: "text-primary" },
  { icon: Moon, text: "Try sleeping on your left side for better blood flow", color: "text-chart-3" },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data().profile)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const calculateWeek = (dueDate: string) => {
    if (!dueDate) return 24 // default
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeksRemaining = Math.floor(diffDays / 7)
    const currentWeek = 40 - weeksRemaining
    return currentWeek > 0 && currentWeek <= 40 ? currentWeek : 24
  }

  const currentWeek = profile?.dueDate ? calculateWeek(profile.dueDate) : 24
  const progressPercent = (currentWeek / 40) * 100
  const weekDetails = weeklyDetails[currentWeek] || weeklyDetails[24]

  if (!user || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MedicalDisclaimer dismissible />
      <Navigation variant="app" />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Good Morning, {profile?.firstName || user.displayName?.split(" ")[0] || "Mama"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Week {currentWeek} of your pregnancy journey
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pregnancy Progress Card */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Your Pregnancy Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">Week {currentWeek}</span>
                      <span className="text-muted-foreground">of 40</span>
                    </div>
                    <Progress value={progressPercent} className="mt-3 h-3" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Trimester {currentWeek <= 13 ? 1 : currentWeek <= 27 ? 2 : 3} - Due {profile?.dueDate ? new Date(profile.dueDate).toLocaleDateString() : "Not set"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-secondary/50 p-4">
                    <p className="text-sm font-medium text-muted-foreground">Your baby is the size of</p>
                    <p className="mt-1 text-2xl font-semibold">{weekDetails.babySize}</p>
                    <div className="mt-3 flex gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Length: </span>
                        <span className="font-medium">{weekDetails.babyLength}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Weight: </span>
                        <span className="font-medium">{weekDetails.babyWeight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Link 
                  href="/pregnancy-tracker" 
                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  View Week-by-Week Guide
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {quickActions.map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border p-4 text-center transition-colors hover:bg-muted"
                    >
                      <div className={`rounded-full p-3 ${action.color}`}>
                        <action.icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailyTips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <tip.icon className={`h-5 w-5 ${tip.color}`} />
                      <span className="text-sm">{tip.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Checkups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Upcoming Checkups
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingCheckups.map((checkup, index) => (
                    <div key={index} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
                      <div>
                        <p className="font-medium">{checkup.name}</p>
                        <p className="text-sm text-muted-foreground">{checkup.date}</p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {checkup.daysUntil} days
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/checkups">
                    View All Checkups
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Emergency Card */}
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-destructive">Feeling Unwell?</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Use our symptom checker to identify any red flags that need immediate attention.
                    </p>
                    <Button size="sm" variant="destructive" className="mt-3" asChild>
                      <Link href="/symptom-checker">Check Symptoms</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointment Prep */}
            <Card>
              <CardHeader>
                <CardTitle>Appointment Prep</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Prepare questions for your next OB-GYN visit
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/appointment-prep">
                    Generate Questions
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
