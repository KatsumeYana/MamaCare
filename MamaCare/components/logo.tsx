import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  showText?: boolean
  size?: "sm" | "md" | "lg"
}

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-lg" },
    md: { icon: 36, text: "text-xl" },
    lg: { icon: 48, text: "text-2xl" },
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        width={sizes[size].icon}
        height={sizes[size].icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Heart shape with mother and baby silhouette */}
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E91E63" />
            <stop offset="50%" stopColor="#EC407A" />
            <stop offset="100%" stopColor="#F06292" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D32F2F" />
            <stop offset="100%" stopColor="#E91E63" />
          </linearGradient>
        </defs>
        
        {/* Main heart */}
        <path
          d="M24 44C24 44 4 30 4 17C4 10.373 9.373 5 16 5C19.934 5 23.293 7.067 24 10C24.707 7.067 28.066 5 32 5C38.627 5 44 10.373 44 17C44 30 24 44 24 44Z"
          fill="url(#heartGradient)"
        />
        
        {/* Mother figure (curved line representing pregnant belly) */}
        <ellipse
          cx="20"
          cy="22"
          rx="6"
          ry="8"
          fill="white"
          fillOpacity="0.3"
        />
        
        {/* Baby figure (small circle nestled in) */}
        <circle
          cx="22"
          cy="24"
          r="4"
          fill="white"
          fillOpacity="0.5"
        />
        
        {/* Small heart accent */}
        <path
          d="M32 18C32 18 28 22 28 25C28 23 29.5 21 32 21C34.5 21 36 23 36 25C36 22 32 18 32 18Z"
          fill="url(#accentGradient)"
          fillOpacity="0.8"
        />
      </svg>
      
      {showText && (
        <span className={cn("font-semibold tracking-tight", sizes[size].text)}>
          <span className="text-primary">Mama</span>
          <span className="text-accent">Care</span>
        </span>
      )}
    </div>
  )
}
