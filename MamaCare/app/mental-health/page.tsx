"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Brain,
  Heart,
  Phone,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info,
  MessageCircle,
  Calendar,
  TrendingUp,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Edinburgh Postnatal Depression Scale (EPDS) questions
const epdsQuestions = [
  {
    id: 1,
    question: "I have been able to laugh and see the funny side of things",
    options: [
      { value: 0, label: "As much as I always could" },
      { value: 1, label: "Not quite so much now" },
      { value: 2, label: "Definitely not so much now" },
      { value: 3, label: "Not at all" },
    ],
  },
  {
    id: 2,
    question: "I have looked forward with enjoyment to things",
    options: [
      { value: 0, label: "As much as I ever did" },
      { value: 1, label: "Rather less than I used to" },
      { value: 2, label: "Definitely less than I used to" },
      { value: 3, label: "Hardly at all" },
    ],
  },
  {
    id: 3,
    question: "I have blamed myself unnecessarily when things went wrong",
    options: [
      { value: 3, label: "Yes, most of the time" },
      { value: 2, label: "Yes, some of the time" },
      { value: 1, label: "Not very often" },
      { value: 0, label: "No, never" },
    ],
  },
  {
    id: 4,
    question: "I have been anxious or worried for no good reason",
    options: [
      { value: 0, label: "No, not at all" },
      { value: 1, label: "Hardly ever" },
      { value: 2, label: "Yes, sometimes" },
      { value: 3, label: "Yes, very often" },
    ],
  },
  {
    id: 5,
    question: "I have felt scared or panicky for no very good reason",
    options: [
      { value: 3, label: "Yes, quite a lot" },
      { value: 2, label: "Yes, sometimes" },
      { value: 1, label: "No, not much" },
      { value: 0, label: "No, not at all" },
    ],
  },
]

const resources = [
  {
    name: "Postpartum Support International",
    phone: "1-800-944-4773",
    description: "Free helpline for perinatal mental health",
    available: "24/7",
  },
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "Crisis support for those in distress",
    available: "24/7",
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Text-based crisis support",
    available: "24/7",
  },
]

const selfCareTips = [
  "Take a 10-minute walk outside",
  "Practice deep breathing exercises",
  "Connect with a friend or family member",
  "Get 15 minutes of rest while baby sleeps",
  "Write down 3 things you&apos;re grateful for",
  "Listen to calming music",
]

