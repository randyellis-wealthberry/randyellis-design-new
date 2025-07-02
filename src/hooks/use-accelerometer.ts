import { useState, useEffect, useCallback } from 'react'

interface AccelerometerData {
  x: number
  y: number
  z: number
}

interface UseAccelerometerReturn {
  data: AccelerometerData
  isSupported: boolean
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
}

const DEFAULT_DATA: AccelerometerData = { x: 0, y: 0, z: 0 }

export function useAccelerometer(): UseAccelerometerReturn {
  const [data, setData] = useState<AccelerometerData>(DEFAULT_DATA)
  const [isSupported, setIsSupported] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false

    console.log('📱 Accelerometer: Requesting permission...')

    // Check if DeviceOrientationEvent exists and has requestPermission method
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        console.log('📱 Accelerometer: iOS permission request needed')
        const permission = await (DeviceOrientationEvent as any).requestPermission()
        const granted = permission === 'granted'
        console.log('📱 Accelerometer: iOS permission result:', permission)
        setHasPermission(granted)
        return granted
      } catch (error) {
        console.warn('Error requesting device orientation permission:', error)
        return false
      }
    }

    // For non-iOS devices, assume permission is granted if supported
    if (typeof DeviceOrientationEvent !== 'undefined') {
      console.log('📱 Accelerometer: Non-iOS device, granting permission')
      setHasPermission(true)
      return true
    }

    console.log('📱 Accelerometer: DeviceOrientationEvent not supported')
    return false
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if device orientation is supported
    const supported = typeof DeviceOrientationEvent !== 'undefined'
    console.log('📱 Accelerometer: Support check:', { 
      supported, 
      DeviceOrientationEvent: typeof DeviceOrientationEvent,
      hasRequestPermission: typeof (DeviceOrientationEvent as any)?.requestPermission
    })
    setIsSupported(supported)

    if (!supported) return

    // For non-iOS devices, automatically set permission to true
    if (typeof (DeviceOrientationEvent as any).requestPermission !== 'function') {
      console.log('📱 Accelerometer: Auto-granting permission for non-iOS device')
      setHasPermission(true)
    }

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      if (!hasPermission) {
        console.log('📱 Accelerometer: Event received but no permission')
        return
      }

      // Extract rotation values
      const alpha = event.alpha || 0 // Z axis (0-360)
      const beta = event.beta || 0   // X axis (-180 to 180)
      const gamma = event.gamma || 0 // Y axis (-90 to 90)

      // Normalize values for consistent behavior
      // Beta: front-to-back tilt (-180 to 180) -> normalize to -1 to 1
      // Gamma: left-to-right tilt (-90 to 90) -> normalize to -1 to 1
      const normalizedX = Math.max(-1, Math.min(1, gamma / 90))
      const normalizedY = Math.max(-1, Math.min(1, beta / 180))
      const normalizedZ = alpha / 360

      console.log('📱 Accelerometer: Raw values:', { alpha, beta, gamma })
      console.log('📱 Accelerometer: Normalized values:', { 
        x: normalizedX, 
        y: normalizedY, 
        z: normalizedZ 
      })

      setData({
        x: normalizedX,
        y: normalizedY,
        z: normalizedZ,
      })
    }

    if (hasPermission) {
      console.log('📱 Accelerometer: Adding event listener')
      window.addEventListener('deviceorientation', handleDeviceOrientation, true)
    }

    return () => {
      console.log('📱 Accelerometer: Removing event listener')
      window.removeEventListener('deviceorientation', handleDeviceOrientation, true)
    }
  }, [hasPermission])

  return {
    data,
    isSupported,
    hasPermission,
    requestPermission,
  }
}