"use client";

import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

type ParallaxProps = {
  children: ReactNode;
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  containerClassName?: string;
};

export default function Parallax({
  children,
  speed = 0.5,
  direction = "up",
  className = "",
  containerClassName = "",
}: ParallaxProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const value = 100 * speed;

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

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div style={{ y, x }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}
