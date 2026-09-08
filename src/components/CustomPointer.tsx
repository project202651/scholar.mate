'use client';

import React, { useEffect, useState, useRef } from 'react';

interface CustomPointerProps {
  theme?: 'dark' | 'light';
}

export default function CustomPointer({ theme = 'dark' }: CustomPointerProps) {
  const [enabled, setEnabled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const animFrameId = useRef<number | null>(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    // Only enable on fine pointer devices (desktops/laptops, not touchscreens)
    const isTouch = 
      typeof window !== 'undefined' && 
      (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0));

    if (isTouch) {
      setEnabled(false);
      return;
    }

    prefersReducedMotion.current = 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsHovered(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'button, a, input, textarea, select, [role="button"], [tabindex="0"], [data-interactive="true"], .cursor-pointer, canvas'
      );
      setIsHovered(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Smooth Lerp Animation Loop for Trailing Ring
    const render = () => {
      if (!prefersReducedMotion.current) {
        const ease = 0.18;
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * ease;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * ease;
      } else {
        ringPos.current.x = mousePos.current.x;
        ringPos.current.y = mousePos.current.y;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isVisible]);

  if (!enabled) return null;

  const isDark = theme === 'dark';

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
      aria-hidden="true"
    >
      {/* 1. Subtle Ambient Cursor Spotlight */}
      <div
        ref={glowRef}
        className={`fixed top-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 ${
          isDark 
            ? 'bg-[#54d6c7]/[0.05]' 
            : 'bg-[#0d9488]/[0.04]'
        }`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />

      {/* 2. Trailing Circular Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 rounded-full border pointer-events-none transition-all duration-200 ease-out ${
          isHovered
            ? isDark
              ? 'w-11 h-11 border-[#54d6c7] bg-[#54d6c7]/15 shadow-[0_0_15px_rgba(84,214,199,0.35)]'
              : 'w-11 h-11 border-[#0d9488] bg-[#0d9488]/15 shadow-[0_0_12px_rgba(13,148,136,0.3)]'
            : isDark
            ? 'w-7 h-7 border-[#54d6c7]/60 bg-[#54d6c7]/5'
            : 'w-7 h-7 border-[#0d9488]/60 bg-[#0d9488]/5'
        } ${isClicking ? 'scale-75 opacity-90' : 'scale-100'}`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />

      {/* 3. Snappy Glowing Pointer Dot */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 rounded-full pointer-events-none transition-transform duration-75 ${
          isHovered ? 'w-2 h-2 opacity-60' : 'w-1.5 h-1.5 opacity-100'
        } ${
          isDark
            ? 'bg-[#54d6c7] shadow-[0_0_8px_#54d6c7]'
            : 'bg-[#0d9488] shadow-[0_0_8px_#0d9488]'
        } ${isClicking ? 'scale-150' : 'scale-100'}`}
        style={{ transform: 'translate3d(-100px, -100px, 0) translate(-50%, -50%)' }}
      />
    </div>
  );
}
