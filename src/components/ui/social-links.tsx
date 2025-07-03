import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type Social = {
  name: string;
  image: string;
};

interface AnimatedSocialLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  socials: Social[];
}

const AnimatedSocialLinks = React.forwardRef<
  HTMLDivElement,
  AnimatedSocialLinksProps
>(({ socials, className: _className, ...props }, ref) => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [cliked, setCliked] = useState<boolean>(false);

  const animation = {
    scale: cliked ? [1, 1.3, 1] : 1,
    transition: { duration: 0.3 },
  };

  useEffect(() => {
    const handleClick = () => {
      setCliked(true);
      setTimeout(() => {
        setCliked(false);
      }, 200);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [cliked]);

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-0"
      {...props}
    >
      {socials.map((social, index) => (
        <div
          className={`relative cursor-pointer px-5 py-2 transition-opacity duration-200 ${
            hoveredSocial && hoveredSocial !== social.name
              ? 'opacity-50'
              : 'opacity-100'
          }`}
          key={index}
          onMouseEnter={() => {
            setHoveredSocial(social.name);
            setRotation(Math.random() * 20 - 10);
          }}
          onMouseLeave={() => setHoveredSocial(null)}
          onClick={() => {
            setCliked(true);
          }}
        >
          <span className="block text-lg text-foreground">{social.name}</span>
          <AnimatePresence>
            {hoveredSocial === social.name && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 flex h-full w-full items-center justify-center"
                animate={animation}
              >
                <motion.img
                  key={social.name}
                  src={social.image}
                  alt={social.name}
                  className="size-16"
                  initial={{
                    y: -40,
                    rotate: rotation,
                    opacity: 0,
                    filter: 'blur(2px)',
                  }}
                  animate={{ y: -50, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -40, opacity: 0, filter: 'blur(2px)' }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
});

AnimatedSocialLinks.displayName = 'AnimatedSocialLinks';

export default AnimatedSocialLinks;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export const XIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = "",
  ...props 
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M17.751 3h3.067l-6.7 7.625L22 21h-6.172l-4.833-6.293L5.464 21H2.395l7.167-8.155L2 3h6.328l4.37 5.752L17.751 3zm-1.076 16.172h1.7L7.404 4.732H5.58l11.095 14.44z"
      fill="currentColor"
      strokeWidth="0"
    />
  </svg>
)
