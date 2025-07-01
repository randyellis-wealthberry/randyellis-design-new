import { useState } from "react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Onboarding } from "@/components/Onboarding"
import ProfileCard from "@/components/ProfileCard/ProfileCard"
import { Dock, DockIcon } from '@/components/magicui/dock'
import { 
  Home, 
  Briefcase, 
  Mail, 
  Github, 
  Linkedin,
  FileText,
  Twitter
} from 'lucide-react'

function App() {
  // Always show main app, suppress onboarding for portfolio visitors
  const [showMainApp, setShowMainApp] = useState(true)

  const handleOnboardingComplete = () => {
    localStorage.setItem('phion-onboarding-completed', 'true')
    setShowMainApp(true)
  }

  // Safe window operations with error handling
  const safeWindowOpen = (url: string, target: string = '_blank') => {
    console.log(`Attempting to open: ${url}`)
    try {
      if (typeof window !== 'undefined') {
        if (target === '_self') {
          // Navigate in same window
          window.location.href = url
        } else {
          // Open in new tab
          const opened = window.open(url, target, 'noopener,noreferrer')
          if (!opened) {
            console.error('Popup blocked - new tab could not be opened')
          } else {
            console.log('Window opened successfully')
          }
        }
      }
    } catch (error) {
      console.error('Error opening window:', error)
    }
  }

  const safeScrollToTop = () => {
    console.log('Attempting scroll to top')
    try {
      if (typeof window !== 'undefined') {
        if (window.scrollY === 0) {
          console.log('Reloading page')
          window.location.reload()
        } else {
          console.log('Scrolling to top')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    } catch (error) {
      console.error('Error with scroll operation:', error)
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
      icon: Twitter,
      label: 'X (Twitter)',
      action: () => safeWindowOpen('https://x.com/iamrandyellis')
    }
  ]

  const handleIconClick = (item: typeof navigationItems[0]) => {
    console.log(`Dock button clicked: ${item.label}`) // Debug log
    try {
      item.action()
    } catch (error) {
      console.error(`Navigation error for ${item.label}:`, error)
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
        <div className="min-h-screen bg-background flex items-center justify-center p-2">
          <div className="fixed top-6 right-6">
            <ThemeToggle />
          </div>
          
          {/* Main content with Dock above ProfileCard */}
          <div className="flex flex-col items-center -space-y-12">
            {/* Dock Navigation */}
            <Dock 
              className="bg-background/80 border-border/50 shadow-lg backdrop-blur-md !mt-0 !mb-0 relative z-50"
              iconSize={48}
              iconMagnification={64}
              iconDistance={120}
              direction="middle"
            >
              {navigationItems.map((item) => {
                const IconComponent = item.icon
                return (
                  <DockIcon
                    key={item.id}
                    className="bg-background/50 hover:bg-accent/80 border border-border/20 hover:border-accent-foreground/20 transition-all duration-200 cursor-pointer relative z-50"
                    onClick={() => handleIconClick(item)}
                    onKeyDown={(event) => handleIconKeyDown(event, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Navigate to ${item.label}`}
                    title={item.label}
                    style={{ pointerEvents: 'auto' }}
                  >
                    <IconComponent 
                      size={24} 
                      className="text-foreground hover:text-accent-foreground transition-colors duration-200 pointer-events-none" 
                    />
                  </DockIcon>
                )
              })}
            </Dock>

            {/* ProfileCard */}
            <ProfileCard
              avatarUrl="/profile-avatar.png"
              miniAvatarUrl="/mini-avatar.png"
              name="Randy Ellis"
              title="GenAI/Product Design Strategist"
              handle="iamrandyellis"
              status="Available for projects"
              contactText="Book a Call"
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() => safeWindowOpen('https://calendly.com/randyellis/15min')}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Copyright Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/20 py-2">
            <div className="container mx-auto px-4">
              <p className="text-center text-sm text-muted-foreground">
                © Randy Ellis 2013-{new Date().getFullYear()} • All Rights Reserved
              </p>
            </div>
          </footer>
        </div>
      </TooltipProvider>
    )
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}

export default App
