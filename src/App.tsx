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
            avatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            miniAvatarUrl="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80"
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
            className="w-full max-w-sm mx-auto"
          />
        </div>
      </TooltipProvider>
    )
  }

  return <Onboarding onComplete={handleOnboardingComplete} />
}

export default App