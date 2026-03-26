"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Baby,
  Droplets,
  Moon,
  Utensils,
  Plus,
  ArrowLeft,
  Clock,
  TrendingUp,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { db } from "@/lib/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  Timestamp 
} from "firebase/firestore"

interface FeedingLog {
  id: string
  userId: string
  type: "breast" | "bottle" | "formula"
  side?: "left" | "right" | "both"
  duration?: number
  amount?: number
  time: string
  date: string
  createdAt: any
}

interface DiaperLog {
  id: string
  userId: string
  type: "wet" | "dirty" | "both"
  color?: string
  time: string
  date: string
  createdAt: any
}

interface SleepLog {
  id: string
  userId: string
  startTime: string
  endTime: string
  duration: number
  date: string
  createdAt: any
}

export default function BabyLogsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("feeding")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [feedings, setFeedings] = useState<FeedingLog[]>([])
  const [diapers, setDiapers] = useState<DiaperLog[]>([])
  const [sleep, setSleep] = useState<SleepLog[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false)
  const [diaperDialogOpen, setDiaperDialogOpen] = useState(false)
  const [sleepDialogOpen, setSleepDialogOpen] = useState(false)

  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [feedingForm, setFeedingForm] = useState({
    type: "breast",
    side: "left",
    duration: "15",
    amount: "",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
  })

  const [diaperForm, setDiaperForm] = useState({
    type: "wet",
    color: "yellow",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
  })

  const [sleepForm, setSleepForm] = useState({
    startTime: "",
    endTime: "",
    notes: "",
  })

  useEffect(() => {
    if (!user) return

    const dateStr = selectedDate.toISOString().split('T')[0]

    const feedingsQuery = query(
      collection(db, "feedings"),
      where("userId", "==", user.uid),
      where("date", "==", dateStr),
      orderBy("createdAt", "desc")
    )

    const diapersQuery = query(
      collection(db, "diapers"),
      where("userId", "==", user.uid),
      where("date", "==", dateStr),
      orderBy("createdAt", "desc")
    )

    const sleepQuery = query(
      collection(db, "sleep"),
      where("userId", "==", user.uid),
      where("date", "==", dateStr),
      orderBy("createdAt", "desc")
    )

    const unsubscribeFeedings = onSnapshot(feedingsQuery, (snapshot) => {
      setFeedings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FeedingLog)))
      setIsLoading(false)
    })

    const unsubscribeDiapers = onSnapshot(diapersQuery, (snapshot) => {
      setDiapers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as DiaperLog)))
    })

    const unsubscribeSleep = onSnapshot(sleepQuery, (snapshot) => {
      setSleep(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SleepLog)))
    })

    return () => {
      unsubscribeFeedings()
      unsubscribeDiapers()
      unsubscribeSleep()
    }
  }, [user, selectedDate])

  const handleSaveFeeding = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await addDoc(collection(db, "feedings"), {
        userId: user.uid,
        type: feedingForm.type,
        side: feedingForm.type === "breast" ? feedingForm.side : null,
        duration: feedingForm.type === "breast" ? parseInt(feedingForm.duration) : null,
        amount: feedingForm.type !== "breast" ? parseInt(feedingForm.amount) : null,
        time: feedingForm.time,
        date: selectedDate.toISOString().split('T')[0],
        createdAt: Timestamp.now(),
      })
      setFeedingDialogOpen(false)
    } catch (error) {
      console.error("Error saving feeding:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveDiaper = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await addDoc(collection(db, "diapers"), {
        userId: user.uid,
        type: diaperForm.type,
        color: diaperForm.type !== "wet" ? diaperForm.color : null,
        time: diaperForm.time,
        date: selectedDate.toISOString().split('T')[0],
        createdAt: Timestamp.now(),
      })
      setDiaperDialogOpen(false)
    } catch (error) {
      console.error("Error saving diaper:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveSleep = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      const start = new Date(`2000-01-01T${sleepForm.startTime}`)
      const end = new Date(`2000-01-01T${sleepForm.endTime}`)
      let duration = (end.getTime() - start.getTime()) / (1000 * 60)
      if (duration < 0) duration += 24 * 60

      await addDoc(collection(db, "sleep"), {
        userId: user.uid,
        startTime: sleepForm.startTime,
        endTime: sleepForm.endTime,
        duration: duration,
        notes: sleepForm.notes,
        date: selectedDate.toISOString().split('T')[0],
        createdAt: Timestamp.now(),
      })
      setSleepDialogOpen(false)
    } catch (error) {
      console.error("Error saving sleep:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1))
    setSelectedDate(newDate)
  }

  const getTotalFeedingTime = () => {
    return feedings.reduce((acc, f) => acc + (f.duration || 0), 0)
  }

  const getTotalSleepTime = () => {
    return sleep.reduce((acc, s) => acc + s.duration, 0)
  }

  if (!user) {
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
          <h1 className="text-2xl font-bold sm:text-3xl">Baby Logs</h1>
          <p className="mt-1 text-muted-foreground">
            Track feeding, diapers, and sleep patterns
          </p>
        </div>

        {/* Date Navigation */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => navigateDate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{formatDate(selectedDate)}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => navigateDate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Daily Summary */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Utensils className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-2xl font-bold">{feedings.length}</p>
              <p className="text-xs text-muted-foreground">Feedings</p>
              <p className="text-xs text-muted-foreground">{getTotalFeedingTime()} min total</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="mx-auto h-6 w-6 text-accent" />
              <p className="mt-2 text-2xl font-bold">{diapers.length}</p>
              <p className="text-xs text-muted-foreground">Diapers</p>
              <p className="text-xs text-muted-foreground">{diapers.filter(d => d.type === "wet" || d.type === "both").length} wet</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Moon className="mx-auto h-6 w-6 text-chart-3" />
              <p className="mt-2 text-2xl font-bold">{Math.floor(getTotalSleepTime() / 60)}h</p>
              <p className="text-xs text-muted-foreground">Sleep</p>
              <p className="text-xs text-muted-foreground">{sleep.length} naps</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="feeding" className="gap-2">
              <Utensils className="h-4 w-4" />
              <span className="hidden sm:inline">Feeding</span>
            </TabsTrigger>
            <TabsTrigger value="diaper" className="gap-2">
              <Droplets className="h-4 w-4" />
              <span className="hidden sm:inline">Diaper</span>
            </TabsTrigger>
            <TabsTrigger value="sleep" className="gap-2">
              <Moon className="h-4 w-4" />
              <span className="hidden sm:inline">Sleep</span>
            </TabsTrigger>
          </TabsList>

          {/* Feeding Tab */}
          <TabsContent value="feeding" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Feeding Log</h2>
              <Dialog open={feedingDialogOpen} onOpenChange={setFeedingDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Feeding
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Feeding</DialogTitle>
                    <DialogDescription>
                      Record a new feeding session
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={feedingForm.type} onValueChange={(val: any) => setFeedingForm({...feedingForm, type: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breast">Breastfeeding</SelectItem>
                          <SelectItem value="bottle">Bottle (Breast Milk)</SelectItem>
                          <SelectItem value="formula">Formula</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {feedingForm.type === "breast" ? (
                      <div className="space-y-2">
                        <Label>Side (for breastfeeding)</Label>
                        <Select value={feedingForm.side} onValueChange={(val: any) => setFeedingForm({...feedingForm, side: val})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select side" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                            <SelectItem value="both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Amount (ml)</Label>
                        <Input 
                          type="number" 
                          placeholder="120" 
                          value={feedingForm.amount} 
                          onChange={(e) => setFeedingForm({...feedingForm, amount: e.target.value})}
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      {feedingForm.type === "breast" && (
                        <div className="space-y-2">
                          <Label>Duration (minutes)</Label>
                          <Input 
                            type="number" 
                            placeholder="15" 
                            value={feedingForm.duration} 
                            onChange={(e) => setFeedingForm({...feedingForm, duration: e.target.value})}
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input 
                          type="text" 
                          placeholder="08:30 AM" 
                          value={feedingForm.time} 
                          onChange={(e) => setFeedingForm({...feedingForm, time: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setFeedingDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveFeeding} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </div>
                ) : feedings.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No feedings logged for this day.
                  </div>
                ) : feedings.map((feeding) => (
                  <div key={feeding.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        feeding.type === "breast" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                      )}>
                        <Utensils className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">
                          {feeding.type === "breast" ? "Breastfeeding" : feeding.type === "bottle" ? "Bottle" : "Formula"}
                          {feeding.side && ` - ${feeding.side}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {feeding.duration ? `${feeding.duration} minutes` : `${feeding.amount} ml`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {feeding.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Diaper Tab */}
          <TabsContent value="diaper" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Diaper Log</h2>
              <Dialog open={diaperDialogOpen} onOpenChange={setDiaperDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Diaper
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Diaper Change</DialogTitle>
                    <DialogDescription>
                      Record a diaper change
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Type</Label>
                      <Select value={diaperForm.type} onValueChange={(val: any) => setDiaperForm({...diaperForm, type: val})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wet">Wet</SelectItem>
                          <SelectItem value="dirty">Dirty</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {diaperForm.type !== "wet" && (
                      <div className="space-y-2">
                        <Label>Stool Color (if dirty)</Label>
                        <Select value={diaperForm.color} onValueChange={(val: any) => setDiaperForm({...diaperForm, color: val})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="yellow">Yellow (Normal)</SelectItem>
                            <SelectItem value="yellow-green">Yellow-Green</SelectItem>
                            <SelectItem value="green">Green</SelectItem>
                            <SelectItem value="brown">Brown</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input 
                        type="text" 
                        placeholder="09:30 AM" 
                        value={diaperForm.time} 
                        onChange={(e) => setDiaperForm({...diaperForm, time: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDiaperDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveDiaper} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </div>
                ) : diapers.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No diapers logged for this day.
                  </div>
                ) : diapers.map((diaper) => (
                  <div key={diaper.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full",
                        diaper.type === "wet" ? "bg-blue-100 text-blue-600" :
                        diaper.type === "dirty" ? "bg-amber-100 text-amber-600" :
                        "bg-green-100 text-green-600"
                      )}>
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium capitalize">{diaper.type}</p>
                        {diaper.color && (
                          <p className="text-sm text-muted-foreground capitalize">{diaper.color}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {diaper.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Hydration Check */}
            <Card className="bg-blue-50/50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-700">Hydration Check</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {diapers.filter(d => d.type === "wet" || d.type === "both").length} wet diapers today. 
                      Aim for 6-8 wet diapers per day for proper hydration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sleep Tab */}
          <TabsContent value="sleep" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Sleep Log</h2>
              <Dialog open={sleepDialogOpen} onOpenChange={setSleepDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Log Sleep
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Log Sleep</DialogTitle>
                    <DialogDescription>
                      Record a sleep session
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Start Time</Label>
                        <Input 
                          type="time" 
                          value={sleepForm.startTime} 
                          onChange={(e) => setSleepForm({...sleepForm, startTime: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Time</Label>
                        <Input 
                          type="time" 
                          value={sleepForm.endTime} 
                          onChange={(e) => setSleepForm({...sleepForm, endTime: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notes (optional)</Label>
                      <Input 
                        placeholder="e.g., Fussy before sleep" 
                        value={sleepForm.notes} 
                        onChange={(e) => setSleepForm({...sleepForm, notes: e.target.value})}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setSleepDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveSleep} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0 divide-y divide-border">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                  </div>
                ) : sleep.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No sleep logged for this day.
                  </div>
                ) : sleep.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                        <Moon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {item.startTime} - {item.endTime}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {Math.floor(item.duration / 60)}h {Math.round(item.duration % 60)}m
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                        Nap
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Sleep Summary */}
            <Card className="bg-indigo-50/50 border-indigo-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Moon className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-indigo-700">Daily Sleep Summary</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Total sleep today: {Math.floor(getTotalSleepTime() / 60)} hours {Math.round(getTotalSleepTime() % 60)} minutes. 
                      Newborns typically need 14-17 hours of sleep per day.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
