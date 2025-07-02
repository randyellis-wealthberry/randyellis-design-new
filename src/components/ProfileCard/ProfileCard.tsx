/*
	Installed from https://reactbits.dev/ts/default/
*/

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import "./ProfileCard.css";
import { useAccelerometer, useDeviceDetection } from "@/hooks";

interface ProfileCardProps {
  avatarUrl: string;
  iconUrl?: string;
  grainUrl?: string;
  behindGradient?: string;
  innerGradient?: string;
  showBehindGradient?: boolean;
  className?: string;
  enableTilt?: boolean;
  enableAccelerometer?: boolean;
  accelerometerSensitivity?: number;
  miniAvatarUrl?: string;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
}

const DEFAULT_BEHIND_GRADIENT =
  "radial-gradient(farthest-side circle at var(--pointer-x) var(--pointer-y),hsla(266,40%,70%,calc(var(--card-opacity)*0.3)) 8%,hsla(266,30%,60%,calc(var(--card-opacity)*0.2)) 20%,hsla(266,20%,50%,calc(var(--card-opacity)*0.1)) 60%,hsla(266,0%,40%,0) 100%),radial-gradient(35% 52% at 55% 20%,rgba(96,165,250,0.2) 0%,transparent 100%),radial-gradient(100% 100% at 50% 50%,rgba(139,92,246,0.15) 1%,transparent 76%),conic-gradient(from 124deg at 50% 50%,rgba(167,139,250,0.1) 0%,rgba(96,165,250,0.1) 40%,rgba(96,165,250,0.1) 60%,rgba(167,139,250,0.1) 100%)";

const DEFAULT_INNER_GRADIENT =
  "linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)";

const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
} as const;

const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(Math.max(value, min), max);

const round = (value: number, precision = 3): number =>
  parseFloat(value.toFixed(precision));

const adjust = (
  value: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number
): number =>
  round(toMin + ((toMax - toMin) * (value - fromMin)) / (fromMax - fromMin));

const easeInOutCubic = (x: number): number =>
  x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;

