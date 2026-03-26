"use client"

import { AlertTriangle, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface MedicalDisclaimerProps {
  className?: string
  dismissible?: boolean
}

export function MedicalDisclaimer({ className, dismissible = false }: MedicalDisclaimerProps) {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className={cn(
        "bg-secondary/80 border-b border-border px-4 py-2 text-sm text-secondary-foreground",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 text-accent" />
        <p className="text-center text-xs sm:text-sm">
          This app is for guidance only and does not replace your OB-GYN. Always consult a doctor for medical decisions.
        </p>
        {dismissible && (
          <button
            onClick={() => setDismissed(true)}
            className="ml-2 rounded-full p-1 hover:bg-muted transition-colors"
            aria-label="Dismiss disclaimer"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}
