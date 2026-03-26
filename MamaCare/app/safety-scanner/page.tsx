"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Camera,
  Upload,
  Search,
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Apple,
  Pill,
  Leaf,
  Loader2,
  Info,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

type SafetyStatus = "safe" | "unsafe" | "caution" | null

interface ScanResult {
  name: string
  status: SafetyStatus
  details: string
  category: "food" | "medicine" | "supplement"
}

// Mock database for demonstration
const mockSafetyDatabase: Record<string, ScanResult> = {
  "salmon": { name: "Salmon", status: "safe", details: "Excellent source of omega-3. Safe when cooked properly.", category: "food" },
  "sushi": { name: "Raw Sushi", status: "unsafe", details: "Raw fish may contain harmful bacteria. Avoid during pregnancy.", category: "food" },
  "coffee": { name: "Coffee", status: "caution", details: "Limit to 200mg caffeine per day (about 1-2 cups).", category: "food" },
  "soft cheese": { name: "Soft Cheese", status: "caution", details: "Avoid unpasteurized varieties due to listeria risk.", category: "food" },
  "ibuprofen": { name: "Ibuprofen", status: "unsafe", details: "Not recommended during pregnancy, especially in third trimester.", category: "medicine" },
  "acetaminophen": { name: "Acetaminophen (Tylenol)", status: "safe", details: "Generally considered safe when taken as directed.", category: "medicine" },
  "prenatal vitamins": { name: "Prenatal Vitamins", status: "safe", details: "Essential for pregnancy. Continue as directed by your doctor.", category: "supplement" },
  "vitamin a": { name: "Vitamin A (High dose)", status: "caution", details: "High doses can be harmful. Stick to prenatal vitamin amounts.", category: "supplement" },
  "fish oil": { name: "Fish Oil (DHA)", status: "safe", details: "Beneficial for baby&apos;s brain development. Choose mercury-free brands.", category: "supplement" },
}

const recentSearches = [
  { name: "Salmon", status: "safe" as SafetyStatus },
  { name: "Coffee", status: "caution" as SafetyStatus },
  { name: "Ibuprofen", status: "unsafe" as SafetyStatus },
]