export default function MentalHealthPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [assessmentStarted, setAssessmentStarted] = useState(false)

  const handleAnswer = (value: number) => {
    setAnswers({ ...answers, [epdsQuestions[currentQuestion].id]: value })
  }

  const handleNext = () => {
    if (currentQuestion < epdsQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, val) => sum + val, 0)
  }

  const getScoreInterpretation = (score: number) => {
    if (score <= 8) {
      return {
        level: "low",
        title: "Low Risk",
        description: "Your responses suggest you&apos;re coping well. Continue practicing self-care and reach out if you notice changes.",
        color: "text-green-600",
        bgColor: "bg-green-50 border-green-200",
      }
    } else if (score <= 12) {
      return {
        level: "moderate",
        title: "Moderate - Please Monitor",
        description: "Your responses suggest some difficulty. Consider speaking with your healthcare provider about how you&apos;re feeling.",
        color: "text-amber-600",
        bgColor: "bg-amber-50 border-amber-200",
      }
    } else {
      return {
        level: "high",
        title: "Please Seek Support",
        description: "Your responses suggest you may be experiencing significant distress. Please reach out to your healthcare provider or a mental health professional.",
        color: "text-red-600",
        bgColor: "bg-red-50 border-red-200",
      }
    }
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setAssessmentStarted(false)
  }

  const progress = ((currentQuestion + 1) / epdsQuestions.length) * 100

  return (
    <div className="min-h-screen bg-background">
      <MedicalDisclaimer />
      <Navigation variant="app" />

      <main className="mx-auto max-w-4xl px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">Mental Health Check-in</h1>
          <p className="mt-1 text-muted-foreground">
            Regular wellness assessments and support resources
          </p>
        </div>

        {!assessmentStarted ? (
          <div className="space-y-6">
            {/* Welcome Card */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-6">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 sm:mb-0">
                    <Brain className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">How Are You Feeling?</h2>
                    <p className="mt-2 text-muted-foreground">
                      This quick assessment uses the Edinburgh Postnatal Depression Scale (EPDS) 
                      to help identify if you might benefit from additional support.
                    </p>
                    <Button className="mt-4" onClick={() => setAssessmentStarted(true)}>
                      Start Check-in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Previous Check-ins */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Your Wellness Journey
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">Last Check-in: March 12, 2026</p>
                      <p className="text-sm text-muted-foreground">Score: 6/30 - Low Risk</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div>
                      <p className="font-medium">February 26, 2026</p>
                      <p className="text-sm text-muted-foreground">Score: 8/30 - Low Risk</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Next recommended check-in: March 26, 2026
                </p>
              </CardContent>
            </Card>

            {/* Self-Care Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Daily Self-Care Ideas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {selfCareTips.map((tip, index) => (
                    <div key={index} className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-sm font-medium text-accent">
                        {index + 1}
                      </div>
                      <span className="text-sm" dangerouslySetInnerHTML={{ __html: tip }} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Crisis Resources */}
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Support Resources
                </CardTitle>
                <CardDescription>
                  If you&apos;re struggling, help is available
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <div key={index} className="flex items-start justify-between gap-4 rounded-lg border border-border p-4">
                      <div>
                        <p className="font-medium">{resource.name}</p>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Available {resource.available}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={resource.phone.startsWith("Text") ? "#" : `tel:${resource.phone.replace(/[^0-9]/g, "")}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          {resource.phone}
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : showResults ? (
          /* Results */
          <div className="space-y-6">
            {(() => {
              const score = calculateScore()
              const interpretation = getScoreInterpretation(score)
              return (
                <>
                  <Card className={cn("border-2", interpretation.bgColor)}>
                    <CardContent className="p-6">
                      <div className="text-center">
                        <div className={cn("mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full", 
                          interpretation.level === "low" ? "bg-green-100" : 
                          interpretation.level === "moderate" ? "bg-amber-100" : "bg-red-100"
                        )}>
                          {interpretation.level === "low" ? (
                            <CheckCircle className="h-8 w-8 text-green-600" />
                          ) : interpretation.level === "moderate" ? (
                            <AlertTriangle className="h-8 w-8 text-amber-600" />
                          ) : (
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                          )}
                        </div>
                        <h2 className={cn("text-2xl font-bold", interpretation.color)}>
                          {interpretation.title}
                        </h2>
                        <p className="mt-2 text-muted-foreground">
                          Your score: {score} out of 30
                        </p>
                        <p className="mt-4 max-w-md mx-auto">
                          {interpretation.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {interpretation.level !== "low" && (
                    <Card className="border-primary/50">
                      <CardContent className="p-6">
                        <h3 className="font-semibold mb-4">Recommended Next Steps</h3>
                        <div className="space-y-3">
                          <Button className="w-full justify-start" variant="outline" asChild>
                            <a href="tel:18009444773">
                              <Phone className="mr-3 h-4 w-4" />
                              Call Postpartum Support International: 1-800-944-4773
                            </a>
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <MessageCircle className="mr-3 h-4 w-4" />
                            Schedule a call with your healthcare provider
                          </Button>
                          <Button className="w-full justify-start" variant="outline">
                            <ExternalLink className="mr-3 h-4 w-4" />
                            Find a therapist who specializes in perinatal mental health
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetAssessment} className="flex-1">
                      Take Again
                    </Button>
                    <Button asChild className="flex-1">
                      <Link href="/dashboard">Back to Dashboard</Link>
                    </Button>
                  </div>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          This screening is not a diagnosis. Only a qualified healthcare provider can 
                          diagnose postpartum depression or anxiety. If you&apos;re concerned about your 
                          mental health, please speak with your doctor.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )
            })()}
          </div>
        ) : (
          /* Assessment Questions */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    Question {currentQuestion + 1} of {epdsQuestions.length}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress)}% complete
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardHeader>
              <CardContent>
                <p className="mb-6 text-lg font-medium">
                  {epdsQuestions[currentQuestion].question}
                </p>
                <p className="mb-4 text-sm text-muted-foreground">
                  In the past 7 days...
                </p>
                <RadioGroup
                  value={answers[epdsQuestions[currentQuestion].id]?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {epdsQuestions[currentQuestion].options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <RadioGroupItem
                        value={option.value.toString()}
                        id={`option-${option.value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`option-${option.value}`}
                        className="flex w-full cursor-pointer items-center rounded-lg border border-border p-4 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 hover:bg-muted/50 transition-colors"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={answers[epdsQuestions[currentQuestion].id] === undefined}
              >
                {currentQuestion === epdsQuestions.length - 1 ? "See Results" : "Next"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
