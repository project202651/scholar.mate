"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeStudyOrb() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for mouse rotation
    const group = new THREE.Group();
    scene.add(group);

    // Inner Icosahedron (Core Knowledge Orb)
    const geometry = new THREE.IcosahedronGeometry(1.6, 2);
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
    });
    const icosahedron = new THREE.Mesh(geometry, material);
    group.add(icosahedron);

    // Inner glowing solid core
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 3);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Cyan glow
      wireframe: false,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Outer Orbiting Ring 1
    const torusGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 100);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7, // Purple
      emissive: 0x6b21a8,
      roughness: 0.3,
    });
    const ring1 = new THREE.Mesh(torusGeo, torusMat);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    // Outer Orbiting Ring 2
    const ring2 = new THREE.Mesh(torusGeo, torusMat);
    ring2.rotation.y = Math.PI / 3;
    group.add(ring2);

    // Ambient floating particles
    const particleCount = 200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 3, 50);
    pointLight.position.set(4, 4, 4);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xa855f7, 2, 50);
    pointLight2.position.set(-4, -4, -4);
    scene.add(pointLight2);

    // Interactive mouse parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 2;
      targetY = (y / rect.height) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotations
      icosahedron.rotation.x += 0.005;
      icosahedron.rotation.y += 0.008;

      core.rotation.y -= 0.006;

      ring1.rotation.z += 0.007;
      ring2.rotation.z -= 0.007;

      particles.rotation.y += 0.001;

      group.rotation.y = mouseX * 0.8;
      group.rotation.x = -mouseY * 0.8;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-[380px] w-full max-w-[440px] flex items-center justify-center pointer-events-none select-none"
    />
  );
}
