"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { MedicalDisclaimer } from "@/components/medical-disclaimer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  User,
  Settings,
  Bell,
  Shield,
  LogOut,
  ArrowLeft,
  Calendar,
  Baby,
  Heart,
  Edit2,
  Camera,
  Check,
  Loader2,
} from "lucide-react"
import { Logo } from "@/components/logo"
import { useAuth } from "@/hooks/use-auth"
import { db, auth as firebaseAuth } from "@/lib/firebase"
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore"
import { signOut } from "firebase/auth"

export default function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dueDate: "",
    doctor: "",
    hospital: "",
    pregnancyNumber: "1",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
  })

  const [notifications, setNotifications] = useState({
    checkupReminders: true,
    weeklyUpdates: true,
    mentalHealthCheckins: true,
    emergencyAlerts: true,
    tips: false,
  })

  useEffect(() => {
    if (!user) return

    const fetchProfile = async () => {
      try {
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const data = docSnap.data()
          setProfileData(prev => ({ ...prev, ...data.profile }))
          if (data.notifications) setNotifications(data.notifications)
        } else {
          // Initialize with user info from auth
          setProfileData(prev => ({
            ...prev,
            firstName: user.displayName?.split(" ")[0] || "",
            lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
            email: user.email || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await setDoc(doc(db, "users", user.uid), {
        profile: profileData,
        notifications,
        updatedAt: Timestamp.now(),
      }, { merge: true })
      setIsEditing(false)
    } catch (error) {
      console.error("Error saving profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(firebaseAuth)
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

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

  if (!user || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const currentWeek = calculateWeek(profileData.dueDate)

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
          <h1 className="text-2xl font-bold sm:text-3xl">Profile & Settings</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your account and preferences
          </p>
        </div>

        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center sm:flex-row sm:gap-6">
              <div className="relative mb-4 sm:mb-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.photoURL || ""} alt={profileData.firstName} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {profileData.firstName[0]}{profileData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-xl font-bold">{profileData.firstName} {profileData.lastName}</h2>
                <p className="text-muted-foreground">{profileData.email}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-3 sm:justify-start">
                  {currentWeek && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                      <Baby className="mr-1 h-3 w-3" />
                      Week {currentWeek}
                    </span>
                  )}
                  {profileData.dueDate && (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      <Calendar className="mr-1 h-3 w-3" />
                      Due: {new Date(profileData.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
              <Button 
                variant={isEditing ? "default" : "outline"} 
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isEditing ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Edit2 className="mr-2 h-4 w-4" />
                )}
                {isEditing ? "Save" : "Edit"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Personal</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Your basic profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pregnancy Information</CardTitle>
                <CardDescription>
                  Details about your pregnancy journey
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={profileData.dueDate}
                      onChange={(e) => setProfileData({...profileData, dueDate: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="doctor">OB-GYN Name</Label>
                    <Input
                      id="doctor"
                      value={profileData.doctor}
                      onChange={(e) => setProfileData({...profileData, doctor: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Preferred Hospital</Label>
                    <Input
                      id="hospital"
                      value={profileData.hospital}
                      onChange={(e) => setProfileData({...profileData, hospital: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pregnancyNumber">Pregnancy Number</Label>
                    <Select 
                      disabled={!isEditing} 
                      value={profileData.pregnancyNumber}
                      onValueChange={(val) => setProfileData({...profileData, pregnancyNumber: val})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">First Pregnancy</SelectItem>
                        <SelectItem value="2">Second Pregnancy</SelectItem>
                        <SelectItem value="3">Third Pregnancy</SelectItem>
                        <SelectItem value="4+">Fourth or More</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
                <CardDescription>
                  Person to contact in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">Name</Label>
                    <Input
                      id="emergencyName"
                      value={profileData.emergencyName}
                      onChange={(e) => setProfileData({...profileData, emergencyName: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">Relationship</Label>
                    <Input
                      id="emergencyRelation"
                      value={profileData.emergencyRelation}
                      onChange={(e) => setProfileData({...profileData, emergencyRelation: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={profileData.emergencyPhone}
                    onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose what updates you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Checkup Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about upcoming appointments and tests
                    </p>
                  </div>
                  <Switch
                    checked={notifications.checkupReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, checkupReminders: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive weekly pregnancy milestone updates
                    </p>
                  </div>
                  <Switch
                    checked={notifications.weeklyUpdates}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, weeklyUpdates: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mental Health Check-ins</Label>
                    <p className="text-sm text-muted-foreground">
                      Bi-weekly reminders for wellness assessments
                    </p>
                  </div>
                  <Switch
                    checked={notifications.mentalHealthCheckins}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, mentalHealthCheckins: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      Emergency Alerts
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive">
                        Required
                      </span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Critical health alerts and urgent notifications
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emergencyAlerts}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Daily Tips</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive daily pregnancy tips and suggestions
                    </p>
                  </div>
                  <Switch
                    checked={notifications.tips}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, tips: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Manage your data and security settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Your Data is Protected</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        All your health data is encrypted with AES-256 encryption at rest 
                        and TLS in transit. We never share or sell your personal information.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Two-Factor Authentication
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Download My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/privacy" className="block text-sm hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-sm hover:underline">
                  Terms of Service
                </Link>
                <Link href="/disclaimer" className="block text-sm hover:underline">
                  Medical Disclaimer
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sign Out */}
        <div className="mt-8">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* App Info */}
        <div className="mt-8 text-center">
          <Logo size="sm" className="justify-center" />
          <p className="mt-2 text-xs text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </main>
    </div>
  )
}
