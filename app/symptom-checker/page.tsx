"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Phone,
  Hospital,
  CheckCircle,
  AlertCircle,
  XCircle,
  Info,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { collection, addDoc, Timestamp } from "firebase/firestore"

type SeverityLevel = "emergency" | "urgent" | "monitor" | "normal"

interface Symptom {
  id: string
  label: string
  severity: SeverityLevel
  description?: string
}

const symptoms: Symptom[] = [
  // Emergency symptoms
  { id: "heavy-bleeding", label: "Heavy vaginal bleeding (soaking a pad in less than an hour)", severity: "emergency" },
  { id: "severe-headache", label: "Severe headache that won&apos;t go away", severity: "emergency" },
  { id: "vision-changes", label: "Blurred vision or seeing spots", severity: "emergency" },
  { id: "chest-pain", label: "Chest pain or difficulty breathing", severity: "emergency" },
  { id: "seizures", label: "Seizures or convulsions", severity: "emergency" },
  { id: "no-movement", label: "No fetal movement for more than 2 hours (after 28 weeks)", severity: "emergency" },
  { id: "water-broke", label: "Water broke (gush or steady leak of fluid)", severity: "emergency" },
  
  // Urgent symptoms
  { id: "contractions", label: "Regular contractions before 37 weeks", severity: "urgent" },
  { id: "severe-swelling", label: "Sudden severe swelling of face, hands, or feet", severity: "urgent" },
  { id: "fever", label: "Fever above 100.4°F (38°C)", severity: "urgent" },
  { id: "severe-vomiting", label: "Severe vomiting (can&apos;t keep fluids down for 24 hours)", severity: "urgent" },
  { id: "painful-urination", label: "Burning or pain during urination with fever", severity: "urgent" },
  
  // Monitor symptoms
  { id: "mild-swelling", label: "Mild swelling in feet or ankles", severity: "monitor" },
  { id: "back-pain", label: "Back pain or pelvic pressure", severity: "monitor" },
  { id: "mild-headache", label: "Mild headache", severity: "monitor" },
  { id: "fatigue", label: "Unusual fatigue", severity: "monitor" },
  { id: "nausea", label: "Nausea or morning sickness", severity: "monitor" },
  
  // Normal symptoms
  { id: "heartburn", label: "Heartburn or indigestion", severity: "normal" },
  { id: "frequent-urination", label: "Frequent urination", severity: "normal" },
  { id: "strong-kicks", label: "Strong baby movements", severity: "normal" },
  { id: "leg-cramps", label: "Leg cramps at night", severity: "normal" },
]

