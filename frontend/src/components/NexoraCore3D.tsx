import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface NexoraCore3DProps {
  size?: number;
  interactive?: boolean;
}

export const NexoraCore3D: React.FC<NexoraCore3DProps> = ({
  size = 180,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // 1. Inner Crystalline Core (Icosahedron)
    const innerGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const innerMat = new THREE.MeshPhongMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      shininess: 90,
      wireframe: false,
      transparent: true,
      opacity: 0.85,
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerCore);

    // 2. Outer Holographic Wireframe Cage
    const outerGeo = new THREE.IcosahedronGeometry(1.8, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: 0xc084fc,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const outerCage = new THREE.Mesh(outerGeo, outerMat);
    scene.add(outerCage);

    // 3. Orbiting Rings
    const ringGeo = new THREE.TorusGeometry(2.3, 0.03, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 6;
    scene.add(ring2);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 3, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x38bdf8, 2, 20);
    pointLight2.position.set(-4, -4, 2);
    scene.add(pointLight2);

    // 5. Interactive Mouse Rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive || !mountRef.current) return;
      const rect = mountRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseX = (x / rect.width) * 2;
      mouseY = (y / rect.height) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 6. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      targetRotX += (mouseY - targetRotX) * 0.08;
      targetRotY += (mouseX - targetRotY) * 0.08;

      innerCore.rotation.x = elapsed * 0.4 + targetRotX * 0.5;
      innerCore.rotation.y = elapsed * 0.6 + targetRotY * 0.5;

      outerCage.rotation.x = -elapsed * 0.3 + targetRotX * 0.3;
      outerCage.rotation.y = -elapsed * 0.4 + targetRotY * 0.3;

      ring1.rotation.z = elapsed * 0.5;
      ring2.rotation.z = -elapsed * 0.4;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [size, interactive]);

  return (
    <div
      ref={mountRef}
      className="flex items-center justify-center cursor-pointer select-none filter drop-shadow-[0_0_25px_rgba(168,85,247,0.5)] hover:scale-105 transition-transform"
      style={{ width: size, height: size }}
    />
  );
};
