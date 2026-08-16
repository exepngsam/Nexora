import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { 
  ArrowRight, 
  Play, 
  Zap, 
  Shield, 
  Brain, 
  Radio, 
  Layers, 
  Database, 
  Sparkles, 
  Orbit, 
  Compass, 
  Activity, 
  ChevronLeft, 
  ChevronRight, 
  Lock,
  Rotate3d,
  Maximize2
} from "lucide-react";

interface SolarSystem3DLandingProps {
  onLaunch: () => void;
  onOpenDemo: () => void;
  onOpenLogin?: () => void;
}

interface PlanetNode {
  id: string;
  num: string;
  name: string;
  subtitle: string;
  desc: string;
  color: string;
  emissive: string;
  ringColor: string;
  radius: number;
  hasRings: boolean;
  specs: {
    sla: string;
    speed: string;
    traffic: string;
    accuracy: string;
    status: string;
  };
}

const CELESTIAL_NODES: PlanetNode[] = [
  {
    id: "nexora",
    num: "01",
    name: "NEXORA CORE",
    subtitle: "AUTONOMOUS SRE ORCHESTRATION",
    desc: "The hyper-dimensional command nucleus executing zero-delay incident triaging, root-cause correlation, and autonomous human dispatch across global cloud regions.",
    color: "#8B5CF6",
    emissive: "#4C1D95",
    ringColor: "#C084FC",
    radius: 3.2,
    hasRings: true,
    specs: {
      sla: "< 10s ACK",
      speed: "142ms P50",
      traffic: "24.8k RPS",
      accuracy: "99.8%",
      status: "NOMINAL"
    }
  },
  {
    id: "caspian",
    num: "02",
    name: "CASPIAN MESH",
    subtitle: "OMNI-CHANNEL HUMAN REACH",
    desc: "A unified telemetry-to-human dispatch matrix broadcasting high-priority interactive alerts across Telegram, Email, and Slack war rooms in parallel.",
    color: "#06D6A0",
    emissive: "#044E3D",
    ringColor: "#A7E8D8",
    radius: 2.9,
    hasRings: false,
    specs: {
      sla: "Zero Delay",
      speed: "35ms Dispatch",
      traffic: "4/4 Channels",
      accuracy: "100% Reach",
      status: "ACTIVE"
    }
  },
  {
    id: "featherless",
    num: "03",
    name: "FEATHERLESS AI",
    subtitle: "DEEPSEEK-V3.2 REASONING",
    desc: "Open-source high-throughput LLM brain evaluating live telemetry streams, correlating historical postmortems, and generating surgical mitigation steps.",
    color: "#EC4899",
    emissive: "#831843",
    ringColor: "#F472B6",
    radius: 3.1,
    hasRings: true,
    specs: {
      sla: "3s Inference",
      speed: "188 tok/s",
      traffic: "32k Context",
      accuracy: "99.4%",
      status: "SYNCHRONIZED"
    }
  },
  {
    id: "memory",
    num: "04",
    name: "VECTOR NEXUS",
    subtitle: "CHROMADB EPISODIC MEMORY",
    desc: "Persistent vector memory indexing architectural runbooks, past incident resolutions, and engineer expertise vectors for sub-second retrieval.",
    color: "#38BDF8",
    emissive: "#0369A1",
    ringColor: "#7DD3FC",
    radius: 2.8,
    hasRings: false,
    specs: {
      sla: "< 15ms Search",
      speed: "1,536 Embed",
      traffic: "100k Vectors",
      accuracy: "0.96 Score",
      status: "INDEXED"
    }
  },
  {
    id: "safety",
    num: "05",
    name: "SAFETY GATEWAY",
    subtitle: "ZERO-TRUST HUMAN APPROVAL",
    desc: "Cryptographic human-in-the-loop consensus verification ensuring dangerous canary rollbacks and state mutations are securely authorized.",
    color: "#F59E0B",
    emissive: "#78350F",
    ringColor: "#FCD34D",
    radius: 2.85,
    hasRings: true,
    specs: {
      sla: "Human-Gated",
      speed: "1-Click Verify",
      traffic: "100% Audited",
      accuracy: "Fail-Safe",
      status: "PROTECTED"
    }
  }
];

