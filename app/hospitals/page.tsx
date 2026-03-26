"use client"

import { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Hospital,
  MapPin,
  Phone,
  Clock,
  Navigation as NavigationIcon,
  Star,
  ArrowLeft,
  Search,
  Loader2,
  Baby,
  Heart,
  Shield,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface HospitalData {
  id: string
  name: string
  address: string
  distance: string
  phone: string
  rating: number
  reviewCount: number
  isOpen: boolean
  hasNICU: boolean
  hasMaternityWard: boolean
  hasEmergency: boolean
  waitTime?: string
}

// Mock hospital data
const mockHospitals: HospitalData[] = [
  {
    id: "1",
    name: "St. Mary&apos;s Medical Center",
    address: "1234 Healthcare Drive, San Francisco, CA 94102",
    distance: "1.2 miles",
    phone: "(415) 555-0123",
    rating: 4.8,
    reviewCount: 324,
    isOpen: true,
    hasNICU: true,
    hasMaternityWard: true,
    hasEmergency: true,
    waitTime: "~15 min",
  },
  {
    id: "2",
    name: "Bay Area Women&apos;s Hospital",
    address: "5678 Mother&apos;s Way, San Francisco, CA 94103",
    distance: "2.4 miles",
    phone: "(415) 555-0456",
    rating: 4.9,
    reviewCount: 512,
    isOpen: true,
    hasNICU: true,
    hasMaternityWard: true,
    hasEmergency: true,
    waitTime: "~25 min",
  },
  {
    id: "3",
    name: "Pacific General Hospital",
    address: "910 Medical Plaza, San Francisco, CA 94104",
    distance: "3.1 miles",
    phone: "(415) 555-0789",
    rating: 4.5,
    reviewCount: 198,
    isOpen: true,
    hasNICU: false,
    hasMaternityWard: true,
    hasEmergency: true,
  },
  {
    id: "4",
    name: "Golden Gate Medical Center",
    address: "1112 Health Street, San Francisco, CA 94105",
    distance: "4.5 miles",
    phone: "(415) 555-1011",
    rating: 4.6,
    reviewCount: 267,
    isOpen: true,
    hasNICU: true,
    hasMaternityWard: true,
    hasEmergency: true,
    waitTime: "~10 min",
  },
]

export default function HospitalsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLocating, setIsLocating] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<"all" | "nicu" | "maternity">("all")

  const filteredHospitals = mockHospitals.filter((hospital) => {
    const matchesSearch =
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedFilter === "nicu") return matchesSearch && hospital.hasNICU
    if (selectedFilter === "maternity") return matchesSearch && hospital.hasMaternityWard
    return matchesSearch
  })

  const handleGetLocation = () => {
    setIsLocating(true)
    // Simulate geolocation
    setTimeout(() => {
      setIsLocating(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <MedicalDisclaimer />
      <Navigation variant="app" />

      <main className="mx-auto max-w-7xl px-4 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold sm:text-3xl">Find Nearby Hospitals</h1>
          <p className="mt-1 text-muted-foreground">
            Locate maternity wards and NICU-equipped hospitals near you
          </p>
        </div>

        {/* Search & Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search hospitals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={handleGetLocation} disabled={isLocating}>
                {isLocating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                Use My Location
              </Button>
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant={selectedFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
              >
                All Hospitals
              </Button>
              <Button
                variant={selectedFilter === "nicu" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("nicu")}
              >
                <Baby className="mr-2 h-4 w-4" />
                NICU Available
              </Button>
              <Button
                variant={selectedFilter === "maternity" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter("maternity")}
              >
                <Heart className="mr-2 h-4 w-4" />
                Maternity Ward
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Notice */}
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-destructive">Medical Emergency?</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  If you&apos;re experiencing severe symptoms, call <strong>911</strong> immediately or go to the nearest emergency room.
                </p>
                <Button size="sm" variant="destructive" className="mt-3" asChild>
                  <Link href="/symptom-checker">Check Symptoms First</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital List */}
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredHospitals.map((hospital) => (
            <Card key={hospital.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Hospital className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold" dangerouslySetInnerHTML={{ __html: hospital.name }} />
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: hospital.address }} />

                      {/* Features */}
                      <div className="mt-3 flex flex-wrap gap-2">
                        {hospital.hasNICU && (
                          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                            <Baby className="mr-1 h-3 w-3" />
                            NICU
                          </span>
                        )}
                        {hospital.hasMaternityWard && (
                          <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                            <Heart className="mr-1 h-3 w-3" />
                            Maternity
                          </span>
                        )}
                        {hospital.hasEmergency && (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                            <Shield className="mr-1 h-3 w-3" />
                            24/7 ER
                          </span>
                        )}
                      </div>

                      {/* Rating & Distance */}
                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="font-medium">{hospital.rating}</span>
                          <span className="text-muted-foreground">({hospital.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          {hospital.distance}
                        </div>
                        {hospital.waitTime && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {hospital.waitTime}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full",
                      hospital.isOpen ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    )}>
                      <span className="text-xs font-medium">
                        {hospital.isOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" className="flex-1 sm:flex-none">
                      <NavigationIcon className="mr-2 h-4 w-4" />
                      Get Directions
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 sm:flex-none" asChild>
                      <a href={`tel:${hospital.phone.replace(/[^0-9]/g, "")}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </a>
                    </Button>
                    <Button size="sm" variant="ghost">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHospitals.length === 0 && (
          <Card className="mt-6">
            <CardContent className="py-12 text-center">
              <Hospital className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No hospitals found</h3>
              <p className="mt-2 text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
