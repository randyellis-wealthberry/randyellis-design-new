import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils"
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";

interface HeroPillProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  text: string
  className?: string
  /**
   * @default true
   */
  animate?: boolean
}

export function HeroPill({
  icon,
  text,
  className,
  animate = true,
  ...props
}: HeroPillProps) {
  return (
    <div
      className={cn("mb-4", animate && "animate-slide-up-fade", className)}
      {...props}
    >
      <p className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-white/10 backdrop-blur-[1px] px-3 py-1 text-sm font-medium text-white hover:bg-white/20 transition-colors">
        {icon && (
          <span className="mr-2 flex shrink-0 border-r border-white/20 pr-2">
            {icon}
          </span>
        )}
        {text}
      </p>
    </div>
  )
}

interface AnimatedHeroPillProps {
  className?: string;
  onClick?: () => void;
}

export function AnimatedHeroPill({ className, onClick }: AnimatedHeroPillProps) {
  return (
    <div className={cn("z-10 flex items-center justify-center", className)}>
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
        )}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
      >
        <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
          <span>✨ Available for projects</span>
          <ArrowRightIcon className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
        </AnimatedShinyText>
      </div>
    </div>
  );
}

export function StarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={12}
      height={12}
      fill="none"
      className="transition-transform group-hover:scale-110 duration-300"
    >
      <path
        className="fill-white"
        d="M6.958.713a1 1 0 0 0-1.916 0l-.999 3.33-3.33 1a1 1 0 0 0 0 1.915l3.33.999 1 3.33a1 1 0 0 0 1.915 0l.999-3.33 3.33-1a1 1 0 0 0 0-1.915l-3.33-.999-1-3.33Z"
      />
    </svg>
  )
}

export function HeroPillDemo() {
  return (
    <div className="space-y-4">
      <HeroPill icon={<StarIcon />} text="New releases every week" />

      <HeroPill
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            className="fill-zinc-500"
          >
            <path d="M12 2L1 21h22L12 2z" />
          </svg>
        }
        text="Custom Icon Pill"
      />
    </div>
  )
}
