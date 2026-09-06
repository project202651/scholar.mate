"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface ThreeStudyOrbProps {
  theme?: "dark" | "light";
}

export default function ThreeStudyOrb({ theme = "dark" }: ThreeStudyOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === "light" ? 1.3 : 1.1;
    container.appendChild(renderer.domElement);

    // Root Group for interactive rotation & physics
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 2. Load Unique 3D Core Texture
    const textureLoader = new THREE.TextureLoader();
    const coreTexture = textureLoader.load("/images/scholarmate-3d-core.jpg");
    coreTexture.generateMipmaps = true;
    coreTexture.minFilter = THREE.LinearMipmapLinearFilter;
    coreTexture.magFilter = THREE.LinearFilter;

    // 3. Central 3D Holographic Core Lens / Disc
    // We create a volumetric bevel disc with the unique 3D core image on both front & back faces
    const discRadius = 1.62;
    const discHeight = 0.14;
    const discGeo = new THREE.CylinderGeometry(discRadius, discRadius, discHeight, 64);
    
    // Materials for the disc: index 0 = side rim, 1 = top (front), 2 = bottom (back)
    const rimMat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x0f172a,
      emissive: theme === "light" ? 0x0369a1 : 0x00f0ff,
      emissiveIntensity: theme === "light" ? 0.35 : 0.7,
      metalness: 0.9,
      roughness: 0.2,
    });

    const frontBackMat = new THREE.MeshStandardMaterial({
      map: coreTexture,
      roughness: 0.3,
      metalness: 0.4,
      emissive: 0x0284c7,
      emissiveIntensity: theme === "light" ? 0.15 : 0.25,
    });

    const coreDisc = new THREE.Mesh(discGeo, [rimMat, frontBackMat, frontBackMat]);
    // Orient disc to face camera forward initially
    coreDisc.rotation.x = Math.PI / 2;
    rootGroup.add(coreDisc);

    // 4. Holographic Aura & Pulsing Lens Flares
    const haloGeo = new THREE.RingGeometry(discRadius * 0.96, discRadius * 1.08, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: theme === "light" ? 0x0284c7 : 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: theme === "light" ? 0.5 : 0.75,
      blending: THREE.AdditiveBlending,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = 0.08;
    rootGroup.add(halo);

    const haloBack = halo.clone();
    haloBack.position.z = -0.08;
    rootGroup.add(haloBack);

    // 5. 3-Axis Precision Gyroscopic Rings
    // Ring 1: Equatorial (Cyan)
    const ring1Geo = new THREE.TorusGeometry(2.25, 0.038, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x00f0ff,
      emissive: theme === "light" ? 0x0369a1 : 0x00f0ff,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    rootGroup.add(ring1);

    // Ring 2: Orbital (Purple / Indigo)
    const ring2Geo = new THREE.TorusGeometry(2.05, 0.032, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x6366f1 : 0xa855f7,
      emissive: theme === "light" ? 0x4f46e5 : 0x9333ea,
      emissiveIntensity: 0.65,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.5;
    rootGroup.add(ring2);

    // Ring 3: Polar (Emerald / Mint)
    const ring3Geo = new THREE.TorusGeometry(2.48, 0.028, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x059669 : 0x10b981,
      emissive: theme === "light" ? 0x047857 : 0x059669,
      emissiveIntensity: 0.6,
      metalness: 0.85,
      roughness: 0.25,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 4;
    rootGroup.add(ring3);

    // 6. Crystalline Geodesic Outer Cage
    const cageGeo = new THREE.IcosahedronGeometry(2.8, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x6366f1,
      wireframe: true,
      transparent: true,
      opacity: theme === "light" ? 0.35 : 0.28,
      roughness: 0.3,
    });
    const outerCage = new THREE.Mesh(cageGeo, cageMat);
    rootGroup.add(outerCage);

    // 7. Orbiting Satellite Beacons (Data Crystals)
    const satellites: THREE.Mesh[] = [];
    const satColors = [0x00f0ff, 0xa855f7, 0x10b981, 0xf59e0b];
    const satRadii = [2.25, 2.05, 2.48, 2.7];
    const satSpeeds = [0.015, -0.018, 0.012, -0.01];

    for (let i = 0; i < 4; i++) {
      const satGeo = new THREE.OctahedronGeometry(0.12, 0);
      const satMat = new THREE.MeshStandardMaterial({
        color: satColors[i],
        emissive: satColors[i],
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      });
      const sat = new THREE.Mesh(satGeo, satMat);
      rootGroup.add(sat);
      satellites.push(sat);
    }

    // 8. Volumetric Ambient Stardust Particle Halo
    const particleCount = 260;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 11;
      positions[i + 1] = (Math.random() - 0.5) * 11;
      positions[i + 2] = (Math.random() - 0.5) * 11;
    }
    particlesGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
      color: theme === "light" ? 0x0284c7 : 0x38bdf8,
      size: theme === "light" ? 0.07 : 0.055,
      transparent: true,
      opacity: theme === "light" ? 0.65 : 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particles);

    // 9. Adaptive Multi-Light Illumination
    const ambientLight = new THREE.AmbientLight(
      theme === "light" ? 0xffffff : 0x312e81,
      theme === "light" ? 1.4 : 0.85
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, theme === "light" ? 1.8 : 1.2);
    keyLight.position.set(5, 6, 6);
    scene.add(keyLight);

    const cyanPoint = new THREE.PointLight(0x00f0ff, theme === "light" ? 2.5 : 3.5, 40);
    cyanPoint.position.set(4, 3, 5);
    scene.add(cyanPoint);

    const purplePoint = new THREE.PointLight(0xa855f7, theme === "light" ? 2.0 : 3.0, 40);
    purplePoint.position.set(-4, -3, -4);
    scene.add(purplePoint);

    // 10. Interactive Physics: Mouse Drag, Parallax & Inertia
    let isDragging = false;
    let prevPointerX = 0;
    let prevPointerY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevPointerX = e.clientX;
      prevPointerY = e.clientY;
      velocityX = 0;
      velocityY = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const ny = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetParallaxX = nx * 0.45;
      targetParallaxY = -ny * 0.45;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        rootGroup.rotation.y += deltaX * 0.008;
        rootGroup.rotation.x += deltaY * 0.008;

        velocityX = deltaX * 0.008;
        velocityY = deltaY * 0.008;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 11. Responsive Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || 400;
        const h = entry.contentRect.height || 400;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // 12. 60 FPS Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertia & Parallax handling
      if (!isDragging) {
        // Apply inertia with damping
        rootGroup.rotation.y += velocityX;
        rootGroup.rotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        // Base continuous rotation
        rootGroup.rotation.y += 0.0035;

        // Smooth Parallax tilt
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.06;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.06;
        rootGroup.position.x = currentParallaxX * 0.5;
        rootGroup.position.y = currentParallaxY * 0.5;
      }

      // Breathing Pulse on Central Hologram Disc
      const pulse = 1 + Math.sin(elapsed * 2.2) * 0.025;
      coreDisc.scale.set(pulse, pulse, pulse);

      // Independent Multi-Axis Rotation for Gyro Rings
      ring1.rotation.z += 0.007;
      ring2.rotation.x -= 0.008;
      ring3.rotation.y += 0.006;

      // Outer Geodesic Cage counter-spin
      outerCage.rotation.y -= 0.002;
      outerCage.rotation.x += 0.0015;

      // Orbiting Satellites on harmonic spherical coordinates
      satellites.forEach((sat, idx) => {
        const angle = elapsed * satSpeeds[idx] * 45 + (idx * Math.PI) / 2;
        const radius = satRadii[idx];
        sat.position.x = Math.cos(angle) * radius;
        sat.position.y = Math.sin(angle * 1.3) * (radius * 0.55);
        sat.position.z = Math.sin(angle) * radius;
        sat.rotation.x += 0.03;
        sat.rotation.y += 0.02;
      });

      // Background particle drift
      particles.rotation.y = elapsed * 0.03;
      particles.rotation.x = Math.sin(elapsed * 0.02) * 0.1;

      renderer.render(scene, camera);
    };

    animate();

    // 13. Resource Cleanup
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js objects
      discGeo.dispose();
      rimMat.dispose();
      frontBackMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      coreTexture.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[380px] w-full max-w-[440px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
      title="Interactive 3D Hologram AI Coach Core (Click & Drag to Orbit)"
      aria-label="Interactive 3D Hologram AI Coach Core"
    />
  );
}
