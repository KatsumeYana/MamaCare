"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff, ArrowLeft, Loader2, Calendar, Check } from "lucide-react"
import { signInWithPopup, AuthProvider, createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { auth, db, googleProvider, facebookProvider } from "@/lib/firebase"
import { doc, setDoc, Timestamp } from "firebase/firestore"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSocialLoading, setIsSocialLoading] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dueDate: "",
    doctorName: "",
    isFirstPregnancy: "Yes",
  })

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: `${formData.firstName} ${formData.lastName}`
      })

      await setDoc(doc(db, "users", user.uid), {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          dueDate: formData.dueDate,
          doctor: formData.doctorName,
          pregnancyNumber: formData.isFirstPregnancy === "Yes" ? "1" : "2+",
        },
        createdAt: Timestamp.now(),
      })

      window.location.href = "/dashboard"
    } catch (error: any) {
      console.error("Registration error:", error)
      alert(error.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: AuthProvider) => {
    setIsSocialLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // For social login, we might not have the due date yet, 
      // but we should still initialize the user doc if it doesn't exist
      await setDoc(doc(db, "users", user.uid), {
        profile: {
          firstName: user.displayName?.split(" ")[0] || "",
          lastName: user.displayName?.split(" ").slice(1).join(" ") || "",
          email: user.email || "",
        },
        createdAt: Timestamp.now(),
      }, { merge: true })

      window.location.href = "/dashboard"
    } catch (error) {
      console.error("Social login error:", error)
      alert("Failed to register. Please try again.")
    } finally {
      setIsSocialLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/">
            <Logo size="sm" />
          </Link>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 1 ? "Create Your Account" : "About Your Pregnancy"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Join MamaCare for personalized pregnancy support"
                : "Help us personalize your experience"}
            </CardDescription>
            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <div className="flex items-center">
                <div className={`h-0.5 w-8 ${step > 1 ? "bg-primary" : "bg-muted"}`} />
              </div>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                2
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              <div className="space-y-6">
                <form onSubmit={handleStep1Submit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        placeholder="Sarah"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        placeholder="Mitchell"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="sarah@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                        minLength={8}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      At least 8 characters with a mix of letters and numbers
                    </p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <Label htmlFor="terms" className="text-sm font-normal leading-snug">
                      I agree to the <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </Label>
                  </div>
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button variant="outline" type="button" className="w-full" onClick={() => handleSocialLogin(googleProvider)} disabled={isSocialLoading}>
                    {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up with Google"}
                  </Button>
                  <Button variant="outline" type="button" className="w-full" onClick={() => handleSocialLogin(facebookProvider)} disabled={isSocialLoading}>
                    {isSocialLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign up with Facebook"}
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Expected Due Date</Label>
                  <div className="relative">
                    <Input
                      id="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                      required
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Don&apos;t know your due date? Enter your last menstrual period date instead.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pregnancyNumber">Is this your first pregnancy?</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      type="button" 
                      variant={formData.isFirstPregnancy === "Yes" ? "default" : "outline"} 
                      className="h-auto py-3 flex flex-col items-center gap-1"
                      onClick={() => setFormData({...formData, isFirstPregnancy: "Yes"})}
                    >
                      <span className="font-medium">Yes</span>
                      <span className="text-xs text-muted-foreground">First time</span>
                    </Button>
                    <Button 
                      type="button" 
                      variant={formData.isFirstPregnancy === "No" ? "default" : "outline"} 
                      className="h-auto py-3 flex flex-col items-center gap-1"
                      onClick={() => setFormData({...formData, isFirstPregnancy: "No"})}
                    >
                      <span className="font-medium">No</span>
                      <span className="text-xs text-muted-foreground">I&apos;ve been pregnant before</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctorName">Your OB-GYN&apos;s Name (Optional)</Label>
                  <Input
                    id="doctorName"
                    placeholder="Dr. Emily Chen"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            )}

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-4 text-center text-xs text-muted-foreground">
        <p>Your data is protected with end-to-end encryption</p>
      </footer>
    </div>
  )
}
