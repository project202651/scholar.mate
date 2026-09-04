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
      {/* 1. Trailing Ambient Soft Light Aura */}
      <motion.div
        style={{
          x: auraX,
          y: auraY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="fixed top-0 left-0 w-44 h-44 rounded-full bg-gradient-to-tr from-cyan-400/20 via-sky-400/15 to-indigo-500/15 blur-2xl dark:from-cyan-500/25 dark:via-indigo-500/20 dark:to-purple-500/15"
      />

      {/* 2. Sleek Fluid Cursor Ring with Specular Border */}
      <motion.div
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 0.8 : isHovered ? 1.5 : 1,
          width: isHovered && hoverType === "input" ? 24 : isHovered ? 44 : 30,
          height: isHovered && hoverType === "input" ? 34 : isHovered ? 44 : 30,
          borderRadius: isHovered && hoverType === "input" ? "6px" : "9999px",
        }}
        transition={{ type: "spring", stiffness: 450, damping: 28 }}
        className="fixed top-0 left-0 border border-sky-400/70 dark:border-cyan-400/70 bg-sky-400/10 dark:bg-cyan-400/10 backdrop-blur-[2px] shadow-[0_0_15px_rgba(56,189,248,0.3)] dark:shadow-[0_0_18px_rgba(6,182,212,0.4)]"
      />

      {/* 3. Ultra-Crisp Precision Dot with Harmonic Glow */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 2 : isHovered ? 0.6 : 1,
          opacity: isHovered && hoverType === "input" ? 0.3 : 1,
        }}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-sky-500 dark:bg-cyan-300 shadow-[0_0_8px_#0284c7] dark:shadow-[0_0_10px_#22d3ee]"
      />
    </div>
  );
}