export const SolarSystem3DLanding: React.FC<SolarSystem3DLandingProps> = ({
  onLaunch,
  onOpenDemo,
  onOpenLogin,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activePlanet = CELESTIAL_NODES[activeIndex];
  const mountRef = useRef<HTMLDivElement>(null);

  // References for Three.js state
  const targetColorRef = useRef(new THREE.Color(activePlanet.color));
  const targetEmissiveRef = useRef(new THREE.Color(activePlanet.emissive));
  const targetRingColorRef = useRef(new THREE.Color(activePlanet.ringColor));
  const targetRadiusRef = useRef(activePlanet.radius);
  const targetHasRingsRef = useRef(activePlanet.hasRings);

  // Update target references smoothly when active planet changes
  useEffect(() => {
    targetColorRef.current.set(activePlanet.color);
    targetEmissiveRef.current.set(activePlanet.emissive);
    targetRingColorRef.current.set(activePlanet.ringColor);
    targetRadiusRef.current = activePlanet.radius;
    targetHasRingsRef.current = activePlanet.hasRings;
  }, [activeIndex, activePlanet]);

  useEffect(() => {
    if (!mountRef.current) return;
    mountRef.current.innerHTML = "";

    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05030a, 0.012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 11.5);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    mountRef.current.appendChild(renderer.domElement);

    // 3. Deep-Space Starfield (2,500 Multi-Color Depth Particles)
    const starCount = 2500;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 1] = (Math.random() - 0.5) * 160;
      starPositions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 15;

      const starColor = new THREE.Color().setHSL(0.65 + Math.random() * 0.25, 0.8, 0.75 + Math.random() * 0.25);
      starColors[i * 3] = starColor.r;
      starColors[i * 3 + 1] = starColor.g;
      starColors[i * 3 + 2] = starColor.b;
    }

    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 4. Procedural High-Res Planet Surface Texture & Bump Map
    const textureCanvas = document.createElement("canvas");
    textureCanvas.width = 2048;
    textureCanvas.height = 1024;
    const texCtx = textureCanvas.getContext("2d");

    const bumpCanvas = document.createElement("canvas");
    bumpCanvas.width = 2048;
    bumpCanvas.height = 1024;
    const bumpCtx = bumpCanvas.getContext("2d");

    if (texCtx && bumpCtx) {
      // Deep space base
      texCtx.fillStyle = "#0A051A";
      texCtx.fillRect(0, 0, 2048, 1024);

      bumpCtx.fillStyle = "#000000";
      bumpCtx.fillRect(0, 0, 2048, 1024);

      // Swirling atmospheric storms & bands
      for (let y = 0; y < 1024; y += 4) {
        const bandNoise = Math.sin(y * 0.02) * Math.cos(y * 0.01) * 0.5 + 0.5;
        texCtx.fillStyle = `rgba(139, 92, 246, ${bandNoise * 0.25})`;
        texCtx.fillRect(0, y, 2048, 4);
      }

      // Procedural continents & neural grid clusters
      for (let i = 0; i < 60; i++) {
        const x = Math.random() * 2048;
        const y = Math.random() * 1024;
        const r = 40 + Math.random() * 140;

        const radial = texCtx.createRadialGradient(x, y, 0, x, y, r);
        radial.addColorStop(0, "rgba(168, 85, 247, 0.65)");
        radial.addColorStop(0.4, "rgba(99, 102, 241, 0.35)");
        radial.addColorStop(1, "transparent");

        texCtx.fillStyle = radial;
        texCtx.beginPath();
        texCtx.arc(x, y, r, 0, Math.PI * 2);
        texCtx.fill();

        // Bump relief
        bumpCtx.fillStyle = "rgba(255, 255, 255, 0.4)";
        bumpCtx.beginPath();
        bumpCtx.arc(x, y, r * 0.8, 0, Math.PI * 2);
        bumpCtx.fill();
      }

      // Cybernetic Longitude & Latitude Coordinates
      texCtx.strokeStyle = "rgba(196, 181, 253, 0.12)";
      texCtx.lineWidth = 1.5;
      for (let x = 0; x < 2048; x += 64) {
        texCtx.beginPath();
        texCtx.moveTo(x, 0);
        texCtx.lineTo(x, 1024);
        texCtx.stroke();
      }
      for (let y = 0; y < 1024; y += 64) {
        texCtx.beginPath();
        texCtx.moveTo(0, y);
        texCtx.lineTo(2048, y);
        texCtx.stroke();
      }
    }

    const surfaceTex = new THREE.CanvasTexture(textureCanvas);
    const bumpTex = new THREE.CanvasTexture(bumpCanvas);

    // Planet Mesh
    const planetGeo = new THREE.SphereGeometry(3.0, 96, 96);
    const planetMat = new THREE.MeshStandardMaterial({
      map: surfaceTex,
      bumpMap: bumpTex,
      bumpScale: 0.08,
      color: new THREE.Color(activePlanet.color),
      emissive: new THREE.Color(activePlanet.emissive),
      emissiveIntensity: 0.55,
      roughness: 0.38,
      metalness: 0.25,
    });
    const planetMesh = new THREE.Mesh(planetGeo, planetMat);
    scene.add(planetMesh);

    // 5. Volumetric Multi-Layer Atmospheric Corona Glow
    const atmoGeo = new THREE.SphereGeometry(3.18, 64, 64);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(activePlanet.color),
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
    scene.add(atmosphereMesh);

    // Inner Fresnel Rim Glow
    const innerRimGeo = new THREE.SphereGeometry(3.04, 64, 64);
    const innerRimMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
    });
    const innerRimMesh = new THREE.Mesh(innerRimGeo, innerRimMat);
    scene.add(innerRimMesh);

    // 6. High-Fidelity 3D Planetary Ring System (With Alpha Falloff & Cassini Division)
    const ringCanvas = document.createElement("canvas");
    ringCanvas.width = 1024;
    ringCanvas.height = 64;
    const ringCtx = ringCanvas.getContext("2d");
    if (ringCtx) {
      const grad = ringCtx.createLinearGradient(0, 0, 1024, 0);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(0.15, "rgba(168, 85, 247, 0.7)");
      grad.addColorStop(0.45, "rgba(99, 102, 241, 0.85)");
      grad.addColorStop(0.55, "rgba(0, 0, 0, 0)"); // Cassini Division gap!
      grad.addColorStop(0.65, "rgba(192, 132, 252, 0.8)");
      grad.addColorStop(0.9, "rgba(139, 92, 246, 0.5)");
      grad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ringCtx.fillStyle = grad;
      ringCtx.fillRect(0, 0, 1024, 64);
    }
    const ringTexture = new THREE.CanvasTexture(ringCanvas);

    const ringGeo = new THREE.RingGeometry(4.2, 6.2, 96);
    // Orient ring UVs along the radius
    const ringUvs = ringGeo.attributes.uv;
    for (let i = 0; i < ringUvs.count; i++) {
      const u = ringUvs.getX(i);
      const v = ringUvs.getY(i);
      const dist = Math.sqrt((u - 0.5) ** 2 + (v - 0.5) ** 2) * 2;
      ringUvs.setXY(i, dist, 0.5);
    }
    ringUvs.needsUpdate = true;

    const ringMat = new THREE.MeshBasicMaterial({
      map: ringTexture,
      color: new THREE.Color(activePlanet.ringColor),
      transparent: true,
      opacity: activePlanet.hasRings ? 0.75 : 0.0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.3;
    ringMesh.rotation.y = Math.PI / 7;
    scene.add(ringMesh);

    // 7. Swarm of 3D Orbiting Satellites & Glowing Telemetry Nodes
    const satelliteGroup = new THREE.Group();
    scene.add(satelliteGroup);

    const satellites: { mesh: THREE.Mesh; speed: number; radius: number; inclination: number; phase: number }[] = [];

    const satGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    for (let i = 0; i < 4; i++) {
      const satMesh = new THREE.Mesh(satGeo, satMat);
      const sat = {
        mesh: satMesh,
        speed: 0.4 + i * 0.15,
        radius: 4.8 + i * 0.9,
        inclination: (Math.PI / 4) * (i % 2 === 0 ? 1 : -0.8),
        phase: (Math.PI * 2 * i) / 4,
      };
      satellites.push(sat);
      satelliteGroup.add(satMesh);

      // Trajectory Ring Line
      const trajGeo = new THREE.TorusGeometry(sat.radius, 0.015, 16, 120);
      const trajMat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: 0.22 });
      const trajMesh = new THREE.Mesh(trajGeo, trajMat);
      trajMesh.rotation.x = sat.inclination;
      satelliteGroup.add(trajMesh);
    }

    // 8. Studio Solar Lighting System
    const ambientLight = new THREE.AmbientLight(0x2a1b4e, 0.6);
    scene.add(ambientLight);

    const mainSunLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainSunLight.position.set(12, 10, 9);
    scene.add(mainSunLight);

    const secondaryRimLight = new THREE.DirectionalLight(0xc084fc, 2.2);
    secondaryRimLight.position.set(-12, -6, -9);
    scene.add(secondaryRimLight);

    const cyanFillLight = new THREE.PointLight(0x38bdf8, 1.8, 50);
    cyanFillLight.position.set(-8, 8, 4);
    scene.add(cyanFillLight);

    // 9. Interactive 3D Orbit Dragging Physics
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let velocity = { x: 0.003, y: 0 };
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      const mouseNormalizedX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const mouseNormalizedY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      
      targetCameraX = mouseNormalizedX * 0.8;
      targetCameraY = -mouseNormalizedY * 0.8;

      if (isDragging) {
        const deltaX = e.clientX - prevMouse.x;
        const deltaY = e.clientY - prevMouse.y;

        velocity.x = deltaX * 0.004;
        velocity.y = deltaY * 0.004;

        planetMesh.rotation.y += velocity.x;
        planetMesh.rotation.x += velocity.y;
        atmosphereMesh.rotation.y += velocity.x;

        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // 10. Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 11. 60FPS Smooth Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const renderLoop = () => {
      animId = requestAnimationFrame(renderLoop);
      const elapsed = clock.getElapsedTime();

      // Lerp planet material colors smoothly
      planetMat.color.lerp(targetColorRef.current, 0.06);
      planetMat.emissive.lerp(targetEmissiveRef.current, 0.06);
      atmosphereMesh.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);
      atmoMat.color.lerp(targetColorRef.current, 0.06);
      ringMat.color.lerp(targetRingColorRef.current, 0.06);

      // Smoothly fade ring in/out based on planet profile
      const targetRingOpacity = targetHasRingsRef.current ? 0.75 : 0.0;
      ringMat.opacity += (targetRingOpacity - ringMat.opacity) * 0.06;

      // Inertial momentum rotation
      if (!isDragging) {
        velocity.x *= 0.95;
        velocity.y *= 0.95;
        planetMesh.rotation.y += 0.0025 + velocity.x;
        planetMesh.rotation.x += velocity.y;
      }

      // Ring gentle wobble and rotation
      ringMesh.rotation.z = elapsed * 0.04;

      // Satellites orbital tracks
      satellites.forEach((sat) => {
        const theta = elapsed * sat.speed + sat.phase;
        const x = Math.cos(theta) * sat.radius;
        const z = Math.sin(theta) * sat.radius;
        const y = Math.sin(theta) * Math.sin(sat.inclination) * (sat.radius * 0.45);

        sat.mesh.position.set(x, y, z);
      });

      // Parallax camera easing
      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Starfield slow cosmic drift
      starField.rotation.y = elapsed * 0.008;

      renderer.render(scene, camera);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CELESTIAL_NODES.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CELESTIAL_NODES.length) % CELESTIAL_NODES.length);
  };

  return (
    <div className="relative w-full min-h-screen bg-[#05030A] text-white flex flex-col justify-between overflow-hidden select-none">
      
      {/* 3D WebGL Canvas Layer */}
      <div ref={mountRef} className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing" />

      {/* Top Header Navigation Overlay */}
      <div className="relative z-10 w-full px-6 sm:px-12 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#A855F7] via-[#8B5CF6] to-[#05030A] p-0.5 shadow-lg shadow-[#8B5CF6]/40 glow-signal flex items-center justify-center border border-[#C084FC]/50">
            <Shield className="h-5 w-5 text-[#C084FC]" />
          </div>
          <div>
            <span className="text-lg font-black tracking-widest text-white font-heading">NEXORA</span>
            <span className="block text-[9px] font-mono text-[#C4B5FD] tracking-wider">SOLAR SYSTEM 3D SRE</span>
          </div>
        </div>

        {/* Live Coordinate Badge */}
        <div className="hidden md:flex items-center space-x-3 px-4 py-2 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/30 backdrop-blur-xl font-mono text-xs text-[#C4B5FD] shadow-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A855F7] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
          </span>
          <span>ORBITAL COORDINATES: 23° 41&apos; N / 88° 22&apos; E</span>
          <span className="text-[#06D6A0] font-bold">[ONLINE]</span>
        </div>

        {/* Quick Launch CTA & Login */}
        <div className="flex items-center space-x-3">
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-2xl bg-[#0D091A]/90 border border-[#8B5CF6]/30 text-xs font-bold text-[#C4B5FD] hover:text-white hover:border-[#A855F7]/60 transition-all cursor-pointer font-heading shadow-md backdrop-blur-xl"
            >
              <Lock className="h-3.5 w-3.5 text-[#C084FC]" />
              <span>SRE LOGIN</span>
            </button>
          )}
        </div>
      </div>

      {/* Center Main Stage */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 flex-1 flex flex-col md:flex-row items-center justify-between gap-8 py-8 pointer-events-none">
        
        {/* Left HUD: Planet Title, Subtitle, Description & Actions */}
        <div className="max-w-lg space-y-5 pointer-events-auto">
          
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-bold text-[#C084FC] font-heading backdrop-blur-md">
            <Orbit className="h-3.5 w-3.5 text-[#A855F7] animate-spin" />
            <span>CELESTIAL SYSTEM / {activePlanet.num}</span>
          </div>

          <div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-heading uppercase drop-shadow-2xl">
              {activePlanet.name}
            </h1>
            <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#1E143E]/80 border border-[#8B5CF6]/40 text-xs font-mono tracking-wider font-semibold text-[#C4B5FD] uppercase">
              {activePlanet.subtitle}
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#C4B5FD]/90 leading-relaxed font-sans max-w-md drop-shadow-md">
            {activePlanet.desc}
          </p>

          <div className="flex items-center space-x-4 pt-2">
            <button
              onClick={onLaunch}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#A855F7] via-[#8B5CF6] to-[#6366F1] text-xs font-black tracking-wider text-white shadow-xl shadow-[#8B5CF6]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer font-heading border border-[#C084FC]/50"
            >
              <span>EXPLORE MISSION</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenDemo}
              className="flex items-center space-x-2 px-5 py-3.5 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/30 text-xs font-bold text-[#C4B5FD] hover:text-white hover:border-[#8B5CF6]/60 transition-all cursor-pointer font-heading backdrop-blur-xl"
            >
              <Play className="h-3.5 w-3.5 fill-[#C084FC] text-[#C084FC]" />
              <span>90s DEMO SCRIPT</span>
            </button>
          </div>
        </div>

        {/* Right HUD: System Telemetry Specifications */}
        <div className="w-full max-w-xs p-5 sm:p-6 rounded-3xl bg-[#0B0716]/85 border border-[#8B5CF6]/30 shadow-2xl backdrop-blur-2xl pointer-events-auto space-y-4 animate-in fade-in zoom-in-95">
          
          <div className="flex items-center justify-between pb-3 border-b border-[#8B5CF6]/20">
            <span className="text-[11px] font-bold text-[#C4B5FD] uppercase tracking-wider font-heading flex items-center space-x-1.5">
              <Activity className="h-3.5 w-3.5 text-[#06D6A0]" />
              <span>SYSTEM TELEMETRY HUD</span>
            </span>
            <span className="text-[9px] font-mono text-[#06D6A0] bg-[#06D6A0]/10 px-2 py-0.5 rounded-full border border-[#06D6A0]/30">
              {activePlanet.specs.status}
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#C4B5FD]/70">ACK SLA TARGET:</span>
              <span className="text-white font-bold">{activePlanet.specs.sla}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C4B5FD]/70">GLOBAL LATENCY:</span>
              <span className="text-[#C084FC] font-bold">{activePlanet.specs.speed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C4B5FD]/70">THROUGHPUT MASS:</span>
              <span className="text-white font-bold">{activePlanet.specs.traffic}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#C4B5FD]/70">CONFIDENCE ORBIT:</span>
              <span className="text-[#38BDF8] font-bold">{activePlanet.specs.accuracy}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#8B5CF6]/20 text-center">
            <div className="text-[10px] font-mono text-[#C4B5FD]/60 flex items-center justify-center space-x-1.5">
              <Rotate3d className="h-3 w-3 text-[#A855F7]" />
              <span>DRAG TO ROTATE 3D PLANET • CLICK TIMELINE TO SWITCH</span>
            </div>
          </div>

        </div>

      </div>

      {/* Bottom Orbital Timeline Node Selector Bar */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 pb-8 flex items-center justify-between gap-4">
        
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/30 text-[#C4B5FD] hover:text-white hover:border-[#8B5CF6]/60 hover:bg-[#1E143E] transition-all cursor-pointer backdrop-blur-xl shadow-lg"
          title="Previous Planet Node"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Orbit Node Pills Carousel */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-5 gap-2.5 overflow-x-auto no-scrollbar py-1">
          {CELESTIAL_NODES.map((node, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={node.id}
                onClick={() => setActiveIndex(index)}
                className={`p-3 rounded-2xl text-left transition-all duration-300 cursor-pointer backdrop-blur-xl border ${
                  isActive
                    ? "bg-gradient-to-br from-[#1E143E] to-[#0D091A] border-[#A855F7] shadow-xl shadow-[#8B5CF6]/30 scale-[1.03]"
                    : "bg-[#0D091A]/60 border-[#8B5CF6]/20 hover:border-[#8B5CF6]/40 hover:bg-[#1E143E]/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[9px] font-mono text-[#C4B5FD]/60">{node.num}</span>
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: node.color }}
                  />
                </div>
                <div className="text-xs font-black text-white font-heading truncate">
                  {node.name}
                </div>
                <div className="text-[9px] font-mono text-[#C4B5FD]/70 truncate">
                  {node.specs.sla}
                </div>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-[#0D091A]/80 border border-[#8B5CF6]/30 text-[#C4B5FD] hover:text-white hover:border-[#8B5CF6]/60 hover:bg-[#1E143E] transition-all cursor-pointer backdrop-blur-xl shadow-lg"
          title="Next Planet Node"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

      </div>

    </div>
  );
};
