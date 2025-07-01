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

  // Navigation items for the dock
  const navigationItems = [
    {
      id: 'home',
      icon: Home,
      label: 'Home',
      action: () => {
        if (window.scrollY === 0) {
          window.location.reload()
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }
    },
    {
      id: 'portfolio',
      icon: Briefcase,
      label: 'Portfolio',
      action: () => {
        window.open('https://work.randyellis.design', '_blank')
      }
    },
    {
      id: 'resume',
      icon: FileText,
      label: 'Resume',
      action: () => {
        window.open('https://resume.co/@randyellis', '_blank')
      }
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'Book Meeting',
      action: () => {
        window.open('https://calendly.com/randyellis/15min', '_blank')
      }
    },
    {
      id: 'github',
      icon: Github,
      label: 'GitHub',
      action: () => {
        window.open('https://github.com/randyellis-wealthberry', '_blank')
      }
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      action: () => {
        window.open('https://www.linkedin.com/in/iamrandyellis/', '_blank')
      }
    },
    {
      id: 'twitter',
      icon: Twitter,
      label: 'X (Twitter)',
      action: () => {
        window.open('https://x.com/iamrandyellis', '_blank')
      }
    }
  ]

  const handleIconClick = (item: typeof navigationItems[0]) => {
    try {
      item.action()
    } catch (_error) {
      // Navigation errors are logged but not displayed to user
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
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="fixed top-6 right-6">
            <ThemeToggle />
          </div>
          


          {/* Main content with Dock above ProfileCard */}
          <div className="flex flex-col items-center -space-y-4">
            {/* Dock Navigation */}
            <Dock 
              className="bg-background/80 border-border/50 shadow-lg backdrop-blur-md !mt-0 !mb-0"
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
                    className="bg-background/50 hover:bg-accent/80 border border-border/20 hover:border-accent-foreground/20 transition-all duration-200 cursor-pointer"
                    onClick={() => handleIconClick(item)}
                    onKeyDown={(event) => handleIconKeyDown(event, item)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Navigate to ${item.label}`}
                    title={item.label}
                  >
                    <IconComponent 
                      size={24} 
                      className="text-foreground hover:text-accent-foreground transition-colors duration-200" 
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
              onContactClick={() => {
                window.open('https://calendly.com/randyellis/15min', '_blank')
              }}
              className="w-full max-w-md mx-auto"
            />
          </div>

          {/* Copyright Footer */}
          <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t border-border/20 py-3">
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
