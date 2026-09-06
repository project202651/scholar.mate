"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [hoverType, setHoverType] = useState<"button" | "input" | "link" | "card" | "none">("none");

  // High precision mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth lagging spring physics for glowing outer aura
  const auraX = useSpring(mouseX, { stiffness: 180, damping: 24, mass: 0.6 });
  const auraY = useSpring(mouseY, { stiffness: 180, damping: 24, mass: 0.6 });

  // Tight responsive spring for cursor ring
  const ringX = useSpring(mouseX, { stiffness: 500, damping: 32, mass: 0.2 });
  const ringY = useSpring(mouseY, { stiffness: 500, damping: 32, mass: 0.2 });

  useEffect(() => {
    // Only enable on desktop/pointing devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const button = target.closest("button");
      const link = target.closest("a");
      const input = target.closest("input, select, textarea");
      const card = target.closest(".group, [class*='rounded-3xl'], [class*='rounded-2xl']");

      if (button) {
        setIsHovered(true);
        setHoverType("button");
      } else if (link) {
        setIsHovered(true);
        setHoverType("link");
      } else if (input) {
        setIsHovered(true);
        setHoverType("input");
      } else if (card) {
        setIsHovered(true);
        setHoverType("card");
      } else {
        setIsHovered(false);
        setHoverType("none");
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mouseover", onMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isVisible, mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. Sleek Fluid Precision Ring */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.85 : isHovered ? 1.4 : 1,
          width: isHovered && hoverType === "input" ? 22 : isHovered ? 40 : 26,
          height: isHovered && hoverType === "input" ? 32 : isHovered ? 40 : 26,
          borderRadius: isHovered && hoverType === "input" ? "4px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="fixed top-0 left-0 border border-slate-400/60 dark:border-cyan-400/60 bg-transparent shadow-[0_0_10px_rgba(2,132,199,0.15)] dark:shadow-[0_0_12px_rgba(6,182,212,0.3)]"
      />

      {/* 2. Precision Center Dot */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 1.6 : isHovered ? 0.5 : 1,
          opacity: isHovered && hoverType === "input" ? 0.2 : 1,
        }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-slate-700 dark:bg-cyan-300"
      />
    </div>
  );
}
