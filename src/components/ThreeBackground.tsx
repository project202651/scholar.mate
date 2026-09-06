"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  theme?: "dark" | "light";
}

export default function ThreeBackground({ theme = "dark" }: ThreeBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 45;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // Refined Architectural Coordinate Field
    const count = 75;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 85;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 65;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 35;

      velocities.push({
        x: (Math.random() - 0.5) * 0.018,
        y: (Math.random() - 0.5) * 0.018,
        z: (Math.random() - 0.5) * 0.01,
      });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Subtle Monochromatic Architectural Palette
    const material = new THREE.PointsMaterial({
      color: theme === "light" ? 0x0284c7 : 0x38bdf8,
      size: theme === "light" ? 1.6 : 2.0,
      transparent: true,
      opacity: theme === "light" ? 0.22 : 0.4,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Smooth Mouse Movement Response
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 6;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 6;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      const pos = geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3] += velocities[i].x;
        pos[i * 3 + 1] += velocities[i].y;
        pos[i * 3 + 2] += velocities[i].z;

        if (Math.abs(pos[i * 3]) > 45) velocities[i].x *= -1;
        if (Math.abs(pos[i * 3 + 1]) > 35) velocities[i].y *= -1;
        if (Math.abs(pos[i * 3 + 2]) > 20) velocities[i].z *= -1;
      }
      geometry.attributes.position.needsUpdate = true;

      camera.position.x += (mouseX - camera.position.x) * 0.015;
      camera.position.y += (-mouseY - camera.position.y) * 0.015;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10 h-full w-full opacity-60 dark:opacity-75"
    />
  );
}