export default function SymptomCheckerPage() {
  const { user } = useAuth()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId)
        ? prev.filter((id) => id !== symptomId)
        : [...prev, symptomId]
    )
  }

  const getHighestSeverity = (): SeverityLevel => {
    const selectedSeverities = selectedSymptoms.map(
      (id) => symptoms.find((s) => s.id === id)?.severity || "normal"
    )
    if (selectedSeverities.includes("emergency")) return "emergency"
    if (selectedSeverities.includes("urgent")) return "urgent"
    if (selectedSeverities.includes("monitor")) return "monitor"
    return "normal"
  }

  const handleCheckSymptoms = async () => {
    if (user) {
      setIsSaving(true)
      try {
        await addDoc(collection(db, "symptom_checks"), {
          userId: user.uid,
          selectedSymptoms,
          highestSeverity: getHighestSeverity(),
          createdAt: Timestamp.now(),
        })
      } catch (error) {
        console.error("Error saving symptom check:", error)
      } finally {
        setIsSaving(false)
      }
    }
    setShowResults(true)
  }

  const handleReset = () => {
    setSelectedSymptoms([])
    setShowResults(false)
  }

  const severity = getHighestSeverity()

  const getSeverityConfig = (level: SeverityLevel) => {
    switch (level) {
      case "emergency":
        return {
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 border-red-200",
          title: "Emergency - Seek Immediate Care",
          description: "The symptoms you selected may indicate a serious condition. Please call 911 or go to the nearest emergency room immediately.",
        }
      case "urgent":
        return {
          icon: AlertTriangle,
          color: "text-amber-600",
          bgColor: "bg-amber-50 border-amber-200",
          title: "Urgent - Contact Your Doctor",
          description: "These symptoms need medical attention soon. Contact your OB-GYN or midwife right away, or visit urgent care if unavailable.",
        }
      case "monitor":
        return {
          icon: AlertCircle,
          color: "text-blue-600",
          bgColor: "bg-blue-50 border-blue-200",
          title: "Monitor - Keep Track",
          description: "These symptoms are worth monitoring. Note when they occur and mention them at your next appointment. Contact your doctor if they worsen.",
        }
      case "normal":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 border-green-200",
          title: "Normal Pregnancy Symptoms",
          description: "These are common pregnancy symptoms. While uncomfortable, they are usually not cause for concern. Try home remedies and rest.",
        }
    }
  }

  const config = getSeverityConfig(severity)

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
          <h1 className="text-2xl font-bold sm:text-3xl">Symptom Checker</h1>
          <p className="mt-1 text-muted-foreground">
            Select any symptoms you&apos;re experiencing to get guidance
          </p>
        </div>

        {/* Emergency Banner */}
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <p className="text-sm">
                <strong>If you are experiencing a medical emergency, call 911 immediately.</strong>{" "}
                Do not wait to use this tool.
              </p>
            </div>
          </CardContent>
        </Card>

        {!showResults ? (
          <>
            {/* Symptom Categories */}
            <div className="space-y-6">
              {/* Emergency Symptoms */}
              <Card className="border-red-200">
                <CardHeader className="bg-red-50/50">
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <XCircle className="h-5 w-5" />
                    Emergency Symptoms
                  </CardTitle>
                  <CardDescription>
                    These symptoms require immediate medical attention
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {symptoms.filter((s) => s.severity === "emergency").map((symptom) => (
                      <label
                        key={symptom.id}
                        className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm" dangerouslySetInnerHTML={{ __html: symptom.label }} />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Urgent Symptoms */}
              <Card className="border-amber-200">
                <CardHeader className="bg-amber-50/50">
                  <CardTitle className="flex items-center gap-2 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                    Urgent Symptoms
                  </CardTitle>
                  <CardDescription>
                    Contact your healthcare provider soon
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {symptoms.filter((s) => s.severity === "urgent").map((symptom) => (
                      <label
                        key={symptom.id}
                        className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm" dangerouslySetInnerHTML={{ __html: symptom.label }} />
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Monitor Symptoms */}
              <Card className="border-blue-200">
                <CardHeader className="bg-blue-50/50">
                  <CardTitle className="flex items-center gap-2 text-blue-700">
                    <AlertCircle className="h-5 w-5" />
                    Symptoms to Monitor
                  </CardTitle>
                  <CardDescription>
                    Keep track and mention at your next appointment
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {symptoms.filter((s) => s.severity === "monitor").map((symptom) => (
                      <label
                        key={symptom.id}
                        className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Normal Symptoms */}
              <Card>
                <CardHeader className="bg-green-50/50">
                  <CardTitle className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Common Pregnancy Symptoms
                  </CardTitle>
                  <CardDescription>
                    Usually normal but can be uncomfortable
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {symptoms.filter((s) => s.severity === "normal").map((symptom) => (
                      <label
                        key={symptom.id}
                        className="flex items-start gap-3 cursor-pointer rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedSymptoms.includes(symptom.id)}
                          onCheckedChange={() => toggleSymptom(symptom.id)}
                          className="mt-0.5"
                        />
                        <span className="text-sm">{symptom.label}</span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Check Button */}
            <div className="mt-8 flex justify-center">
              <Button
                size="lg"
                onClick={handleCheckSymptoms}
                disabled={selectedSymptoms.length === 0 || isSaving}
              >
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check My Symptoms
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          /* Results */
          <div className="space-y-6">
            <Card className={cn("border-2", config.bgColor)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <config.icon className={cn("h-8 w-8 flex-shrink-0", config.color)} />
                  <div className="flex-1">
                    <h2 className={cn("text-xl font-bold", config.color)}>
                      {config.title}
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                      {config.description}
                    </p>

                    {/* Selected Symptoms Summary */}
                    <div className="mt-4">
                      <h3 className="font-medium mb-2">Selected Symptoms:</h3>
                      <ul className="space-y-1">
                        {selectedSymptoms.map((id) => {
                          const symptom = symptoms.find((s) => s.id === id)
                          return (
                            <li key={id} className="flex items-center gap-2 text-sm">
                              <div className={cn(
                                "h-2 w-2 rounded-full",
                                symptom?.severity === "emergency" && "bg-red-500",
                                symptom?.severity === "urgent" && "bg-amber-500",
                                symptom?.severity === "monitor" && "bg-blue-500",
                                symptom?.severity === "normal" && "bg-green-500",
                              )} />
                              <span dangerouslySetInnerHTML={{ __html: symptom?.label || "" }} />
                            </li>
                          )
                        })}
                      </ul>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {(severity === "emergency" || severity === "urgent") && (
                        <>
                          <Button variant="destructive" asChild>
                            <a href="tel:911">
                              <Phone className="mr-2 h-4 w-4" />
                              Call 911
                            </a>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link href="/hospitals">
                              <Hospital className="mr-2 h-4 w-4" />
                              Find Nearest Hospital
                            </Link>
                          </Button>
                        </>
                      )}
                      <Button variant="outline" onClick={handleReset}>
                        Check Again
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    This symptom checker is for informational purposes only and is not a substitute 
                    for professional medical advice, diagnosis, or treatment. Always seek the advice 
                    of your physician or other qualified health provider with any questions you may 
                    have regarding a medical condition.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
