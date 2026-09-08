'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Sparkles } from 'lucide-react';

interface InteractiveStudySceneProps {
  className?: string;
}

export default function InteractiveStudyScene({ className = "" }: InteractiveStudySceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    // Check reduced motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPaused(true);
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check WebGL availability
    try {
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      return;
    }

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 450;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1, 9.5);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 2. Lighting (Soft Academic Ambient + Cyan/Violet Directional)
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const cyanPointLight = new THREE.PointLight(0x54d6c7, 3.5, 15);
    cyanPointLight.position.set(3, 3, 3);
    scene.add(cyanPointLight);

    const violetPointLight = new THREE.PointLight(0x8b5cf6, 3.0, 15);
    violetPointLight.position.set(-3, -2, 2);
    scene.add(violetPointLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 1.2);
    topLight.position.set(0, 5, 5);
    scene.add(topLight);

    // 3. Main Study Object Group
    const studyGroup = new THREE.Group();
    scene.add(studyGroup);

    // A. Floating 3D Book
    const bookGroup = new THREE.Group();
    
    // Book Cover (Deep Navy with glowing spine)
    const coverMaterial = new THREE.MeshStandardMaterial({
      color: 0x111c2e,
      roughness: 0.3,
      metalness: 0.6,
    });
    const spineMaterial = new THREE.MeshStandardMaterial({
      color: 0x54d6c7,
      emissive: 0x54d6c7,
      emissiveIntensity: 0.4,
      roughness: 0.2,
    });
    const pagesMaterial = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.8,
    });

    const leftCover = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 2.0), coverMaterial);
    leftCover.position.set(-0.72, 0, 0);
    leftCover.rotation.z = -0.12;

    const rightCover = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 2.0), coverMaterial);
    rightCover.position.set(0.72, 0, 0);
    rightCover.rotation.z = 0.12;

    const bookSpine = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 2.0, 16), spineMaterial);
    bookSpine.rotation.x = Math.PI / 2;

    const leftPages = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 1.9), pagesMaterial);
    leftPages.position.set(-0.68, 0.06, 0);
    leftPages.rotation.z = -0.08;

    const rightPages = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 1.9), pagesMaterial);
    rightPages.position.set(0.68, 0.06, 0);
    rightPages.rotation.z = 0.08;

    bookGroup.add(leftCover, rightCover, bookSpine, leftPages, rightPages);
    bookGroup.position.set(0, -0.6, 0);
    bookGroup.rotation.x = 0.35;
    studyGroup.add(bookGroup);

    // B. AI Knowledge Core (Pulsing Orb + Refractive Torus Ring)
    const orbGroup = new THREE.Group();
    
    const orbGeometry = new THREE.SphereGeometry(0.65, 32, 32);
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: 0x54d6c7,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.9,
      wireframe: false,
    });
    const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
    orbGroup.add(orbMesh);

    // Inner wireframe sphere for technical depth
    const wireOrb = new THREE.Mesh(
      new THREE.SphereGeometry(0.75, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0x54d6c7, wireframe: true, transparent: true, opacity: 0.35 })
    );
    orbGroup.add(wireOrb);

    // Orbiting Quantum Ring 1
    const ring1Geo = new THREE.TorusGeometry(1.1, 0.02, 16, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x54d6c7,
      emissive: 0x54d6c7,
      emissiveIntensity: 0.5,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    orbGroup.add(ring1);

    // Orbiting Quantum Ring 2 (Violet)
    const ring2Geo = new THREE.TorusGeometry(1.3, 0.02, 16, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 0.5,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    orbGroup.add(ring2);

    orbGroup.position.set(0, 1.4, 0);
    studyGroup.add(orbGroup);

    // C. Floating Syllabus Sheets (3 Translucent Planar Meshes)
    const sheetGeo = new THREE.PlaneGeometry(0.9, 1.3);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0x17253a,
      emissive: 0x54d6c7,
      emissiveIntensity: 0.15,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      roughness: 0.4,
    });

    const sheet1 = new THREE.Mesh(sheetGeo, sheetMat);
    sheet1.position.set(-2.0, 0.4, 0.5);
    sheet1.rotation.set(-0.2, 0.4, -0.15);
    studyGroup.add(sheet1);

    const sheet2 = new THREE.Mesh(sheetGeo, sheetMat);
    sheet2.position.set(2.0, 0.7, -0.4);
    sheet2.rotation.set(0.1, -0.35, 0.2);
    studyGroup.add(sheet2);

    const sheet3 = new THREE.Mesh(sheetGeo, sheetMat);
    sheet3.position.set(1.6, -1.0, 0.8);
    sheet3.rotation.set(0.3, 0.2, -0.1);
    studyGroup.add(sheet3);

    // D. Soft Ambient Knowledge Particles
    const particleCount = 45;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePos[i * 3] = (Math.random() - 0.5) * 8;
      particlePos[i * 3 + 1] = (Math.random() - 0.5) * 6;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x54d6c7,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    studyGroup.add(particles);

    // 4. Mouse Pointer Tracking Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.3;
    };

    window.addEventListener('mousemove', onMouseMove);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // 5. Smooth Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      if (!isPausedRef.current) {
        // Gentle Floating Oscillations
        bookGroup.position.y = -0.6 + Math.sin(elapsed * 1.5) * 0.08;
        bookGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.08;

        orbGroup.position.y = 1.4 + Math.cos(elapsed * 1.8) * 0.12;
        ring1.rotation.z += 0.015;
        ring1.rotation.x += 0.008;
        ring2.rotation.z -= 0.012;
        ring2.rotation.y += 0.01;
        wireOrb.rotation.y += 0.005;

        sheet1.position.y = 0.4 + Math.sin(elapsed * 1.2 + 1) * 0.1;
        sheet1.rotation.z = -0.15 + Math.sin(elapsed * 0.9) * 0.05;

        sheet2.position.y = 0.7 + Math.cos(elapsed * 1.4 + 2) * 0.1;
        sheet2.rotation.y = -0.35 + Math.cos(elapsed * 0.8) * 0.05;

        sheet3.position.y = -1.0 + Math.sin(elapsed * 1.6 + 3) * 0.08;

        particles.rotation.y = elapsed * 0.03;
      }

      // Smooth pointer-driven camera ease
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      studyGroup.rotation.y = mouseX;
      studyGroup.rotation.x = -mouseY * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      sheetGeo.dispose();
      sheetMat.dispose();
      orbGeometry.dispose();
      orbMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      coverMaterial.dispose();
      spineMaterial.dispose();
      pagesMaterial.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-[380px] sm:h-[460px] lg:h-[500px] flex items-center justify-center ${className}`}>
      {hasWebGL ? (
        <>
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          {/* Pause / Play Control Pill */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? "Resume 3D Rotation" : "Pause 3D Rotation"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#111c2e]/90 text-xs font-bold text-slate-300 hover:text-white hover:border-[#54d6c7] backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#54d6c7]" /> : <Pause className="w-3.5 h-3.5 text-[#54d6c7]" />}
              <span className="text-[11px]">{isPaused ? "Play 3D" : "Pause 3D"}</span>
            </button>
          </div>
        </>
      ) : (
        /* Static 3D Fallback for Low-Power / Non-WebGL Devices */
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl border border-white/10 bg-[#111c2e] text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#54d6c7]/15 flex items-center justify-center text-[#54d6c7]">
            <Sparkles className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-white">Interactive 3D Study Workspace</h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Dynamic knowledge orb, floating syllabus sheets, and active recall model.
          </p>
        </div>
      )}
    </div>
  );
}
