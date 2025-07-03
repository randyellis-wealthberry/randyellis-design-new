import { useState } from "react"
import { Analytics } from "@vercel/analytics/react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Onboarding } from "@/components/Onboarding"
import ProfileCard from "@/components/ProfileCard/ProfileCard"
import { Dock, DockIcon } from '@/components/magicui/dock'
import { AnimatedHeroPill } from '@/components/ui/hero-pill'
import { useDeviceDetection } from "@/hooks"
import { 
  Home, 
  Briefcase, 
  Mail, 
  Github, 
  Linkedin,
  FileText
} from 'lucide-react'
import { XIcon } from "@/components/ui/social-links"

function App() {
  // Always show main app, suppress onboarding for portfolio visitors
  const [showMainApp, setShowMainApp] = useState(true)
  
  // Device detection for accelerometer feature
  const deviceCapabilities = useDeviceDetection()

  const handleOnboardingComplete = () => {
    localStorage.setItem('phion-onboarding-completed', 'true')
    setShowMainApp(true)
  }

  // Safe window operations with error handling
  const safeWindowOpen = (url: string, target: string = '_blank') => {
    // Attempting to open URL
    try {
      if (typeof window !== 'undefined') {
        if (target === '_self') {
          // Navigate in same window
          window.location.href = url
        } else {
          // Open in new tab
          const opened = window.open(url, target, 'noopener,noreferrer')
          if (!opened) {
            // Popup blocked - new tab could not be opened
          } else {
            // Window opened successfully
          }
        }
      }
    } catch (error) {
      // Error opening window - silently fail
    }
  }

  const safeScrollToTop = () => {
    // Attempting scroll to top
    try {
      if (typeof window !== 'undefined') {
        if (window.scrollY === 0) {
          // Reloading page
          window.location.reload()
        } else {
          // Scrolling to top
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } catch (error) {
      // Error with scroll operation - silently fail
    }
  }

  // Navigation items for the dock
  const navigationItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      action: () => safeScrollToTop()
    },
    {
      id: 'portfolio',
      icon: Briefcase,
      label: 'Portfolio',
      action: () => safeWindowOpen('https://work.randyellis.design')
    },
    {
      id: 'resume',
      icon: FileText,
      label: 'Resume',
      action: () => safeWindowOpen('https://resume.co/@randyellis')
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'Book Meeting',
      action: () => safeWindowOpen('https://calendly.com/randyellis/15min')
    },
    {
      id: 'github',
      icon: Github,
      label: 'GitHub',
      action: () => safeWindowOpen('https://github.com/randyellis-wealthberry')
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      action: () => safeWindowOpen('https://www.linkedin.com/in/iamrandyellis/')
    },
    {
      id: 'twitter',
      icon: XIcon,
      label: 'X (Twitter)',
      action: () => safeWindowOpen('https://x.com/iamrandyellis')
    }
  ]

  const handleIconClick = (item: typeof navigationItems[0]) => {
    // Dock button clicked
    try {
      item.action()
    } catch (error) {
      // Navigation error - silently fail
    }
  }

  const handleIconKeyDown = (event: React.KeyboardEvent, item: typeof navigationItems[0]) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleIconClick(item)
    }
  }

  if (showMainApp) {
    return (
      <TooltipProvider>
        {/* Fixed Single Column Dock */}
        <Dock 
          fixed={true}
          position="left"
          layout="column"
          className="bg-background/95 border-border/50 shadow-lg backdrop-blur-md"
          iconSize={40}
          iconMagnification={52}
          iconDistance={100}
          direction="center"
          role="navigation"
          aria-label="Main navigation"
        >
          {navigationItems.map((item) => {
            const IconComponent = item.icon
            return (
              <DockIcon
                key={item.id}
                className="border border-border/20 hover:border-accent-foreground/20 transition-[border-color,transform] duration-200 cursor-pointer"
                onClick={() => handleIconClick(item)}
                onKeyDown={(event) => handleIconKeyDown(event, item)}
                tabIndex={0}
                role="button"
                aria-label={`Navigate to ${item.label}`}
                title={item.label}
              >
                <IconComponent 
                  size={20} 
                  className="text-foreground hover:text-accent-foreground transition-colors duration-200" 
                />
              </DockIcon>
            )
          })}
        </Dock>

        {/* Main content area with left margin to account for fixed dock */}
        <div className="min-h-screen bg-background flex items-start justify-center pt-6 p-2 pl-20">
          <div className="fixed top-6 right-6 z-50">
            <ThemeToggle />
          </div>
          
          {/* Main content */}
          <div className="flex flex-col items-center w-full max-w-4xl">
            {/* Hero Pill */}
            <AnimatedHeroPill
              className="relative z-40 my-8"
              onClick={() => safeWindowOpen('https://calendly.com/randyellis/15min')}
            />

            {/* ProfileCard */}
            <ProfileCard
              avatarUrl="/randy-ellis-illustration.png"
              miniAvatarUrl="/randy-ellis-photo.png"
              name="Randy Ellis"
              title="GenAI/Product Design Strategist"
              handle="iamrandyellis"
              status="Online"
              contactText="Book a Call"
              showUserInfo={true}
              enableTilt={true}
              enableAccelerometer={deviceCapabilities.isMobile || deviceCapabilities.isTablet}
              accelerometerSensitivity={0.8}
              onContactClick={() => safeWindowOpen('https://calendly.com/randyellis/15min')}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Copyright Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/20 py-2 z-40">
            <div className="container mx-auto px-4">
              <p className="text-center text-[10px] text-muted-foreground">
                © Randy Ellis 2013-{new Date().getFullYear()} • All Rights Reserved
              </p>
            </div>
          </footer>
        </div>
        <Analytics />
      </TooltipProvider>
    )
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}

export default App
