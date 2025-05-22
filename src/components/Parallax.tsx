"use client";

import { ReactNode, useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  containerClassName?: string;
  disableOnMobile?: boolean;
};

export default function Parallax({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  containerClassName = "",
  disableOnMobile = true,
}: ParallaxProps) {
  const ref = useRef(null);
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

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // モバイルの場合は効果を弱める
  const effectSpeed = isMobile && disableOnMobile ? speed * 0.3 : speed;
  const value = 100 * effectSpeed;

  // すべての変換関数を最初に定義
  const yUp = useTransform(scrollYProgress, [0, 1], [value, -value]);
  const yDown = useTransform(scrollYProgress, [0, 1], [-value, value]);
  const xLeft = useTransform(scrollYProgress, [0, 1], [value, -value]);
  const xRight = useTransform(scrollYProgress, [0, 1], [-value, value]);
  const zero = useTransform(scrollYProgress, [0, 1], [0, 0]);

  // 適切な変換を選択
  let y = zero;
  let x = zero;

  if (direction === "up") {
    y = yUp;
  } else if (direction === "down") {
    y = yDown;
  } else if (direction === "left") {
    x = xLeft;
  } else if (direction === "right") {
    x = xRight;
  }

  // モバイルでは効果を無効にする
  if (isMobile && disableOnMobile) {
    const disabledClass = `${className} transform-none`;
    return (
      <div
        ref={ref}
        className={`relative overflow-hidden ${containerClassName}`}
      >
        <div className={disabledClass}>{children}</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div style={{ y, x }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
