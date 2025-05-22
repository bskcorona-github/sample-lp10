"use client";

import { ReactNode, useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "framer-motion";

type ScrollAnimationProps = {
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
  initialVariant?:
    | "fadeIn"
    | "slideUp"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "none";
  threshold?: number;
};

// アニメーションバリアント
const animationVariants = {
  fadeIn: { opacity: 1, y: 0 },
  slideUp: { opacity: 1, y: 0 },
  slideLeft: { opacity: 1, x: 0 },
  slideRight: { opacity: 1, x: 0 },
  zoomIn: { opacity: 1, scale: 1 },
  none: { opacity: 1 },
};

// アニメーションの初期状態
const getInitialState = (variant: string) => {
  switch (variant) {
    case "fadeIn":
      return { opacity: 0, y: 20 };
    case "slideUp":
      return { opacity: 0, y: 100 };
    case "slideLeft":
      return { opacity: 0, x: 100 };
    case "slideRight":
      return { opacity: 0, x: -100 };
    case "zoomIn":
      return { opacity: 0, scale: 0.8 };
    default:
      return { opacity: 1 };
  }
};

export default function ScrollAnimation({
  children,
  duration = 0.5,
  delay = 0,
  className = "",
  initialVariant = "fadeIn",
  threshold = 0.1,
}: ScrollAnimationProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  useEffect(() => {
    if (isInView) {
      controls.start(
        animationVariants[initialVariant as keyof typeof animationVariants]
      );
    }
  }, [controls, isInView, initialVariant]);

  return (
    <motion.div
      ref={ref}
      initial={getInitialState(initialVariant)}
      animate={controls}
      transition={{
        duration,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
