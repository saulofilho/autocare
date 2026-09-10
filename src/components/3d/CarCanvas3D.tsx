import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { car3DComponents } from '../../data/mockData';
import { CarComponent3DInfo } from '../../types/vehicle';
import { buildDetailedCarModel, CarModelObjects } from './CarModelBuilder';
import { 
  Eye, 
  RotateCw, 
  Sparkles, 
  Zap, 
  Layers, 
  Sliders, 
  Activity, 
  Wrench, 
  Info, 
  Sun,
  ChevronRight,
  Shield,
  Gauge,
  Compass
} from 'lucide-react';

interface CarCanvas3DProps {
  vehicleColor?: string;
  onSelectComponent?: (component: CarComponent3DInfo) => void;
  selectedComponentId?: string | null;
  onScheduleService?: (componentName: string) => void;
}

export const CarCanvas3D: React.FC<CarCanvas3DProps> = ({
  vehicleColor = '#2563eb',
  onSelectComponent,
  selectedComponentId,
  onScheduleService
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // View states
  const [viewMode, setViewMode] = useState<'external' | 'internal' | 'xray'>('internal');
  const [explodeValue, setExplodeValue] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [headlightsOn, setHeadlightsOn] = useState<boolean>(true);
  const [hoodOpen, setHoodOpen] = useState<boolean>(false);
  const [doorOpen, setDoorOpen] = useState<boolean>(false);
  const [engineRunning, setEngineRunning] = useState<boolean>(true);

  const [activeComponent, setActiveComponent] = useState<CarComponent3DInfo | null>(
    car3DComponents.find(c => c.id === 'engine') || null
  );
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'engine' | 'brakes' | 'undercar' | 'interior' | 'rear'>('perspective');

  // Animation and Three.js references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const carModelRef = useRef<CarModelObjects | null>(null);

  // Orbit state
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const sphericalRef = useRef<{ radius: number; theta: number; phi: number }>({
    radius: 7.2,
    theta: Math.PI / 4,
    phi: Math.PI / 3.2
  });
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.45, 0));

  // Sync external selectedComponentId
  useEffect(() => {
    if (selectedComponentId) {
      const comp = car3DComponents.find(c => c.id === selectedComponentId);
      if (comp) {
        setActiveComponent(comp);
      }
    }
  }, [selectedComponentId]);

  // Spherical camera updater helper
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = sphericalRef.current;
    
    const clampedPhi = Math.max(0.1, Math.min(Math.PI / 2 - 0.04, phi));
    sphericalRef.current.phi = clampedPhi;

    const x = radius * Math.sin(clampedPhi) * Math.sin(theta);
    const y = radius * Math.cos(clampedPhi);
    const z = radius * Math.sin(clampedPhi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(targetLookAtRef.current);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Scene - Apple Dark Stage Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#050507');
    scene.fog = new THREE.FogExp2('#050507', 0.032);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    updateCameraPosition();

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    // Studio Stage Lighting Setup (Apple Keynote Quality)
    const ambientLight = new THREE.AmbientLight('#ffffff', 1.1);
    scene.add(ambientLight);

    // Main Overhead Softbox
    const overheadKeyLight = new THREE.SpotLight('#ffffff', 4.5);
    overheadKeyLight.position.set(5, 10, 5);
    overheadKeyLight.angle = Math.PI / 3.5;
    overheadKeyLight.penumbra = 0.7;
    overheadKeyLight.castShadow = true;
    overheadKeyLight.shadow.mapSize.width = 1024;
    overheadKeyLight.shadow.mapSize.height = 1024;
    scene.add(overheadKeyLight);

    // Front Rim Light (Ice Blue for sharp edges)
    const frontRim = new THREE.DirectionalLight('#38bdf8', 1.8);
    frontRim.position.set(-6, 4, 6);
    scene.add(frontRim);

    // Rear Warm Rim Light (Gives car paint high-end metallic contour)
    const rearRim = new THREE.DirectionalLight('#f59e0b', 1.4);
    rearRim.position.set(6, 4, -6);
    scene.add(rearRim);

    // Soft Upward Bounce Fill Light
    const floorBounce = new THREE.DirectionalLight('#ffffff', 0.65);
    floorBounce.position.set(0, -3, 0);
    scene.add(floorBounce);

    // Apple Studio Stage Floor Disc
    const floorGeo = new THREE.CircleGeometry(12, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#070709',
      roughness: 0.88,
      metalness: 0.15
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -0.01;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Concentric studio floor ring markings
    const ringMat = new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.07, side: THREE.DoubleSide });
    
    const ringGeo1 = new THREE.RingGeometry(3.6, 3.63, 64);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.001;
    scene.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(6.4, 6.43, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.001;
    scene.add(ring2);

    // Realistic Contact Shadow under car
    const shadowPlaneGeo = new THREE.PlaneGeometry(2.4, 4.8);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 128, 10, 64, 128, 110);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.45)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlaneMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.8,
      depthWrite: false
    });
    const contactShadow = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.002;
    scene.add(contactShadow);

    // ================= BUILD DETAILED CAR MODEL =================
    const carObjects = buildDetailedCarModel(vehicleColor);
    carModelRef.current = carObjects;
    scene.add(carObjects.carRoot);

    // Animation Loop
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Live Engine simulation
      if (engineRunning) {
        // Pistons pumping with firing order offset
        carObjects.pistons.forEach((piston, idx) => {
          const firingOffsets = [0, Math.PI, Math.PI * 0.5, Math.PI * 1.5];
          const offset = firingOffsets[idx] || 0;
          piston.position.y = Math.sin(elapsedTime * 18 + offset) * 0.08;
        });

        // Twin cooling fans spinning
        carObjects.coolingFans.forEach(fan => {
          fan.rotation.z += 0.25;
        });

        // Serpentine pulleys spinning
        carObjects.pulleys.forEach(pulley => {
          pulley.rotation.z += 0.15;
        });

        // Turbocharger turbine spinning
        carObjects.turbines.forEach(turb => {
          turb.rotation.z += 0.4;
        });
      }

      // Hotspots pulsing glow & scale beacon
      carObjects.hotspotPins.forEach(({ mesh }, idx) => {
        const pulse = 1 + Math.sin(elapsedTime * 3.5 + idx) * 0.18;
        mesh.scale.set(pulse, pulse, pulse);
      });

      // Auto rotation
      if (autoRotate && !isDraggingRef.current) {
        sphericalRef.current.theta += 0.004;
        updateCameraPosition();
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width, height } = entries[0].contentRect;
      if (width === 0 || height === 0) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [engineRunning]);

  // Update vehicle paint color
  useEffect(() => {
    if (carModelRef.current) {
      carModelRef.current.bodyMaterials.forEach(mat => {
        mat.color.set(vehicleColor);
      });
    }
  }, [vehicleColor]);

  // Update View Mode (External / Internal / X-Ray)
  useEffect(() => {
    if (!carModelRef.current) return;
    const mats = carModelRef.current.bodyMaterials;
    mats.forEach(mat => {
      if (viewMode === 'internal') {
        mat.transparent = true;
        mat.opacity = 0.22;
        mat.wireframe = false;
      } else if (viewMode === 'xray') {
        mat.transparent = true;
        mat.opacity = 0.15;
        mat.wireframe = true;
      } else {
        mat.transparent = false;
        mat.opacity = 1.0;
        mat.wireframe = false;
      }
      mat.needsUpdate = true;
    });
  }, [viewMode]);

  // Headlights toggle
  useEffect(() => {
    if (!carModelRef.current) return;
    carModelRef.current.headlightSpots.forEach(spot => {
      spot.intensity = headlightsOn ? 3.5 : 0;
    });
    carModelRef.current.headlightGlows.forEach(mesh => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = headlightsOn ? 2.8 : 0.2;
      }
    });
  }, [headlightsOn]);

  // Open / Close Hood animation
  useEffect(() => {
    if (!carModelRef.current) return;
    const hood = carModelRef.current.hoodAssembly;
    if (hood) {
      hood.rotation.x = hoodOpen ? -Math.PI / 4.2 : 0;
    }
  }, [hoodOpen]);

  // Open / Close Driver Door
  useEffect(() => {
    if (!carModelRef.current) return;
    const door = carModelRef.current.driverDoorAssembly;
    if (door) {
      door.rotation.y = doorOpen ? Math.PI / 3.8 : 0;
    }
  }, [doorOpen]);

  // Exploded View effect
  useEffect(() => {
    if (!carModelRef.current) return;
    const { exteriorGroup, engineGroup, wheelsGroup, chassisGroup, interiorGroup } = carModelRef.current;
    const ratio = explodeValue;

    // Exterior lifts up
    exteriorGroup.position.y = ratio * 1.65;
    
    // Interior floats slightly
    interiorGroup.position.y = ratio * 0.6;

    // Engine bay separates forward and upward
    engineGroup.position.y = ratio * 0.45;
    engineGroup.position.z = ratio * 0.55;

    // Chassis lowers slightly
    chassisGroup.position.y = -ratio * 0.2;

    // Wheels explode outward left and right
    wheelsGroup.children.forEach((wheel, idx) => {
      const isLeft = idx % 2 === 0;
      const baseSign = isLeft ? -1 : 1;
      const baseX = baseSign * 0.92;
      wheel.position.x = baseX + (baseSign * ratio * 0.95);
    });
  }, [explodeValue]);

  // Preset cameras
  const handleSetPreset = (preset: 'perspective' | 'engine' | 'brakes' | 'undercar' | 'interior' | 'rear') => {
    setCameraPreset(preset);
    if (preset === 'perspective') {
      sphericalRef.current = { radius: 7.2, theta: Math.PI / 4, phi: Math.PI / 3.2 };
      targetLookAtRef.current.set(0, 0.45, 0);
    } else if (preset === 'engine') {
      setViewMode('internal');
      setHoodOpen(true);
      sphericalRef.current = { radius: 3.5, theta: 0.12, phi: Math.PI / 4.5 };
      targetLookAtRef.current.set(0, 0.65, 1.35);
      const eng = car3DComponents.find(c => c.id === 'engine');
      if (eng) setActiveComponent(eng);
    } else if (preset === 'brakes') {
      setViewMode('internal');
      sphericalRef.current = { radius: 2.6, theta: -Math.PI / 2.2, phi: Math.PI / 2.3 };
      targetLookAtRef.current.set(-0.92, 0.36, 1.4);
      const brk = car3DComponents.find(c => c.id === 'brakes');
      if (brk) setActiveComponent(brk);
    } else if (preset === 'undercar') {
      setViewMode('xray');
      sphericalRef.current = { radius: 5.2, theta: Math.PI / 3.2, phi: Math.PI / 2.05 };
      targetLookAtRef.current.set(0, 0.25, 0);
    } else if (preset === 'interior') {
      setViewMode('internal');
      setDoorOpen(true);
      sphericalRef.current = { radius: 3.2, theta: -Math.PI / 2.6, phi: Math.PI / 3.6 };
      targetLookAtRef.current.set(-0.25, 0.75, 0);
    } else if (preset === 'rear') {
      sphericalRef.current = { radius: 6.4, theta: Math.PI, phi: Math.PI / 2.9 };
      targetLookAtRef.current.set(0, 0.45, -0.9);
      const exh = car3DComponents.find(c => c.id === 'exhaust');
      if (exh) setActiveComponent(exh);
    }
    updateCameraPosition();
  };

  // Mouse & Touch interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.007;
    sphericalRef.current.phi -= deltaY * 0.007;

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    sphericalRef.current.radius = Math.max(2.0, Math.min(13, sphericalRef.current.radius + e.deltaY * 0.004));
    updateCameraPosition();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    sphericalRef.current.theta -= deltaX * 0.008;
    sphericalRef.current.phi -= deltaY * 0.008;

    updateCameraPosition();
    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Click on 3D Hotspots
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const camera = cameraRef.current;
    if (!canvas || !camera || !carModelRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const meshes = carModelRef.current.hotspotPins.map(h => h.mesh);
    const intersects = raycaster.intersectObjects(meshes);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object as THREE.Mesh;
      const found = carModelRef.current.hotspotPins.find(h => h.mesh === hitMesh);
      if (found) {
        setActiveComponent(found.comp);
        onSelectComponent?.(found.comp);
      }
    }
  };

  return (
    <div className="relative w-full h-[680px] rounded-3xl overflow-hidden bg-[#050507] border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col group">
      {/* Top Floating Apple-style HUD controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Apple Segmented View Mode Pill */}
        <div className="inline-flex p-1 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 shadow-xl pointer-events-auto">
          <button
            id="btn-3d-external"
            onClick={() => setViewMode('external')}
            className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'external'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            3D Externo
          </button>
          <button
            id="btn-3d-internal"
            onClick={() => setViewMode('internal')}
            className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'internal'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#2997ff]" />
            Mecânica Interna
          </button>
          <button
            id="btn-3d-xray"
            onClick={() => setViewMode('xray')}
            className={`px-3.5 py-1.5 text-xs font-medium tracking-tight rounded-full transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'xray'
                ? 'bg-white text-black font-semibold shadow-sm'
                : 'text-[#86868b] hover:text-[#f5f5f7]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#30d158]" />
            Estrutura CAD
          </button>
        </div>

        {/* Camera Angles Segmented Control */}
        <div className="hidden lg:inline-flex p-1 bg-black/60 backdrop-blur-2xl rounded-full border border-white/10 shadow-xl pointer-events-auto">
          <span className="text-[11px] font-medium text-[#86868b] px-3 self-center">Foco:</span>
          {(['perspective', 'engine', 'brakes', 'undercar', 'interior', 'rear'] as const).map((preset) => {
            const labels: Record<string, string> = {
              perspective: 'Geral',
              engine: 'Motor & Turbo',
              brakes: 'Freios & Molas',
              undercar: 'Chassi & Cardã',
              interior: 'Cockpit',
              rear: 'Exaustão'
            };
            return (
              <button
                key={preset}
                id={`btn-preset-${preset}`}
                onClick={() => handleSetPreset(preset)}
                className={`px-3 py-1 text-xs rounded-full font-medium tracking-tight transition-all cursor-pointer ${
                  cameraPreset === preset
                    ? 'bg-white/15 text-white font-semibold'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                {labels[preset]}
              </button>
            );
          })}
        </div>

        {/* Apple-style Interactive Micro Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Live Engine Running Simulation Toggle */}
          <button
            id="btn-toggle-engine-run"
            onClick={() => setEngineRunning(!engineRunning)}
            title={engineRunning ? 'Desligar Simulação do Motor' : 'Ligar Simulação do Motor (Pistões & Correias)'}
            className={`px-3 py-1.5 rounded-full backdrop-blur-2xl border text-xs font-medium tracking-tight transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              engineRunning
                ? 'bg-[#30d158]/15 border-[#30d158]/40 text-[#30d158]'
                : 'bg-black/60 border-white/10 text-[#86868b] hover:text-white'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${engineRunning ? 'animate-pulse text-[#30d158]' : ''}`} />
            <span>{engineRunning ? 'Motor Ligado' : 'Motor Desligado'}</span>
          </button>

          {/* 360 Rotation */}
          <button
            id="btn-toggle-rotate"
            onClick={() => setAutoRotate(!autoRotate)}
            title="Giro Orbital 360°"
            className={`p-2 rounded-full backdrop-blur-2xl border text-xs transition-all duration-200 cursor-pointer ${
              autoRotate
                ? 'bg-[#2997ff]/20 border-[#2997ff]/50 text-[#2997ff]'
                : 'bg-black/60 border-white/10 text-[#86868b] hover:text-white hover:bg-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>

          {/* Headlights */}
          <button
            id="btn-toggle-lights"
            onClick={() => setHeadlightsOn(!headlightsOn)}
            title="Faróis Matrix LED"
            className={`p-2 rounded-full backdrop-blur-2xl border text-xs transition-all duration-200 cursor-pointer ${
              headlightsOn
                ? 'bg-[#ff9f0a]/20 border-[#ff9f0a]/50 text-[#ff9f0a]'
                : 'bg-black/60 border-white/10 text-[#86868b] hover:text-white hover:bg-white/10'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
          </button>

          {/* Hood Open */}
          <button
            id="btn-toggle-hood"
            onClick={() => setHoodOpen(!hoodOpen)}
            className={`px-3 py-1.5 rounded-full backdrop-blur-2xl border text-xs font-medium tracking-tight transition-all duration-200 cursor-pointer ${
              hoodOpen
                ? 'bg-[#30d158]/20 border-[#30d158]/50 text-[#30d158]'
                : 'bg-black/60 border-white/10 text-[#86868b] hover:text-white hover:bg-white/10'
            }`}
          >
            {hoodOpen ? 'Fechar Capô' : 'Abrir Capô'}
          </button>

          {/* Door Open */}
          <button
            id="btn-toggle-door"
            onClick={() => setDoorOpen(!doorOpen)}
            className={`px-3 py-1.5 rounded-full backdrop-blur-2xl border text-xs font-medium tracking-tight transition-all duration-200 cursor-pointer ${
              doorOpen
                ? 'bg-[#2997ff]/20 border-[#2997ff]/50 text-[#2997ff]'
                : 'bg-black/60 border-white/10 text-[#86868b] hover:text-white hover:bg-white/10'
            }`}
          >
            {doorOpen ? 'Fechar Porta' : 'Abrir Porta'}
          </button>
        </div>
      </div>

      {/* 3D Canvas Element */}
      <div 
        ref={containerRef} 
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
          className="w-full h-full block" 
        />

        {/* Apple-style Exploded View Slider Pill */}
        <div className="absolute bottom-5 left-5 z-20 bg-black/65 backdrop-blur-2xl px-4 py-3 rounded-2xl border border-white/10 shadow-2xl w-64">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-[#f5f5f7] tracking-tight flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#2997ff]" />
              Vista Explodida CAD
            </span>
            <span className="font-mono text-xs text-[#2997ff] font-semibold">{Math.round(explodeValue * 100)}%</span>
          </div>
          <input
            id="input-explode-range"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={explodeValue}
            onChange={(e) => setExplodeValue(parseFloat(e.target.value))}
            className="w-full accent-[#2997ff] cursor-pointer h-1.5 bg-white/20 rounded-full"
          />
          <div className="flex justify-between text-[10px] text-[#86868b] mt-1.5">
            <span>Carroceria Montada</span>
            <span>Subsistemas Separados</span>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="absolute bottom-5 right-5 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2 bg-black/65 backdrop-blur-2xl rounded-full border border-white/10 text-xs text-[#86868b]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#30d158]"></span>
            <span className="text-[#f5f5f7]">Operacional</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff9f0a]"></span>
            <span className="text-[#f5f5f7]">Atenção</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#ff3b30] animate-pulse"></span>
            <span className="text-[#f5f5f7]">Crítico</span>
          </div>
          <span className="w-px h-3 bg-white/15"></span>
          <span className="text-[11px] text-[#86868b]">Arraste para orbitar • Role para zoom</span>
        </div>
      </div>

      {/* Apple-style Inspection Bar at the bottom of the stage */}
      {activeComponent && (
        <div className="bg-[#161617]/95 border-t border-white/[0.08] backdrop-blur-2xl p-4 sm:p-5 z-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`px-2.5 py-0.5 text-[10px] font-semibold tracking-wide rounded-full ${
                activeComponent.urgency === 'critical'
                  ? 'bg-[#ff3b30]/15 text-[#ff3b30] border border-[#ff3b30]/30'
                  : activeComponent.urgency === 'warning'
                  ? 'bg-[#ff9f0a]/15 text-[#ff9f0a] border border-[#ff9f0a]/30'
                  : 'bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30'
              }`}>
                {activeComponent.category} • {activeComponent.urgency === 'critical' ? 'Ação Imediata' : activeComponent.urgency === 'warning' ? 'Revisão Recomendada' : 'Excelente Estado'}
              </span>
              <span className="text-xs text-[#86868b] font-mono">Índice de Saúde: {activeComponent.healthPercent}%</span>
            </div>

            <h3 className="text-base sm:text-lg font-semibold text-[#f5f5f7] tracking-tight">
              {activeComponent.name}
            </h3>
            <p className="text-xs text-[#86868b] mt-1 line-clamp-1 max-w-3xl leading-relaxed">
              {activeComponent.howItWorks}
            </p>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              id="btn-inspect-details"
              onClick={() => onSelectComponent?.(activeComponent)}
              className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-[#f5f5f7] text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer border border-white/[0.08]"
            >
              <Info className="w-3.5 h-3.5 text-[#86868b]" />
              Ficha Técnica
            </button>
            <button
              id="btn-schedule-component"
              onClick={() => onScheduleService?.(activeComponent.name)}
              className="px-4 py-2 rounded-full bg-[#0071e3] hover:bg-[#0077ed] text-white text-xs font-semibold tracking-tight shadow-md shadow-[#0071e3]/25 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              Agendar Serviço
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
