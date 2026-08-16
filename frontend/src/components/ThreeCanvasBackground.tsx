import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeCanvasBackgroundProps {
  isSimulating: boolean;
}

export const ThreeCanvasBackground: React.FC<ThreeCanvasBackgroundProps> = ({ isSimulating }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isSimulatingRef = useRef(isSimulating);

  useEffect(() => {
    isSimulatingRef.current = isSimulating;
  }, [isSimulating]);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // 3. 3D Particle Constellation (1500 Stars)
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const violetColor = new THREE.Color("#8B5CF6");
    const indigoColor = new THREE.Color("#6366F1");
    const cyanColor = new THREE.Color("#38BDF8");

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      const mixed = Math.random() > 0.5 ? violetColor : (Math.random() > 0.5 ? indigoColor : cyanColor);
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // 4. 3D Holographic Wireframe Torus Knot in Deep Background (positioned off to side)
    const torusGeo = new THREE.TorusKnotGeometry(10, 2.2, 100, 16, 2, 3);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(32, -18, -40);
    scene.add(torusKnot);

    // 5. 3D Floating Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(6, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: 0xa855f7,
      wireframe: true,
      transparent: true,
      opacity: 0.08,
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(-35, 18, -35);
    scene.add(icosahedron);

    // 6. Interactive Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // 7. Handle Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera dampening
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      camera.position.x = targetX * 12;
      camera.position.y = -targetY * 12;
      camera.lookAt(scene.position);

      // Rotate objects
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.x = elapsedTime * 0.01;

      torusKnot.rotation.x = elapsedTime * 0.15;
      torusKnot.rotation.y = elapsedTime * 0.1;

      icosahedron.rotation.x = -elapsedTime * 0.12;
      icosahedron.rotation.z = elapsedTime * 0.08;

      // Color Shift based on Incident Simulation
      if (isSimulatingRef.current) {
        torusMat.color.setHex(0xf43f5e);
        torusMat.opacity = 0.25;
        icoMat.color.setHex(0xfb7185);
      } else {
        torusMat.color.setHex(0x8b5cf6);
        torusMat.opacity = 0.12;
        icoMat.color.setHex(0xa855f7);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-85"
      aria-hidden="true"
    />
  );
};
