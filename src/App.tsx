import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Onboarding } from "@/components/Onboarding"
import ProfileCard from "@/components/ProfileCard/ProfileCard"

function App() {
  const [showMainApp, setShowMainApp] = useState(() => {
    return localStorage.getItem('phion-onboarding-completed') === 'true'
  })


  const handleOnboardingComplete = () => {
    localStorage.setItem('phion-onboarding-completed', 'true')
    setShowMainApp(true)
  }


  if (showMainApp) {
    return (
      <TooltipProvider>
        <div className="min-h-screen bg-background flex items-center justify-center p-8">
          <div className="fixed top-6 right-6">
            <ThemeToggle />
          </div>
          
          <div className="fixed bottom-6 left-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.removeItem('phion-onboarding-completed')
                window.location.reload()
              }}
            >
              Reset Onboarding
            </Button>
          </div>

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
      </TooltipProvider>
    )
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}

export default App