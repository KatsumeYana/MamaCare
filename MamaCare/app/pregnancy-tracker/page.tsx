"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Baby,
  Heart,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  Scale,
  Ruler,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"

// Week data - in real app this would come from a database
const weeklyData: Record<number, {
  babySize: string
  babyLength: string
  babyWeight: string
  babyDevelopment: string[]
  motherChanges: string[]
  tips: string[]
  testsThisWeek?: string[]
}> = {
  24: {
    babySize: "an ear of corn",
    babyLength: "30 cm",
    babyWeight: "600 grams",
    babyDevelopment: [
      "Baby&apos;s face is fully formed",
      "Taste buds are developing",
      "Inner ear is fully developed - baby can hear your voice",
      "Skin is becoming less transparent",
      "Baby may respond to loud sounds",
    ],
    motherChanges: [
      "Belly button may be protruding outward",
      "Skin may feel itchy as it stretches",
      "Back pain may increase as center of gravity shifts",
      "Braxton Hicks contractions may begin",
      "Increased appetite as baby grows rapidly",
    ],
    tips: [
      "Practice talking or singing to your baby",
      "Use moisturizer to help with itchy skin",
      "Consider prenatal yoga for back pain relief",
      "Stay hydrated to reduce Braxton Hicks",
    ],
    testsThisWeek: ["Glucose screening test may be scheduled soon"],
  },
  25: {
    babySize: "a rutabaga",
    babyLength: "34 cm",
    babyWeight: "680 grams",
    babyDevelopment: [
      "Baby is gaining more fat",
      "Nostrils begin to open",
      "Spine is forming its structure",
      "Blood vessels are developing in lungs",
      "Baby can now suck and hiccup",
    ],
    motherChanges: [
      "Heartburn may increase",
      "Hemorrhoids may develop",
      "Hair may become thicker",
      "Leg cramps may occur at night",
      "Increased urination frequency",
    ],
    tips: [
      "Eat smaller, more frequent meals",
      "Elevate your legs when resting",
      "Stretch before bed to prevent cramps",
      "Continue taking prenatal vitamins",
    ],
  },
  // More weeks would be added here
}

const trimesterWeeks = {
  1: { start: 1, end: 13 },
  2: { start: 14, end: 27 },
  3: { start: 28, end: 40 },
}

export default function PregnancyTrackerPage() {
  const { user } = useAuth()
  const [currentWeek, setCurrentWeek] = useState(24)
  const [isLoading, setIsLoading] = useState(true)
  
  const weekData = weeklyData[currentWeek] || weeklyData[24]

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          if (data.profile?.dueDate) {
            const calculatedWeek = calculateWeek(data.profile.dueDate)
            if (calculatedWeek) setCurrentWeek(calculatedWeek)
          }
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
    if (!dueDate) return null
    const due = new Date(dueDate)
    const today = new Date()
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeksRemaining = Math.floor(diffDays / 7)
    const currentWeek = 40 - weeksRemaining
    return currentWeek > 0 && currentWeek <= 40 ? currentWeek : null
  }

  const getTrimester = (week: number) => {
    if (week <= 13) return 1
    if (week <= 27) return 2
    return 3
  }

  const handlePreviousWeek = () => {
    if (currentWeek > 1) setCurrentWeek(currentWeek - 1)
  }

  const handleNextWeek = () => {
    if (currentWeek < 40) setCurrentWeek(currentWeek + 1)
  }

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
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold sm:text-3xl">Week-by-Week Guide</h1>
            <p className="mt-1 text-muted-foreground">
              Track your baby&apos;s development and your body&apos;s changes
            </p>
          </div>
        </div>

        {/* Week Selector */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousWeek}
                disabled={currentWeek <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex-1 text-center">
                <div className="text-sm text-muted-foreground">Trimester {getTrimester(currentWeek)}</div>
                <div className="text-3xl font-bold text-primary">Week {currentWeek}</div>
                <div className="mt-2 flex justify-center gap-1">
                  {Array.from({ length: 40 }, (_, i) => i + 1).map((week) => (
                    <button
                      key={week}
                      onClick={() => setCurrentWeek(week)}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full transition-colors",
                        week === currentWeek
                          ? "bg-primary w-4"
                          : week <= currentWeek
                          ? "bg-primary/50"
                          : "bg-muted"
                      )}
                      aria-label={`Go to week ${week}`}
                    />
                  ))}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextWeek}
                disabled={currentWeek >= 40}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Baby Size Card */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6">
            <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-8">
              <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20 sm:mb-0">
                <Baby className="h-12 w-12 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-muted-foreground">Your baby is the size of</h2>
                <p className="text-3xl font-bold">{weekData.babySize}</p>
                <div className="mt-3 flex justify-center gap-6 sm:justify-start">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{weekData.babyLength}</span> length
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      <span className="font-medium">{weekData.babyWeight}</span> weight
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Tabs Content */}
        <Tabs defaultValue="baby" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="baby" className="gap-2">
              <Baby className="h-4 w-4" />
              <span className="hidden sm:inline">Baby&apos;s Development</span>
              <span className="sm:hidden">Baby</span>
            </TabsTrigger>
            <TabsTrigger value="mother" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Your Changes</span>
              <span className="sm:hidden">You</span>
            </TabsTrigger>
            <TabsTrigger value="tips" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Tips & Tests</span>
              <span className="sm:hidden">Tips</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="baby" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Baby className="h-5 w-5 text-primary" />
                  Baby&apos;s Development This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weekData.babyDevelopment.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mother" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Changes in Your Body
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weekData.motherChanges.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-chart-3" />
                  Tips for This Week
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {weekData.tips.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-chart-3 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {weekData.testsThisWeek && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Tests & Checkups
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {weekData.testsThisWeek.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3">
                        <AlertCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousWeek}
            disabled={currentWeek <= 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Week {currentWeek - 1}
          </Button>
          <Button
            onClick={handleNextWeek}
            disabled={currentWeek >= 40}
          >
            Week {currentWeek + 1}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  )
}