export default function SafetyScannerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    setIsScanning(true)
    setScanResult(null)

    // Simulate API call
    setTimeout(() => {
      const query = searchQuery.toLowerCase()
      const result = mockSafetyDatabase[query] || {
        name: searchQuery,
        status: "caution" as SafetyStatus,
        details: "Item not found in our database. Please consult your healthcare provider for accurate information.",
        category: "food" as const,
      }
      setScanResult(result)
      setIsScanning(false)
    }, 1500)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      await performOCRScan(file)
    }
  }

  const performOCRScan = async (file: File) => {
    setIsScanning(true)
    setScanResult(null)

    // Using a mockup as requested because the Hugging Face Inference API 
    // may block or fail large model scans directly from the browser due to CORS or model size
    setTimeout(() => {
      const mockResults = [
        {
          name: "Ibuprofen Liquid Gels",
          status: "unsafe" as SafetyStatus,
          details: "Detected active ingredient: Ibuprofen. Not recommended during pregnancy, especially in the third trimester due to risks of complications.",
          category: "medicine" as const,
        },
        {
          name: "Prenatal Multi-Vitamin",
          status: "safe" as SafetyStatus,
          details: "Detected ingredients: Folic Acid, Iron, DHA. These are essential nutrients for a healthy pregnancy.",
          category: "supplement" as const,
        },
        {
          name: "Cold Brew Coffee",
          status: "caution" as SafetyStatus,
          details: "Detected Caffeine. Limit caffeine intake to 200mg per day during pregnancy.",
          category: "food" as const,
        }
      ]
      
      // Pick a random mock result to simulate varied scanning
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)]
      
      setScanResult(randomResult)
      setIsScanning(false)
    }, 2500)
  }

  const clearResult = () => {
    setScanResult(null)
    setUploadedImage(null)
    setSearchQuery("")
  }

  const getStatusColor = (status: SafetyStatus) => {
    switch (status) {
      case "safe":
        return "text-green-600 bg-green-50 border-green-200"
      case "unsafe":
        return "text-red-600 bg-red-50 border-red-200"
      case "caution":
        return "text-amber-600 bg-amber-50 border-amber-200"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getStatusIcon = (status: SafetyStatus) => {
    switch (status) {
      case "safe":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "unsafe":
        return <XCircle className="h-6 w-6 text-red-600" />
      case "caution":
        return <AlertTriangle className="h-6 w-6 text-amber-600" />
      default:
        return null
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Apple className="h-5 w-5" />
      case "medicine":
        return <Pill className="h-5 w-5" />
      case "supplement":
        return <Leaf className="h-5 w-5" />
      default:
        return null
    }
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
          <h1 className="text-2xl font-bold sm:text-3xl">Safety Scanner</h1>
          <p className="mt-1 text-muted-foreground">
            Check if foods, medicines, or supplements are safe during pregnancy
          </p>
        </div>

        {/* Scan Options */}
        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Search
            </TabsTrigger>
            <TabsTrigger value="scan" className="gap-2">
              <Camera className="h-4 w-4" />
              Scan Label
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Search for an Item</CardTitle>
                <CardDescription>
                  Enter the name of a food, medicine, or supplement to check its safety
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g., salmon, ibuprofen, vitamin D..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} disabled={isScanning || !searchQuery.trim()}>
                    {isScanning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                    <span className="ml-2 hidden sm:inline">Search</span>
                  </Button>
                </div>

                {/* Quick Search Suggestions */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Popular searches:</p>
                  <div className="flex flex-wrap gap-2">
                    {["Coffee", "Salmon", "Soft Cheese", "Ibuprofen", "Prenatal Vitamins"].map((item) => (
                      <Button
                        key={item}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(item)
                        }}
                      >
                        {item}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scan" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scan a Label</CardTitle>
                <CardDescription>
                  Upload a photo of an ingredient list or medicine label
                </CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {!uploadedImage ? (
                  <div
                    className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-sm font-medium">
                      Click to upload or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PNG, JPG or HEIC up to 10MB
                    </p>
                    <Button className="mt-4" variant="outline">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo or Upload
                    </Button>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded label"
                      className="w-full rounded-xl max-h-64 object-cover"
                    />
                    <Button
                      variant="secondary"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setUploadedImage(null)
                        setScanResult(null)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Scanning Indicator */}
        {isScanning && (
          <Card className="mt-6">
            <CardContent className="py-8">
              <div className="flex flex-col items-center text-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="mt-4 font-medium">Analyzing...</p>
                <p className="text-sm text-muted-foreground">
                  Checking our database for safety information
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {scanResult && !isScanning && (
          <Card className={cn("mt-6 border-2", getStatusColor(scanResult.status))}>
            <CardContent className="py-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(scanResult.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(scanResult.category)}
                    <h3 className="text-lg font-semibold">{scanResult.name}</h3>
                  </div>
                  <div className="mt-1">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                        scanResult.status === "safe" && "bg-green-100 text-green-700",
                        scanResult.status === "unsafe" && "bg-red-100 text-red-700",
                        scanResult.status === "caution" && "bg-amber-100 text-amber-700"
                      )}
                    >
                      {scanResult.status === "safe" && "Safe During Pregnancy"}
                      {scanResult.status === "unsafe" && "Avoid During Pregnancy"}
                      {scanResult.status === "caution" && "Use With Caution"}
                    </span>
                  </div>
                  <p className="mt-3 text-muted-foreground" dangerouslySetInnerHTML={{ __html: scanResult.details }} />
                  
                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-secondary/50 p-3 text-sm">
                    <Info className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">
                      Always consult your healthcare provider before making decisions based on this information.
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={clearResult}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Searches */}
        {!scanResult && !isScanning && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Recent Searches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentSearches.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(item.name)
                        handleSearch()
                      }}
                    >
                      Search Again
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Safety Legend */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Safety Legend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-600">Safe</p>
                  <p className="text-sm text-muted-foreground">Generally safe during pregnancy</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-600">Caution</p>
                  <p className="text-sm text-muted-foreground">Use in moderation or consult doctor</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-600">Avoid</p>
                  <p className="text-sm text-muted-foreground">Not recommended during pregnancy</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