const ProfileCardComponent: React.FC<ProfileCardProps> = ({
  avatarUrl = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=580&q=80",
  iconUrl,
  grainUrl,
  behindGradient,
  innerGradient,
  showBehindGradient = true,
  className = "",
  enableTilt = true,
  enableAccelerometer = false,
  accelerometerSensitivity = 1,
  miniAvatarUrl,
  name = "Randy Ellis",
  title = "Senior Front-End Developer",
  handle = "randyellis",
  status = "Available",
  contactText = "Contact",
  showUserInfo = true,
  onContactClick,
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Device detection and accelerometer hooks
  const deviceCapabilities = useDeviceDetection();
  const accelerometer = useAccelerometer();
  
  // Determine if accelerometer should be active
  const shouldUseAccelerometer = enableAccelerometer && 
    (deviceCapabilities.isMobile || deviceCapabilities.isTablet) && 
    deviceCapabilities.hasAccelerometer &&
    accelerometer.isSupported;

  // Debug logging
  console.log('🎴 ProfileCard: Accelerometer decision:', {
    enableAccelerometer,
    isMobile: deviceCapabilities.isMobile,
    isTablet: deviceCapabilities.isTablet,
    hasAccelerometer: deviceCapabilities.hasAccelerometer,
    accelerometerSupported: accelerometer.isSupported,
    accelerometerPermission: accelerometer.hasPermission,
    shouldUseAccelerometer,
    accelerometerData: accelerometer.data
  })

  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;

    let rafId: number | null = null;

    const updateCardTransform = (
      offsetX: number,
      offsetY: number,
      card: HTMLElement,
      wrap: HTMLElement,
      isAccelerometerInput = false
    ) => {
      const width = card.clientWidth;
      const height = card.clientHeight;

      let percentX: number;
      let percentY: number;

      if (isAccelerometerInput) {
        // For accelerometer input, offsetX and offsetY are normalized values (-1 to 1)
        // Convert to percentage (0 to 100)
        percentX = clamp(((offsetX + 1) / 2) * 100);
        percentY = clamp(((offsetY + 1) / 2) * 100);
      } else {
        // For pointer input, use existing logic
        percentX = clamp((100 / width) * offsetX);
        percentY = clamp((100 / height) * offsetY);
      }

      const centerX = percentX - 50;
      const centerY = percentY - 50;

      const rotationMultiplier = isAccelerometerInput ? accelerometerSensitivity : 1;

      const properties = {
        "--pointer-x": `${percentX}%`,
        "--pointer-y": `${percentY}%`,
        "--background-x": `${adjust(percentX, 0, 100, 35, 65)}%`,
        "--background-y": `${adjust(percentY, 0, 100, 35, 65)}%`,
        "--pointer-from-center": `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        "--pointer-from-top": `${percentY / 100}`,
        "--pointer-from-left": `${percentX / 100}`,
        "--rotate-x": `${round(-(centerX / 5) * rotationMultiplier)}deg`,
        "--rotate-y": `${round((centerY / 4) * rotationMultiplier)}deg`,
      };

      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };

    const createSmoothAnimation = (
      duration: number,
      startX: number,
      startY: number,
      card: HTMLElement,
      wrap: HTMLElement
    ) => {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;

      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);

        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);

        updateCardTransform(currentX, currentY, card, wrap);

        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };

      rafId = requestAnimationFrame(animationLoop);
    };

    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      },
    };
  }, [enableTilt, accelerometerSensitivity]);

  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );

  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap || !animationHandlers) return;

    animationHandlers.cancelAnimation();
    wrap.classList.add("active");
    card.classList.add("active");
  }, [animationHandlers]);

  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;

      if (!card || !wrap || !animationHandlers) return;

      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove("active");
      card.classList.remove("active");
    },
    [animationHandlers]
  );

  // Accelerometer effect
  useEffect(() => {
    if (!shouldUseAccelerometer || !animationHandlers || !accelerometer.hasPermission) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    // Apply accelerometer data to card transform
    const { x, y } = accelerometer.data;
    
    // Invert Y axis for natural tilt behavior (device tilt forward = card tilt forward)
    animationHandlers.updateCardTransform(
      x, 
      -y, 
      card, 
      wrap, 
      true // isAccelerometerInput
    );

    // Set active state for accelerometer mode
    wrap.classList.add("active");
    card.classList.add("active");

  }, [accelerometer.data, shouldUseAccelerometer, animationHandlers, accelerometer.hasPermission]);

  // Auto-request accelerometer permission on supported devices
  useEffect(() => {
    if (shouldUseAccelerometer && !accelerometer.hasPermission && accelerometer.isSupported) {
      console.log('🎴 ProfileCard: Auto-requesting accelerometer permission')
      accelerometer.requestPermission().catch(console.warn);
    }
  }, [shouldUseAccelerometer, accelerometer.hasPermission, accelerometer.isSupported, accelerometer.requestPermission]);

  // Manual permission request handler for debugging
  const handleRequestPermission = useCallback(async () => {
    console.log('🎴 ProfileCard: Manual permission request triggered')
    try {
      const granted = await accelerometer.requestPermission()
      console.log('🎴 ProfileCard: Manual permission result:', granted)
    } catch (error) {
      console.error('🎴 ProfileCard: Manual permission error:', error)
    }
  }, [accelerometer.requestPermission])

  useEffect(() => {
    if (!enableTilt || !animationHandlers || shouldUseAccelerometer) return;

    const card = cardRef.current;
    const wrap = wrapRef.current;

    if (!card || !wrap) return;

    const pointerMoveHandler = handlePointerMove as EventListener;
    const pointerEnterHandler = handlePointerEnter as EventListener;
    const pointerLeaveHandler = handlePointerLeave as EventListener;

    card.addEventListener("pointerenter", pointerEnterHandler);
    card.addEventListener("pointermove", pointerMoveHandler);
    card.addEventListener("pointerleave", pointerLeaveHandler);

    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;

    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );

    return () => {
      card.removeEventListener("pointerenter", pointerEnterHandler);
      card.removeEventListener("pointermove", pointerMoveHandler);
      card.removeEventListener("pointerleave", pointerLeaveHandler);
      animationHandlers.cancelAnimation();
    };
  }, [
    enableTilt,
    animationHandlers,
    handlePointerMove,
    handlePointerEnter,
    handlePointerLeave,
    shouldUseAccelerometer,
  ]);

  const cardStyle = useMemo(
    () =>
      ({
        "--icon": iconUrl ? `url(${iconUrl})` : "none",
        "--grain": grainUrl ? `url(${grainUrl})` : "none",
        "--behind-gradient": showBehindGradient
          ? (behindGradient ?? DEFAULT_BEHIND_GRADIENT)
          : "none",
        "--inner-gradient": innerGradient ?? DEFAULT_INNER_GRADIENT,
      }) as React.CSSProperties,
    [iconUrl, grainUrl, showBehindGradient, behindGradient, innerGradient]
  );

  const handleContactClick = useCallback(() => {
    onContactClick?.();
  }, [onContactClick]);

  return (
    <div
      ref={wrapRef}
      className={`pc-card-wrapper ${className}`.trim()}
      style={cardStyle}
    >
      <section ref={cardRef} className="pc-card">
        <div className="pc-inside">
          <div className="pc-shine" />
          <div className="pc-glare" />
          <div className="pc-content pc-avatar-content">
            <img
              className="avatar"
              src={avatarUrl}
              alt={`${name || "User"} avatar`}
              loading="lazy"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
            {showUserInfo && (
              <div className="pc-user-info">
                <div className="pc-user-details">
                  <div className="pc-mini-avatar">
                    <img
                      src={miniAvatarUrl || avatarUrl}
                      alt={`${name || "User"} mini avatar`}
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.opacity = "0.5";
                        target.src = avatarUrl;
                      }}
                    />
                  </div>
                  <div className="pc-user-text">
                    <div className="pc-handle">@{handle}</div>
                    <div className="pc-status">{status}</div>
                  </div>
                </div>
                <div className="pc-actions">
                  <button
                    className="pc-contact-btn"
                    onClick={handleContactClick}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleContactClick();
                      }
                    }}
                    style={{ pointerEvents: "auto" }}
                    type="button"
                    aria-label={`Contact ${name || "user"}`}
                    tabIndex={0}
                  >
                    {contactText}
                  </button>
                </div>
              </div>
            )}
            
            {/* Debug button for accelerometer on supported devices */}
            {enableAccelerometer && accelerometer.isSupported && !accelerometer.hasPermission && (
              <div className="pc-debug-controls" style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                zIndex: 10,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '8px',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)'
              }}>
                <button
                  onClick={handleRequestPermission}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  Enable Tilt
                </button>
                <div style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.8)', marginTop: '4px' }}>
                  Tap to enable motion
                </div>
              </div>
            )}
          </div>
          <div className="pc-content">
            <div className="pc-details">
              <h3>{name}</h3>
              <p>{title}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);

export default ProfileCard;
