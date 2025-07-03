"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

interface ModalContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <ModalContext.Provider value={{ open, setOpen }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export function Modal({ children }: { children: ReactNode }) {
  return <ModalProvider>{children}</ModalProvider>;
}

export const ModalTrigger = ({
  children,
  className,
  ...props
}: {
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { setOpen } = useModal();
  return (
    <button
      className={className}
      onClick={() => setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
};

export const ModalBody = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  const { open } = useModal();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      // Prevent iOS safari bounce
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [open]);

  const modalRef = useRef(null);
  const { setOpen } = useModal();
  useOutsideClick(modalRef, () => setOpen(false));

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            backdropFilter: "blur(10px)",
          }}
          exit={{
            opacity: 0,
            backdropFilter: "blur(0px)",
          }}
          className="fixed inset-0 h-full w-full flex items-center justify-center z-[9999] p-4 sm:p-6"
          style={{
            perspective: "800px",
            transformStyle: "preserve-3d",
          }}
        >
          <Overlay />

          <motion.div
            ref={modalRef}
            className={cn(
              // Mobile-first: full screen on small devices
              "w-full h-full max-h-[95vh] sm:w-auto sm:h-auto sm:min-h-[50%] sm:max-h-[90vh] sm:min-w-[400px] md:max-w-[500px] lg:max-w-[600px]",
              // Glassmorphic styling
              "bg-white/10 dark:bg-black/20 backdrop-blur-xl",
              "border border-white/20 dark:border-white/10",
              "sm:rounded-2xl lg:rounded-3xl",
              "relative z-50 flex flex-col overflow-hidden",
              // Enhanced shadows for floating effect
              "shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
              // Subtle inner glow
              "before:absolute before:inset-0 before:rounded-inherit before:bg-gradient-to-br before:from-white/5 before:to-transparent before:pointer-events-none",
              className
            )}
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 20,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <CloseIcon />
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export const ModalContent = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(
      "flex flex-col flex-1 p-6 sm:p-8 md:p-10 lg:p-12 overflow-y-auto",
      // Lightweight styling
      "relative",
      className
    )}>
      {children}
    </div>
  );
};

export const ModalFooter = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-center sm:justify-end gap-3 sm:gap-4 p-6 sm:p-8",
        // Glassmorphic footer
        "bg-white/5 dark:bg-black/10 backdrop-blur-sm",
        "border-t border-white/10 dark:border-white/5",
        "relative",
        // Subtle inner highlight
        "before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

const Overlay = ({ className }: { className?: string }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      animate={{
        opacity: 1,
        backdropFilter: "blur(20px)",
      }}
      exit={{
        opacity: 0,
        backdropFilter: "blur(0px)",
      }}
      className={cn(
        "fixed inset-0 h-full w-full z-40",
        "bg-gradient-to-br from-black/20 via-black/10 to-black/30",
        "dark:from-black/40 dark:via-black/20 dark:to-black/50",
        className
      )}
    />
  );
};

const CloseIcon = () => {
  const { setOpen } = useModal();
  return (
    <button
      onClick={() => setOpen(false)}
      className={cn(
        "absolute top-3 right-3 sm:top-4 sm:right-4 group z-10",
        "w-8 h-8 sm:w-9 sm:h-9 rounded-full",
        // Neumorphic styling
        "bg-white/20 dark:bg-black/20 backdrop-blur-sm",
        "border border-white/30 dark:border-white/10",
        // Neumorphic shadows
        "shadow-[inset_2px_2px_5px_rgba(255,255,255,0.2),inset_-2px_-2px_5px_rgba(0,0,0,0.1)]",
        "dark:shadow-[inset_2px_2px_5px_rgba(255,255,255,0.05),inset_-2px_-2px_5px_rgba(0,0,0,0.2)]",
        // Hover states
        "hover:bg-white/30 dark:hover:bg-black/30",
        "hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.3),inset_-1px_-1px_3px_rgba(0,0,0,0.2)]",
        "dark:hover:shadow-[inset_1px_1px_3px_rgba(255,255,255,0.1),inset_-1px_-1px_3px_rgba(0,0,0,0.3)]",
        "transition-all duration-200",
        "flex items-center justify-center"
      )}
      aria-label="Close modal"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gray-600/80 dark:text-gray-300/80 group-hover:text-gray-800 dark:group-hover:text-gray-100 transition-colors"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M18 6l-12 12" />
        <path d="M6 6l12 12" />
      </svg>
    </button>
  );
};

// Hook to detect clicks outside of a component.
// Add it in a separate file, I've added here for simplicity
export const useOutsideClick = (
  ref: React.RefObject<HTMLDivElement>,
  callback: (event: MouseEvent | TouchEvent) => void
) => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // DO NOTHING if the element being clicked is the target element or their children
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      callback(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, callback]);
};
