"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
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
  reducedMotionOnMobile?: boolean;
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
const getInitialState = (
  variant: string,
  isMobile: boolean,
  reducedMotion: boolean
) => {
  // モバイルかつ軽減モードの場合は効果を弱める
  const mobileFactor = isMobile && reducedMotion ? 0.5 : 1;

  switch (variant) {
    case "fadeIn":
      return { opacity: 0, y: 20 * mobileFactor };
    case "slideUp":
      return { opacity: 0, y: 100 * mobileFactor };
    case "slideLeft":
      return { opacity: 0, x: 100 * mobileFactor };
    case "slideRight":
      return { opacity: 0, x: -100 * mobileFactor };
    case "zoomIn":
      return { opacity: 0, scale: 0.9 + 0.1 * (1 - mobileFactor) };
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
  reducedMotionOnMobile = true,
}: ScrollAnimationProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  const [isMobile, setIsMobile] = useState(false);

  // 画面幅を検出
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (isInView) {
      controls.start(
        animationVariants[initialVariant as keyof typeof animationVariants]
      );
    }
  }, [controls, isInView, initialVariant]);

  // モバイルの場合はアニメーション時間を短縮
  const adjustedDuration =
    isMobile && reducedMotionOnMobile ? duration * 0.7 : duration;
  const adjustedDelay = isMobile && reducedMotionOnMobile ? delay * 0.5 : delay;

  return (
    <motion.div
      ref={ref}
      initial={getInitialState(initialVariant, isMobile, reducedMotionOnMobile)}
      animate={controls}
      transition={{
        duration: adjustedDuration,
        delay: adjustedDelay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
