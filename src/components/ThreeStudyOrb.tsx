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
    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7.0;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = theme === "light" ? 1.35 : 1.15;
    container.appendChild(renderer.domElement);

    // Master Group for mouse drag, inertia, and tilt
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 2. Central Quantum Knowledge Crystal Core
    // Outer multifaceted crystalline shell
    const crystalGeo = new THREE.IcosahedronGeometry(1.45, 1);
    const crystalMat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x0ea5e9,
      emissive: theme === "light" ? 0x0369a1 : 0x0284c7,
      emissiveIntensity: theme === "light" ? 0.25 : 0.55,
      roughness: 0.15,
      metalness: 0.85,
      wireframe: true,
      transparent: true,
      opacity: theme === "light" ? 0.65 : 0.75,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    masterGroup.add(crystalMesh);

    // Inner Glowing Neural Nucleus
    const coreGeo = new THREE.OctahedronGeometry(0.82, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x10b981 : 0x38bdf8,
      emissive: theme === "light" ? 0x059669 : 0x06b6d4,
      emissiveIntensity: theme === "light" ? 0.45 : 0.85,
      roughness: 0.2,
      metalness: 0.5,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    masterGroup.add(coreMesh);

    // Inner Radiant Energy Core
    const innerLightGeo = new THREE.SphereGeometry(0.45, 32, 32);
    const innerLightMat = new THREE.MeshBasicMaterial({
      color: theme === "light" ? 0x38bdf8 : 0xffffff,
    });
    const innerLight = new THREE.Mesh(innerLightGeo, innerLightMat);
    masterGroup.add(innerLight);

    // 3. Neural Synapse Network (Connecting Lattice)
    const nodeCount = 14;
    const nodePositions: THREE.Vector3[] = [];
    const nodeGroup = new THREE.Group();
    masterGroup.add(nodeGroup);

    const nodeGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x00f0ff,
      emissive: theme === "light" ? 0x0369a1 : 0x00f0ff,
      emissiveIntensity: 0.9,
    });

    // Generate balanced spherical distribution
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / nodeCount);
      const theta = Math.sqrt(nodeCount * Math.PI) * phi;
      const radius = 1.48;
      const pos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );
      nodePositions.push(pos);

      const node = new THREE.Mesh(nodeGeo, nodeMat);
      node.position.copy(pos);
      nodeGroup.add(node);
    }

    // Connect nodes with laser neural lines
    const lineIndices: number[] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodePositions[i].distanceTo(nodePositions[j]) < 1.35) {
          lineIndices.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
          lineIndices.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(lineIndices, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: theme === "light" ? 0x0284c7 : 0x38bdf8,
      transparent: true,
      opacity: theme === "light" ? 0.35 : 0.45,
    });
    const neuralLines = new THREE.LineSegments(lineGeo, lineMat);
    masterGroup.add(neuralLines);

    // 4. 3-Axis Precision Gyroscopic Gimbal Rings
    // Ring 1: Equatorial (Cyan - Syllabus Alignment)
    const ring1Geo = new THREE.TorusGeometry(2.2, 0.032, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x0284c7 : 0x00f0ff,
      emissive: theme === "light" ? 0x0369a1 : 0x00f0ff,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    masterGroup.add(ring1);

    // Ring 2: Polar (Purple - Active Recall Engine)
    const ring2Geo = new THREE.TorusGeometry(2.0, 0.028, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x6366f1 : 0xa855f7,
      emissive: theme === "light" ? 0x4f46e5 : 0x9333ea,
      emissiveIntensity: 0.65,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 3.2;
    masterGroup.add(ring2);

    // Ring 3: Orbital (Emerald - Examiner Distinction Target)
    const ring3Geo = new THREE.TorusGeometry(2.45, 0.025, 16, 120);
    const ring3Mat = new THREE.MeshStandardMaterial({
      color: theme === "light" ? 0x059669 : 0x10b981,
      emissive: theme === "light" ? 0x047857 : 0x10b981,
      emissiveIntensity: 0.6,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 4;
    masterGroup.add(ring3);

    // 5. Floating Academic Satellites (Student Learning Beacons)
    const satellites: { mesh: THREE.Group; speed: number; radius: number; phase: number }[] = [];
    const satData = [
      { color: 0x00f0ff, label: "Readiness", geo: new THREE.OctahedronGeometry(0.16, 0), radius: 2.2, speed: 0.014 },
      { color: 0xa855f7, label: "Syllabus", geo: new THREE.IcosahedronGeometry(0.14, 0), radius: 2.0, speed: -0.016 },
      { color: 0x10b981, label: "Formulas", geo: new THREE.DodecahedronGeometry(0.15, 0), radius: 2.45, speed: 0.011 },
      { color: 0xf59e0b, label: "Accuracy", geo: new THREE.BoxGeometry(0.18, 0.18, 0.18), radius: 2.65, speed: -0.009 },
    ];

    satData.forEach((data, index) => {
      const satGroup = new THREE.Group();
      const satMat = new THREE.MeshStandardMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.85,
        metalness: 0.8,
        roughness: 0.15,
      });
      const satMesh = new THREE.Mesh(data.geo, satMat);
      satGroup.add(satMesh);

      // Mini satellite halo
      const haloGeo = new THREE.RingGeometry(0.24, 0.27, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: data.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      satGroup.add(haloMesh);

      masterGroup.add(satGroup);
      satellites.push({
        mesh: satGroup,
        speed: data.speed,
        radius: data.radius,
        phase: (index * Math.PI) / 2,
      });
    });

    // 6. Ambient Architectural Stardust
    const stardustCount = 200;
    const stardustGeo = new THREE.BufferGeometry();
    const stardustPos = new Float32Array(stardustCount * 3);

    for (let i = 0; i < stardustCount * 3; i += 3) {
      stardustPos[i] = (Math.random() - 0.5) * 10;
      stardustPos[i + 1] = (Math.random() - 0.5) * 10;
      stardustPos[i + 2] = (Math.random() - 0.5) * 10;
    }
    stardustGeo.setAttribute("position", new THREE.BufferAttribute(stardustPos, 3));

    const stardustMat = new THREE.PointsMaterial({
      color: theme === "light" ? 0x0284c7 : 0x38bdf8,
      size: theme === "light" ? 0.05 : 0.045,
      transparent: true,
      opacity: theme === "light" ? 0.45 : 0.65,
    });
    const stardust = new THREE.Points(stardustGeo, stardustMat);
    scene.add(stardust);

    // 7. Lighting System
    const ambientLight = new THREE.AmbientLight(
      theme === "light" ? 0xffffff : 0x1e1b4b,
      theme === "light" ? 1.5 : 0.9
    );
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, theme === "light" ? 2.0 : 1.4);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, theme === "light" ? 2.2 : 3.5, 45);
    cyanLight.position.set(4, 3, 5);
    scene.add(cyanLight);

    const purpleLight = new THREE.PointLight(0xa855f7, theme === "light" ? 1.8 : 2.8, 45);
    purpleLight.position.set(-4, -3, -4);
    scene.add(purpleLight);

    // 8. Interactive Physics: Mouse Drag, Parallax & Inertia
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
      targetParallaxX = nx * 0.4;
      targetParallaxY = -ny * 0.4;

      if (isDragging) {
        const deltaX = e.clientX - prevPointerX;
        const deltaY = e.clientY - prevPointerY;
        prevPointerX = e.clientX;
        prevPointerY = e.clientY;

        masterGroup.rotation.y += deltaX * 0.0075;
        masterGroup.rotation.x += deltaY * 0.0075;

        velocityX = deltaX * 0.0075;
        velocityY = deltaY * 0.0075;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width || 420;
        const h = entry.contentRect.height || 420;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // 10. 60 FPS Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertia & Parallax Handling
      if (!isDragging) {
        masterGroup.rotation.y += velocityX;
        masterGroup.rotation.x += velocityY;
        velocityX *= 0.94;
        velocityY *= 0.94;

        // Gentle ambient auto-rotation
        masterGroup.rotation.y += 0.004;

        // Smooth Parallax tilt
        currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
        currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;
        masterGroup.position.x = currentParallaxX * 0.4;
        masterGroup.position.y = currentParallaxY * 0.4;
      }

      // Breathing Quantum Pulse
      const pulseRate = isHovered ? 3.0 : 2.0;
      const pulse = 1 + Math.sin(elapsed * pulseRate) * 0.04;
      coreMesh.scale.set(pulse, pulse, pulse);
      innerLight.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);

      // Core Counter-Rotations
      crystalMesh.rotation.y -= 0.005;
      crystalMesh.rotation.z += 0.003;
      coreMesh.rotation.y += 0.008;

      // 3-Axis Gyroscopic Rings
      ring1.rotation.z += 0.007;
      ring2.rotation.x -= 0.008;
      ring3.rotation.y += 0.006;

      // Orbiting Satellites
      satellites.forEach((sat, i) => {
        const angle = elapsed * sat.speed * 45 + sat.phase;
        sat.mesh.position.x = Math.cos(angle) * sat.radius;
        sat.mesh.position.y = Math.sin(angle * 1.2) * (sat.radius * 0.5);
        sat.mesh.position.z = Math.sin(angle) * sat.radius;
        sat.mesh.rotation.x += 0.02;
        sat.mesh.rotation.y += 0.03;
      });

      // Ambient stardust drift
      stardust.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      crystalGeo.dispose();
      crystalMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      innerLightGeo.dispose();
      innerLightMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      stardustGeo.dispose();
      stardustMat.dispose();
      renderer.dispose();
    };
  }, [theme, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-[390px] w-full max-w-[450px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none"
      title="Interactive 3D Student Knowledge Core (Click & Drag to Orbit)"
      aria-label="Interactive 3D Student Knowledge Core"
    />
  );
}
