import { useState } from "react"
import { Button } from "@/components/ui/button"
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
  FileText
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
        window.open('https://randyellis.design/portfolio', '_blank')
      }
    },
    {
      id: 'resume',
      icon: FileText,
      label: 'Resume',
      action: () => {
        window.open('https://randyellis.design/resume', '_blank')
      }
    },
    {
      id: 'contact',
      icon: Mail,
      label: 'Contact',
      action: () => {
        window.open('mailto:hello@randyellis.design', '_blank')
      }
    },
    {
      id: 'github',
      icon: Github,
      label: 'GitHub',
      action: () => {
        window.open('https://github.com/iamrandyellis', '_blank')
      }
    },
    {
      id: 'linkedin',
      icon: Linkedin,
      label: 'LinkedIn',
      action: () => {
        window.open('https://linkedin.com/in/randyellis', '_blank')
      }
    }
  ]

  const handleIconClick = (item: typeof navigationItems[0]) => {
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
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="fixed top-6 right-6">
            <ThemeToggle />
          </div>
          


          {/* Main content with Dock above ProfileCard */}
          <div className="flex flex-col items-center gap-1">
            {/* Dock Navigation */}
            <Dock 
              className="bg-background/80 border-border/50 shadow-lg backdrop-blur-md"
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
              contactText="See Work"
              showUserInfo={true}
              enableTilt={true}
              onContactClick={() => {
                window.open('mailto:hello@randyellis.design', '_blank')
              }}
              className="w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </TooltipProvider>
    )
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}

export default App