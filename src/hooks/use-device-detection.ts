import { useState, useEffect } from 'react'

interface DeviceCapabilities {
  isTouchDevice: boolean
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  hasAccelerometer: boolean
  hasGyroscope: boolean
  userAgent: string
}

const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

export function useDeviceDetection(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isTouchDevice: false,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hasAccelerometer: false,
    hasGyroscope: false,
    userAgent: '',
  })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateCapabilities = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      const screenWidth = window.innerWidth
      
      // Touch detection
      const isTouchDevice = 
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0

      // Screen size based detection
      const isMobile = screenWidth < MOBILE_BREAKPOINT
      const isTablet = screenWidth >= MOBILE_BREAKPOINT && screenWidth < TABLET_BREAKPOINT && isTouchDevice

      // Device orientation/accelerometer support
      const hasAccelerometer = typeof DeviceOrientationEvent !== 'undefined'
      
      // Gyroscope support (more specific)
      const hasGyroscope = 
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof (DeviceMotionEvent as any).requestPermission !== 'undefined'

      // Additional mobile/tablet detection via user agent
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const tabletRegex = /ipad|android(?!.*mobile)|tablet/i
      
      const isMobileUA = mobileRegex.test(userAgent)
      const isTabletUA = tabletRegex.test(userAgent)

      // Combine screen size and user agent detection
      const finalIsMobile = (isMobile && isTouchDevice) || (isMobileUA && !isTabletUA)
      const finalIsTablet = (isTablet) || (isTabletUA) || (isTouchDevice && screenWidth >= MOBILE_BREAKPOINT && screenWidth < TABLET_BREAKPOINT)
      const finalIsDesktop = !finalIsMobile && !finalIsTablet

      setCapabilities({
        isTouchDevice,
        isMobile: finalIsMobile,
        isTablet: finalIsTablet,
        isDesktop: finalIsDesktop,
        hasAccelerometer,
        hasGyroscope,
        userAgent,
      })
    }

    // Initial detection
    updateCapabilities()

    // Update on resize
    const handleResize = () => {
      updateCapabilities()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return capabilities
}