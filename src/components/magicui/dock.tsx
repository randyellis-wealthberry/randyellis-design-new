"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  motion,
  MotionProps,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import React, { PropsWithChildren, useRef } from "react";

import { cn } from "@/lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  className?: string;
  iconSize?: number;
  iconMagnification?: number;
  iconDistance?: number;
  direction?: "top" | "middle" | "bottom" | "left" | "center" | "right";
  layout?: "row" | "column";
  fixed?: boolean;
  position?: "left" | "right" | "center" | "top" | "bottom";
  role?: string;
  "aria-label"?: string;
  children: React.ReactNode;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const dockVariants = cva(
  "supports-backdrop-blur:bg-white/10 supports-backdrop-blur:dark:bg-black/10 flex border backdrop-blur-md",
  {
    variants: {
      layout: {
        row: "flex-row items-center justify-center gap-6 h-[58px] w-max mx-auto mt-8 rounded-2xl p-2",
        column: "flex-col justify-center items-center gap-4 w-[58px] h-max py-4 px-2 rounded-2xl",
      },
      fixed: {
        true: "fixed z-50",
        false: "",
      },
      position: {
        left: "left-4 top-1/2 -translate-y-1/2",
        right: "right-4 top-1/2 -translate-y-1/2", 
        center: "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        top: "top-4 left-1/2 -translate-x-1/2",
        bottom: "bottom-4 left-1/2 -translate-x-1/2",
      },
    },
  }
);

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      className,
      children,
      iconSize = DEFAULT_SIZE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      direction = "middle",
      layout = "row",
      fixed = false,
      position = "left",
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);
    const mouseY = useMotionValue(Infinity);
    
    // Use mouseY for column layout, mouseX for row layout
    const mousePosition = layout === "column" ? mouseY : mouseX;

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (
          React.isValidElement<DockIconProps>(child) &&
          child.type === DockIcon
        ) {
          return React.cloneElement(child, {
            ...child.props,
            mousePosition: mousePosition,
            mouseX: mouseX, // Keep for backward compatibility
            size: iconSize,
            magnification: iconMagnification,
            distance: iconDistance,
            layout: layout,
          });
        }
        return child;
      });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (layout === "column") {
        mouseY.set(e.pageY);
      } else {
        mouseX.set(e.pageX);
      }
    };

    const handleMouseLeave = () => {
      mouseX.set(Infinity);
      mouseY.set(Infinity);
    };

    return (
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="navigation"
        {...props}
        className={cn(
          dockVariants({ 
            layout, 
            fixed: fixed ? true : false,
            position: fixed ? position : undefined 
          }),
          className,
          // Direction-specific alignment for row layout
          layout === "row" && {
            "items-start": direction === "top",
            "items-center": direction === "middle", 
            "items-end": direction === "bottom",
          },
          // Direction-specific alignment for column layout
          layout === "column" && {
            "justify-start": direction === "left",
            "justify-center": direction === "center", 
            "justify-end": direction === "right",
          }
        )}
      >
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps
  extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children" | "layout"> {
  size?: number;
  magnification?: number;
  distance?: number;
  mousePosition?: MotionValue<number>;
  mouseX?: MotionValue<number>; // Keep for backward compatibility
  layout?: "row" | "column";
  className?: string;
  children?: React.ReactNode;
  props?: PropsWithChildren;
}

const DockIcon = ({
  size = DEFAULT_SIZE,
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mousePosition,
  mouseX, // Backward compatibility
  layout = "row",
  className,
  children,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouse = useMotionValue(Infinity);

  // Use new mousePosition prop, fallback to mouseX for backward compatibility
  const activeMouse = mousePosition || mouseX || defaultMouse;

  const distanceCalc = useTransform(activeMouse, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, y: 0, width: 0, height: 0 };
    
    if (layout === "column") {
      // For vertical layout, calculate distance from center Y
      return val - bounds.y - bounds.height / 2;
    } else {
      // For horizontal layout, calculate distance from center X
      return val - bounds.x - bounds.width / 2;
    }
  });

  const sizeTransform = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [size, magnification, size],
  );

  const scaleSize = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <motion.div
      ref={ref}
      style={{ width: scaleSize, height: scaleSize, padding }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
