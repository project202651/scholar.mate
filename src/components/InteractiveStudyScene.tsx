'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Play, Pause, Sparkles, BookOpen, Layers, Zap } from 'lucide-react';

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
    // Respect user's reduced-motion preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsPaused(true);
    }

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number;
    let onMouseMove: (e: MouseEvent) => void;
    let onResize: () => void;

    // Procedural geometries and materials to dispose
    const disposables: Array<{ dispose: () => void }> = [];

    try {
      // 1. Safe WebGLRenderer creation inside try/catch (without pre-calling getContext)
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'default',
        failIfMajorPerformanceCaveat: false,
      });

      const width = container.clientWidth || 480;
      const height = container.clientHeight || 420;

      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5));

      // 2. Scene & Camera Setup
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.set(0, 1, 9.5);

      // 3. Lighting (Soft Academic Ambient + Cyan/Violet Directional)
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

      // 4. Main Study Object Group
      const studyGroup = new THREE.Group();
      scene.add(studyGroup);

      // A. Floating 3D Book
      const bookGroup = new THREE.Group();
      
      const coverMaterial = new THREE.MeshStandardMaterial({
        color: 0x111c2e,
        roughness: 0.3,
        metalness: 0.6,
      });
      disposables.push(coverMaterial);

      const spineMaterial = new THREE.MeshStandardMaterial({
        color: 0x54d6c7,
        emissive: 0x54d6c7,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });
      disposables.push(spineMaterial);

      const pagesMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.8,
      });
      disposables.push(pagesMaterial);

      const coverGeo = new THREE.BoxGeometry(1.4, 0.06, 2.0);
      disposables.push(coverGeo);

      const spineGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 16);
      disposables.push(spineGeo);

      const pagesGeo = new THREE.BoxGeometry(1.3, 0.12, 1.9);
      disposables.push(pagesGeo);

      const leftCover = new THREE.Mesh(coverGeo, coverMaterial);
      leftCover.position.set(-0.72, 0, 0);
      leftCover.rotation.z = -0.12;

      const rightCover = new THREE.Mesh(coverGeo, coverMaterial);
      rightCover.position.set(0.72, 0, 0);
      rightCover.rotation.z = 0.12;

      const bookSpine = new THREE.Mesh(spineGeo, spineMaterial);
      bookSpine.rotation.x = Math.PI / 2;

      const leftPages = new THREE.Mesh(pagesGeo, pagesMaterial);
      leftPages.position.set(-0.68, 0.06, 0);
      leftPages.rotation.z = -0.08;

      const rightPages = new THREE.Mesh(pagesGeo, pagesMaterial);
      rightPages.position.set(0.68, 0.06, 0);
      rightPages.rotation.z = 0.08;

      bookGroup.add(leftCover, rightCover, bookSpine, leftPages, rightPages);
      bookGroup.position.set(0, -0.6, 0);
      bookGroup.rotation.x = 0.35;
      studyGroup.add(bookGroup);

      // B. AI Knowledge Core (Pulsing Orb + Refractive Torus Ring)
      const orbGroup = new THREE.Group();
      
      const orbGeometry = new THREE.SphereGeometry(0.65, 24, 24);
      disposables.push(orbGeometry);

      const orbMaterial = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x54d6c7,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.8,
      });
      disposables.push(orbMaterial);

      const orbMesh = new THREE.Mesh(orbGeometry, orbMaterial);
      orbGroup.add(orbMesh);

      // Inner wireframe sphere
      const wireGeo = new THREE.SphereGeometry(0.75, 14, 14);
      disposables.push(wireGeo);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x54d6c7, wireframe: true, transparent: true, opacity: 0.35 });
      disposables.push(wireMat);

      const wireOrb = new THREE.Mesh(wireGeo, wireMat);
      orbGroup.add(wireOrb);

      // Quantum Rings
      const ring1Geo = new THREE.TorusGeometry(1.1, 0.025, 12, 48);
      disposables.push(ring1Geo);
      const ring1Mat = new THREE.MeshStandardMaterial({ color: 0x54d6c7, emissive: 0x54d6c7, emissiveIntensity: 0.5 });
      disposables.push(ring1Mat);

      const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
      ring1.rotation.x = Math.PI / 3;
      orbGroup.add(ring1);

      const ring2Geo = new THREE.TorusGeometry(1.3, 0.025, 12, 48);
      disposables.push(ring2Geo);
      const ring2Mat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.5 });
      disposables.push(ring2Mat);

      const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
      ring2.rotation.y = Math.PI / 4;
      orbGroup.add(ring2);

      orbGroup.position.set(0, 1.4, 0);
      studyGroup.add(orbGroup);

      // C. Floating Syllabus Sheets
      const sheetGeo = new THREE.PlaneGeometry(0.9, 1.3);
      disposables.push(sheetGeo);

      const sheetMat = new THREE.MeshStandardMaterial({
        color: 0x17253a,
        emissive: 0x54d6c7,
        emissiveIntensity: 0.15,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        roughness: 0.4,
      });
      disposables.push(sheetMat);

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

      // D. Particles
      const particleCount = 40;
      const particleGeo = new THREE.BufferGeometry();
      disposables.push(particleGeo);

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
      disposables.push(particleMat);

      const particles = new THREE.Points(particleGeo, particleMat);
      studyGroup.add(particles);

      // 5. Mouse Parallax Ease
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      onMouseMove = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
        targetX = x * 0.35;
        targetY = y * 0.25;
      };
      window.addEventListener('mousemove', onMouseMove);

      onResize = () => {
        if (!container || !renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);

      // 6. Animation Loop
      const clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        if (!isPausedRef.current) {
          bookGroup.position.y = -0.6 + Math.sin(elapsed * 1.5) * 0.08;
          bookGroup.rotation.y = Math.sin(elapsed * 0.8) * 0.08;

          orbGroup.position.y = 1.4 + Math.cos(elapsed * 1.8) * 0.12;
          ring1.rotation.z += 0.015;
          ring1.rotation.x += 0.008;
          ring2.rotation.z -= 0.012;
          ring2.rotation.y += 0.01;
          wireOrb.rotation.y += 0.005;

          sheet1.position.y = 0.4 + Math.sin(elapsed * 1.2 + 1) * 0.1;
          sheet2.position.y = 0.7 + Math.cos(elapsed * 1.4 + 2) * 0.1;
          sheet3.position.y = -1.0 + Math.sin(elapsed * 1.6 + 3) * 0.08;

          particles.rotation.y = elapsed * 0.03;

          mouseX += (targetX - mouseX) * 0.05;
          mouseY += (targetY - mouseY) * 0.05;

          studyGroup.rotation.y = mouseX;
          studyGroup.rotation.x = -mouseY * 0.5;
        }

        if (renderer) {
          renderer.render(scene, camera);
        }
      };

      animate();
    } catch (err) {
      console.warn("WebGL initialization skipped, using fallback scene:", err);
      setHasWebGL(false);
    }

    return () => {
      if (onMouseMove) window.removeEventListener('mousemove', onMouseMove);
      if (onResize) window.removeEventListener('resize', onResize);
      if (animId) cancelAnimationFrame(animId);
      if (renderer) {
        try {
          renderer.dispose();
        } catch {}
      }
      disposables.forEach(d => {
        try {
          d.dispose();
        } catch {}
      });
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative w-full h-[360px] sm:h-[440px] lg:h-[480px] flex items-center justify-center ${className}`}>
      {hasWebGL ? (
        <>
          <canvas ref={canvasRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
          
          {/* Pause / Play Control Pill */}
          <div className="absolute bottom-3 right-3 z-20">
            <button
              onClick={() => setIsPaused(!isPaused)}
              aria-label={isPaused ? "Play 3D study animation" : "Pause 3D study animation"}
              title={isPaused ? "Resume 3D Rotation" : "Pause 3D Rotation"}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-[#111c2e]/90 text-xs font-bold text-slate-300 hover:text-white hover:border-[#54d6c7] focus-visible:ring-2 focus-visible:ring-[#54d6c7] focus-visible:outline-none backdrop-blur-md shadow-lg transition-all cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#54d6c7]" /> : <Pause className="w-3.5 h-3.5 text-[#54d6c7]" />}
              <span className="text-[11px]">{isPaused ? "Play 3D" : "Pause 3D"}</span>
            </button>
          </div>
        </>
      ) : (
        /* Static 3D Visual Fallback Card for Non-WebGL / Headless Drivers */
        <div className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-gradient-to-br from-[#17253a] to-[#0b1220] p-6 text-center space-y-4 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#54d6c7]/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 flex justify-center">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#54d6c7] via-[#2dd4bf] to-[#8b5cf6] shadow-2xl shadow-[#54d6c7]/30 border border-white/20">
              <Sparkles className="h-12 w-12 text-slate-950 font-black animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 space-y-1">
            <h4 className="text-base font-extrabold text-white">AI Study Workspace</h4>
            <p className="text-xs text-slate-300">
              Floating Syllabus Sheets · AI Knowledge Core · Active Recall Engine
            </p>
          </div>

          <div className="relative z-10 flex items-center justify-center gap-2 text-[11px] font-bold text-[#54d6c7] pt-2">
            <span className="px-2.5 py-1 rounded-full bg-[#54d6c7]/15 border border-[#54d6c7]/30">
              ⚡ 100% Calibrated Syllabus
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
