import * as THREE from 'three';
import { CarComponent3DInfo } from '../../types/vehicle';
import { car3DComponents } from '../../data/mockData';

export interface CarModelObjects {
  carRoot: THREE.Group;
  exteriorGroup: THREE.Group;
  engineGroup: THREE.Group;
  wheelsGroup: THREE.Group;
  interiorGroup: THREE.Group;
  chassisGroup: THREE.Group;
  hoodAssembly: THREE.Group;
  driverDoorAssembly: THREE.Group;
  pistons: THREE.Mesh[];
  coolingFans: THREE.Mesh[];
  pulleys: THREE.Mesh[];
  turbines: THREE.Mesh[];
  headlightSpots: THREE.SpotLight[];
  headlightGlows: THREE.Mesh[];
  taillightGlows: THREE.Mesh[];
  bodyMaterials: THREE.MeshPhysicalMaterial[];
  hotspotPins: { mesh: THREE.Mesh; comp: CarComponent3DInfo }[];
}

export function buildDetailedCarModel(vehicleColor: string): CarModelObjects {
  const carRoot = new THREE.Group();

  const exteriorGroup = new THREE.Group();
  const engineGroup = new THREE.Group();
  const wheelsGroup = new THREE.Group();
  const interiorGroup = new THREE.Group();
  const chassisGroup = new THREE.Group();

  carRoot.add(chassisGroup);
  carRoot.add(exteriorGroup);
  carRoot.add(engineGroup);
  carRoot.add(interiorGroup);
  carRoot.add(wheelsGroup);

  const bodyMaterials: THREE.MeshPhysicalMaterial[] = [];
  const pistons: THREE.Mesh[] = [];
  const coolingFans: THREE.Mesh[] = [];
  const pulleys: THREE.Mesh[] = [];
  const turbines: THREE.Mesh[] = [];
  const headlightSpots: THREE.SpotLight[] = [];
  const headlightGlows: THREE.Mesh[] = [];
  const taillightGlows: THREE.Mesh[] = [];

  // ==========================================
  // 1. MASTER SHADER MATERIALS
  // ==========================================
  const bodyPaintMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(vehicleColor),
    metalness: 0.85,
    roughness: 0.16,
    clearcoat: 1.0,
    clearcoatRoughness: 0.04,
    reflectivity: 0.98,
  });
  bodyMaterials.push(bodyPaintMat);

  const carbonFiberMat = new THREE.MeshStandardMaterial({
    color: '#18181b',
    roughness: 0.45,
    metalness: 0.35,
  });

  const satinBlackTrimMat = new THREE.MeshStandardMaterial({
    color: '#0f0f11',
    roughness: 0.65,
    metalness: 0.2,
  });

  const chromeMirrorMat = new THREE.MeshStandardMaterial({
    color: '#f8fafc',
    metalness: 0.98,
    roughness: 0.05,
  });

  const brushedAluminumMat = new THREE.MeshStandardMaterial({
    color: '#cbd5e1',
    metalness: 0.88,
    roughness: 0.22,
  });

  const castIronEngineMat = new THREE.MeshStandardMaterial({
    color: '#334155',
    metalness: 0.75,
    roughness: 0.4,
  });

  const tintedGlassMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0c1322'),
    metalness: 0.1,
    roughness: 0.02,
    transmission: 0.88,
    transparent: true,
    opacity: 0.45,
    ior: 1.52,
  });

  const tireRubberMat = new THREE.MeshStandardMaterial({
    color: '#131316',
    roughness: 0.92,
    metalness: 0.05,
  });

  const brakeCaliperRedMat = new THREE.MeshStandardMaterial({
    color: '#ef4444',
    metalness: 0.4,
    roughness: 0.18,
  });

  const copperGoldMat = new THREE.MeshStandardMaterial({
    color: '#f59e0b',
    metalness: 0.92,
    roughness: 0.2,
  });

  const headlightEmissiveMat = new THREE.MeshStandardMaterial({
    color: '#ffffff',
    emissive: '#e0f2fe',
    emissiveIntensity: 2.8,
  });

  const taillightEmissiveMat = new THREE.MeshStandardMaterial({
    color: '#ff3b30',
    emissive: '#ff3b30',
    emissiveIntensity: 2.2,
  });

  // ==========================================
  // 2. DETAILED CHASSIS & FLOOR PAN
  // ==========================================
  // Main platform floorpan
  const floorPanGeo = new THREE.BoxGeometry(1.78, 0.12, 4.3);
  const floorPanMesh = new THREE.Mesh(floorPanGeo, satinBlackTrimMat);
  floorPanMesh.position.set(0, 0.26, 0);
  floorPanMesh.castShadow = true;
  floorPanMesh.receiveShadow = true;
  chassisGroup.add(floorPanMesh);

  // Subframe rails (left and right longitudinal structural members)
  const railGeo = new THREE.BoxGeometry(0.16, 0.15, 4.2);
  const leftRail = new THREE.Mesh(railGeo, castIronEngineMat);
  leftRail.position.set(-0.65, 0.22, 0);
  const rightRail = new THREE.Mesh(railGeo, castIronEngineMat);
  rightRail.position.set(0.65, 0.22, 0);
  chassisGroup.add(leftRail, rightRail);

  // Front engine cradle subframe
  const subframeCrossGeo = new THREE.BoxGeometry(1.6, 0.12, 0.8);
  const frontCradle = new THREE.Mesh(subframeCrossGeo, castIronEngineMat);
  frontCradle.position.set(0, 0.24, 1.35);
  chassisGroup.add(frontCradle);

  // ==========================================
  // 3. SCULPTED EXTERIOR BODYWORK
  // ==========================================
  // Lower side body rocker panels
  const sideRockerGeo = new THREE.BoxGeometry(0.15, 0.22, 2.7);
  const leftRocker = new THREE.Mesh(sideRockerGeo, satinBlackTrimMat);
  leftRocker.position.set(-0.88, 0.32, 0);
  const rightRocker = new THREE.Mesh(sideRockerGeo, satinBlackTrimMat);
  rightRocker.position.set(0.88, 0.32, 0);
  exteriorGroup.add(leftRocker, rightRocker);

  // Main cabin lower torso
  const lowerTorsoGeo = new THREE.BoxGeometry(1.8, 0.45, 2.7);
  const lowerTorso = new THREE.Mesh(lowerTorsoGeo, bodyPaintMat);
  lowerTorso.position.set(0, 0.58, -0.05);
  lowerTorso.castShadow = true;
  exteriorGroup.add(lowerTorso);

  // Flared Front Fenders (paralamas dianteiros esportivos)
  const fenderGeo = new THREE.BoxGeometry(0.24, 0.42, 1.15);
  const leftFender = new THREE.Mesh(fenderGeo, bodyPaintMat);
  leftFender.position.set(-0.84, 0.58, 1.35);
  const rightFender = new THREE.Mesh(fenderGeo, bodyPaintMat);
  rightFender.position.set(0.84, 0.58, 1.35);
  exteriorGroup.add(leftFender, rightFender);

  // Flared Rear Fenders (ombros traseiros)
  const rearFenderGeo = new THREE.BoxGeometry(0.26, 0.46, 1.25);
  const leftRearFender = new THREE.Mesh(rearFenderGeo, bodyPaintMat);
  leftRearFender.position.set(-0.85, 0.62, -1.35);
  const rightRearFender = new THREE.Mesh(rearFenderGeo, bodyPaintMat);
  rightRearFender.position.set(0.85, 0.62, -1.35);
  exteriorGroup.add(leftRearFender, rightRearFender);

  // Rear Trunk / Decklid
  const trunkGeo = new THREE.BoxGeometry(1.72, 0.36, 0.95);
  const trunkMesh = new THREE.Mesh(trunkGeo, bodyPaintMat);
  trunkMesh.position.set(0, 0.72, -1.75);
  exteriorGroup.add(trunkMesh);

  // Ducktail Rear Spoiler lip
  const spoilerGeo = new THREE.BoxGeometry(1.64, 0.05, 0.22);
  const spoilerMesh = new THREE.Mesh(spoilerGeo, carbonFiberMat);
  spoilerMesh.position.set(0, 0.91, -2.18);
  spoilerMesh.rotation.x = -0.15;
  exteriorGroup.add(spoilerMesh);

  // Aerodynamic Rear Diffuser with fins
  const diffuserGeo = new THREE.BoxGeometry(1.7, 0.26, 0.45);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonFiberMat);
  diffuser.position.set(0, 0.36, -2.18);
  exteriorGroup.add(diffuser);

  for (let f = -0.6; f <= 0.6; f += 0.3) {
    const finGeo = new THREE.BoxGeometry(0.04, 0.16, 0.38);
    const fin = new THREE.Mesh(finGeo, carbonFiberMat);
    fin.position.set(f, 0.34, -2.2);
    diffuser.add(fin);
  }

  // Front Fascia & Aerodynamic Splitter
  const frontBumperGeo = new THREE.BoxGeometry(1.8, 0.42, 0.52);
  const frontBumper = new THREE.Mesh(frontBumperGeo, bodyPaintMat);
  frontBumper.position.set(0, 0.52, 2.15);
  frontBumper.castShadow = true;
  exteriorGroup.add(frontBumper);

  const frontSplitterGeo = new THREE.BoxGeometry(1.84, 0.06, 0.48);
  const frontSplitter = new THREE.Mesh(frontSplitterGeo, carbonFiberMat);
  frontSplitter.position.set(0, 0.24, 2.24);
  frontSplitter.castShadow = true;
  exteriorGroup.add(frontSplitter);

  // Hexagonal Honeycomb Grille
  const grilleSurroundGeo = new THREE.BoxGeometry(1.24, 0.24, 0.06);
  const grilleSurround = new THREE.Mesh(grilleSurroundGeo, satinBlackTrimMat);
  grilleSurround.position.set(0, 0.54, 2.42);
  exteriorGroup.add(grilleSurround);

  const grilleMeshGeo = new THREE.BoxGeometry(1.18, 0.18, 0.03);
  const grilleMesh = new THREE.Mesh(grilleMeshGeo, carbonFiberMat);
  grilleMesh.position.set(0, 0.54, 2.44);
  exteriorGroup.add(grilleMesh);

  // Chrome Brand Badge on Grille
  const badgeGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.02, 24);
  const badgeMesh = new THREE.Mesh(badgeGeo, chromeMirrorMat);
  badgeMesh.rotation.x = Math.PI / 2;
  badgeMesh.position.set(0, 0.54, 2.46);
  exteriorGroup.add(badgeMesh);

  // ==========================================
  // 4. ANIMATED HOOD ASSEMBLY (Capô)
  // ==========================================
  const hoodAssembly = new THREE.Group();
  hoodAssembly.position.set(0, 0.78, 0.75); // Pivot at the windshield base

  const hoodPanelGeo = new THREE.BoxGeometry(1.68, 0.08, 1.45);
  const hoodPanel = new THREE.Mesh(hoodPanelGeo, bodyPaintMat);
  hoodPanel.position.set(0, 0, 0.72);
  hoodPanel.castShadow = true;
  hoodAssembly.add(hoodPanel);

  // Dual muscular hood bulge creases
  for (const xOff of [-0.42, 0.42]) {
    const bulgeGeo = new THREE.BoxGeometry(0.12, 0.03, 1.25);
    const bulge = new THREE.Mesh(bulgeGeo, bodyPaintMat);
    bulge.position.set(xOff, 0.045, 0.72);
    hoodAssembly.add(bulge);
  }

  // Hood Hydraulic Gas Struts (amortecedores do capô)
  for (const xOff of [-0.68, 0.68]) {
    const strutCylinder = new THREE.CylinderGeometry(0.015, 0.015, 0.45, 12);
    const strut = new THREE.Mesh(strutCylinder, chromeMirrorMat);
    strut.position.set(xOff, -0.15, 0.4);
    strut.rotation.x = 0.5;
    hoodAssembly.add(strut);
  }

  exteriorGroup.add(hoodAssembly);

  // ==========================================
  // 5. ANIMATED DRIVER DOOR (Porta do Motorista)
  // ==========================================
  const driverDoorAssembly = new THREE.Group();
  driverDoorAssembly.position.set(-0.9, 0.58, 0.7); // Hinge near front pillar

  const doorOuterGeo = new THREE.BoxGeometry(0.06, 0.48, 1.15);
  const doorOuter = new THREE.Mesh(doorOuterGeo, bodyPaintMat);
  doorOuter.position.set(0, 0, -0.57);
  doorOuter.castShadow = true;
  driverDoorAssembly.add(doorOuter);

  // Door handle (maçaneta)
  const handleGeo = new THREE.BoxGeometry(0.04, 0.04, 0.16);
  const handle = new THREE.Mesh(handleGeo, chromeMirrorMat);
  handle.position.set(-0.04, 0.1, -0.95);
  driverDoorAssembly.add(handle);

  exteriorGroup.add(driverDoorAssembly);

  // Side Mirrors with LED turn signals
  for (const side of [-1, 1]) {
    const mirrorStalkGeo = new THREE.CylinderGeometry(0.015, 0.02, 0.12, 12);
    const stalk = new THREE.Mesh(mirrorStalkGeo, satinBlackTrimMat);
    stalk.position.set(side * 0.95, 0.88, 0.65);
    stalk.rotation.z = side * 0.4;
    exteriorGroup.add(stalk);

    const mirrorCapGeo = new THREE.BoxGeometry(0.18, 0.1, 0.12);
    const mirrorCap = new THREE.Mesh(mirrorCapGeo, bodyPaintMat);
    mirrorCap.position.set(side * 1.05, 0.94, 0.65);
    exteriorGroup.add(mirrorCap);

    const glassFaceGeo = new THREE.BoxGeometry(0.01, 0.08, 0.1);
    const glassFace = new THREE.Mesh(glassFaceGeo, chromeMirrorMat);
    glassFace.position.set(side * (1.05 - side * 0.08), 0.94, 0.65);
    exteriorGroup.add(glassFace);

    // Amber LED strip on mirror cap
    const ledStripGeo = new THREE.BoxGeometry(0.02, 0.015, 0.1);
    const ledStrip = new THREE.Mesh(ledStripGeo, copperGoldMat);
    ledStrip.position.set(side * 1.13, 0.94, 0.65);
    exteriorGroup.add(ledStrip);
  }

  // ==========================================
  // 6. GREENHOUSE & GLASS CABIN (Janelas & Colunas)
  // ==========================================
  // Raked Windshield (Para-brisa inclinado)
  const windshieldGeo = new THREE.BoxGeometry(1.56, 0.62, 0.06);
  const windshield = new THREE.Mesh(windshieldGeo, tintedGlassMat);
  windshield.position.set(0, 1.05, 0.42);
  windshield.rotation.x = -Math.PI / 4.2;
  exteriorGroup.add(windshield);

  // Twin Windshield Wipers (palhetas)
  for (const wx of [-0.35, 0.25]) {
    const wiperGeo = new THREE.BoxGeometry(0.48, 0.015, 0.02);
    const wiper = new THREE.Mesh(wiperGeo, satinBlackTrimMat);
    wiper.position.set(wx, 0.84, 0.68);
    wiper.rotation.z = -0.12;
    wiper.rotation.y = 0.05;
    exteriorGroup.add(wiper);
  }

  // Panoramic Glass Roof
  const glassRoofGeo = new THREE.BoxGeometry(1.45, 0.04, 1.45);
  const glassRoof = new THREE.Mesh(glassRoofGeo, tintedGlassMat);
  glassRoof.position.set(0, 1.34, -0.32);
  exteriorGroup.add(glassRoof);

  // Roof Side Cantrails (colunas A, B, C)
  for (const side of [-0.75, 0.75]) {
    const railUpperGeo = new THREE.BoxGeometry(0.08, 0.08, 2.1);
    const railUpper = new THREE.Mesh(railUpperGeo, bodyPaintMat);
    railUpper.position.set(side, 1.32, -0.3);
    exteriorGroup.add(railUpper);
  }

  // Fastback Slanted Rear Window
  const rearWindowGeo = new THREE.BoxGeometry(1.5, 0.65, 0.06);
  const rearWindow = new THREE.Mesh(rearWindowGeo, tintedGlassMat);
  rearWindow.position.set(0, 1.1, -1.25);
  rearWindow.rotation.x = Math.PI / 4.2;
  exteriorGroup.add(rearWindow);

  // Side Windows (Left and Right)
  for (const side of [-0.78, 0.78]) {
    const sideGlassGeo = new THREE.BoxGeometry(0.03, 0.42, 1.6);
    const sideGlass = new THREE.Mesh(sideGlassGeo, tintedGlassMat);
    sideGlass.position.set(side, 1.06, -0.35);
    exteriorGroup.add(sideGlass);

    // B-Pillar in high gloss black
    const bPillarGeo = new THREE.BoxGeometry(0.04, 0.44, 0.12);
    const bPillar = new THREE.Mesh(bPillarGeo, satinBlackTrimMat);
    bPillar.position.set(side, 1.06, -0.32);
    exteriorGroup.add(bPillar);
  }

  // ==========================================
  // 7. LIGHTING SYSTEMS (Faróis Matrix LED & Lanterna Contínua)
  // ==========================================
  // Headlight Housings
  for (const side of [-0.68, 0.68]) {
    const lightHousingGeo = new THREE.BoxGeometry(0.38, 0.14, 0.22);
    const housing = new THREE.Mesh(lightHousingGeo, satinBlackTrimMat);
    housing.position.set(side, 0.64, 2.24);
    exteriorGroup.add(housing);

    // Dual Projector Lenses
    for (const lensX of [-0.08, 0.08]) {
      const lensGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.04, 16);
      const lens = new THREE.Mesh(lensGeo, headlightEmissiveMat);
      lens.rotation.x = Math.PI / 2;
      lens.position.set(side + lensX, 0.64, 2.36);
      exteriorGroup.add(lens);
      headlightGlows.push(lens);
    }

    // L-shaped Daytime Running Light (DRL) LED brow
    const drlBrowGeo = new THREE.BoxGeometry(0.34, 0.02, 0.03);
    const drlBrow = new THREE.Mesh(drlBrowGeo, headlightEmissiveMat);
    drlBrow.position.set(side, 0.72, 2.36);
    exteriorGroup.add(drlBrow);

    // Dynamic Spotlight Cone
    const spot = new THREE.SpotLight('#67e8f9', 3.2, 12, Math.PI / 6, 0.45, 1.2);
    spot.position.set(side, 0.65, 2.4);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(side * 1.2, 0, 9);
    carRoot.add(targetObj);
    spot.target = targetObj;
    carRoot.add(spot);
    headlightSpots.push(spot);
  }

  // Full-Width Rear LED Lightbar (Assinatura luminosa traseira moderna)
  const rearBarGeo = new THREE.BoxGeometry(1.64, 0.06, 0.05);
  const rearBar = new THREE.Mesh(rearBarGeo, taillightEmissiveMat);
  rearBar.position.set(0, 0.76, -2.22);
  exteriorGroup.add(rearBar);
  taillightGlows.push(rearBar);

  // Outer taillight clusters
  for (const side of [-0.72, 0.72]) {
    const clusterGeo = new THREE.BoxGeometry(0.24, 0.12, 0.08);
    const cluster = new THREE.Mesh(clusterGeo, taillightEmissiveMat);
    cluster.position.set(side, 0.76, -2.21);
    exteriorGroup.add(cluster);
    taillightGlows.push(cluster);
  }

  // Brazilian Mercosul Style Plates
  for (const [pz, rotY] of [[2.45, 0], [-2.24, Math.PI]] as [number, number][]) {
    const plateBackGeo = new THREE.BoxGeometry(0.42, 0.14, 0.02);
    const plateBack = new THREE.Mesh(plateBackGeo, satinBlackTrimMat);
    plateBack.position.set(0, 0.42, pz);
    plateBack.rotation.y = rotY;
    exteriorGroup.add(plateBack);

    const plateFaceGeo = new THREE.BoxGeometry(0.4, 0.12, 0.01);
    const plateFaceMat = new THREE.MeshBasicMaterial({ color: '#f8fafc' });
    const plateFace = new THREE.Mesh(plateFaceGeo, plateFaceMat);
    plateFace.position.set(0, 0.42, pz + (rotY === 0 ? 0.015 : -0.015));
    plateFace.rotation.y = rotY;
    exteriorGroup.add(plateFace);

    // Blue Mercosul strip
    const blueStripGeo = new THREE.BoxGeometry(0.4, 0.03, 0.012);
    const blueStripMat = new THREE.MeshBasicMaterial({ color: '#0055a5' });
    const blueStrip = new THREE.Mesh(blueStripGeo, blueStripMat);
    blueStrip.position.set(0, 0.46, pz + (rotY === 0 ? 0.016 : -0.016));
    blueStrip.rotation.y = rotY;
    exteriorGroup.add(blueStrip);
  }

  // ==========================================
  // 8. INTERIOR CABIN & COCKPIT DETAILS
  // ==========================================
  // Dashboard main binnacle
  const dashGeo = new THREE.BoxGeometry(1.6, 0.28, 0.65);
  const dashMesh = new THREE.Mesh(dashGeo, satinBlackTrimMat);
  dashMesh.position.set(0, 0.78, 0.15);
  dashMesh.castShadow = true;
  interiorGroup.add(dashMesh);

  // Digital Twin Curved Widescreen Display (quadro digital + multimídia)
  const screenGeo = new THREE.BoxGeometry(0.95, 0.14, 0.03);
  const screenMat = new THREE.MeshStandardMaterial({
    color: '#0284c7',
    emissive: '#0369a1',
    emissiveIntensity: 0.9,
    roughness: 0.2,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(-0.15, 0.94, 0.22);
  screenMesh.rotation.x = -0.15;
  interiorGroup.add(screenMesh);

  // Sport 3-Spoke Steering Wheel using TorusGeometry
  const steeringWheelGroup = new THREE.Group();
  steeringWheelGroup.position.set(-0.45, 0.88, 0.32);
  steeringWheelGroup.rotation.x = 0.42;

  const wheelRimGeo = new THREE.TorusGeometry(0.16, 0.02, 16, 32);
  const wheelRim = new THREE.Mesh(wheelRimGeo, satinBlackTrimMat);
  steeringWheelGroup.add(wheelRim);

  const hubGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16);
  const hubMesh = new THREE.Mesh(hubGeo, brushedAluminumMat);
  hubMesh.rotation.x = Math.PI / 2;
  steeringWheelGroup.add(hubMesh);

  for (let s = 0; s < 3; s++) {
    const spokeGeo = new THREE.BoxGeometry(0.03, 0.14, 0.015);
    const spoke = new THREE.Mesh(spokeGeo, brushedAluminumMat);
    spoke.rotation.z = (s * Math.PI * 2) / 3;
    spoke.position.set(0, 0, 0);
    steeringWheelGroup.add(spoke);
  }
  interiorGroup.add(steeringWheelGroup);

  // Center Console & Shifter
  const consoleGeo = new THREE.BoxGeometry(0.32, 0.32, 1.1);
  const consoleMesh = new THREE.Mesh(consoleGeo, satinBlackTrimMat);
  consoleMesh.position.set(0, 0.52, -0.3);
  interiorGroup.add(consoleMesh);

  const shifterGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.09);
  const shifter = new THREE.Mesh(shifterGeo, brushedAluminumMat);
  shifter.position.set(0, 0.72, -0.05);
  interiorGroup.add(shifter);

  // Dual Sculpted Bucket Sport Seats with Headrests
  for (const sx of [-0.45, 0.45]) {
    // Base cushion
    const seatBaseGeo = new THREE.BoxGeometry(0.48, 0.18, 0.55);
    const seatBase = new THREE.Mesh(seatBaseGeo, carbonFiberMat);
    seatBase.position.set(sx, 0.46, -0.32);
    interiorGroup.add(seatBase);

    // Backrest
    const seatBackGeo = new THREE.BoxGeometry(0.46, 0.65, 0.12);
    const seatBack = new THREE.Mesh(seatBackGeo, carbonFiberMat);
    seatBack.position.set(sx, 0.82, -0.62);
    seatBack.rotation.x = -0.22;
    interiorGroup.add(seatBack);

    // Headrest
    const headrestGeo = new THREE.BoxGeometry(0.24, 0.16, 0.08);
    const headrest = new THREE.Mesh(headrestGeo, carbonFiberMat);
    headrest.position.set(sx, 1.2, -0.72);
    interiorGroup.add(headrest);
  }

  // Rear Bench Seat
  const rearSeatBaseGeo = new THREE.BoxGeometry(1.45, 0.18, 0.55);
  const rearSeatBase = new THREE.Mesh(rearSeatBaseGeo, carbonFiberMat);
  rearSeatBase.position.set(0, 0.48, -1.25);
  interiorGroup.add(rearSeatBase);

  const rearSeatBackGeo = new THREE.BoxGeometry(1.42, 0.62, 0.12);
  const rearSeatBack = new THREE.Mesh(rearSeatBackGeo, carbonFiberMat);
  rearSeatBack.position.set(0, 0.84, -1.55);
  rearSeatBack.rotation.x = -0.25;
  interiorGroup.add(rearSeatBack);

  // ==========================================
  // 9. ULTRA-DETAILED POWERTRAIN & ENGINE BAY
  // ==========================================
  // Engine Block with cooling ribs
  const engineBlockGeo = new THREE.BoxGeometry(0.68, 0.48, 0.75);
  const engineBlock = new THREE.Mesh(engineBlockGeo, castIronEngineMat);
  engineBlock.position.set(0, 0.52, 1.35);
  engineBlock.castShadow = true;
  engineGroup.add(engineBlock);

  // Lower Oil Sump Pan with drain plug
  const oilPanGeo = new THREE.BoxGeometry(0.55, 0.14, 0.65);
  const oilPan = new THREE.Mesh(oilPanGeo, satinBlackTrimMat);
  oilPan.position.set(0, 0.22, 1.35);
  engineGroup.add(oilPan);

  // Cylinder Head with Red Performance Cam Cover
  const camCoverGeo = new THREE.BoxGeometry(0.66, 0.14, 0.72);
  const camCoverMat = new THREE.MeshStandardMaterial({
    color: '#dc2626',
    metalness: 0.5,
    roughness: 0.25,
  });
  const camCover = new THREE.Mesh(camCoverGeo, camCoverMat);
  camCover.position.set(0, 0.82, 1.35);
  engineGroup.add(camCover);

  // Oil filler cap (Tampa do Óleo)
  const oilCapGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.03, 16);
  const oilCapMat = new THREE.MeshStandardMaterial({ color: '#facc15', metalness: 0.2 });
  const oilCap = new THREE.Mesh(oilCapGeo, oilCapMat);
  oilCap.position.set(-0.2, 0.9, 1.15);
  engineGroup.add(oilCap);

  // 4 Animated Pistons inside bores
  for (let i = 0; i < 4; i++) {
    const pistonSubGroup = new THREE.Group();
    const pistonGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.15, 16);
    const pistonMesh = new THREE.Mesh(pistonGeo, brushedAluminumMat);
    pistonSubGroup.add(pistonMesh);

    // Connecting rod (biela)
    const rodGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.22, 12);
    const rodMesh = new THREE.Mesh(rodGeo, castIronEngineMat);
    rodMesh.position.set(0, -0.16, 0);
    pistonSubGroup.add(rodMesh);

    const zPos = 1.1 + i * 0.16;
    pistonSubGroup.position.set(-0.1, 0.54, zPos);
    engineGroup.add(pistonSubGroup);
    pistons.push(pistonMesh);
  }

  // Turbocharger Assembly (Turbocompressor)
  const turboGroup = new THREE.Group();
  turboGroup.position.set(0.38, 0.55, 1.45);

  // Compressor Snail Housing (lado frio)
  const compressorGeo = new THREE.TorusGeometry(0.08, 0.045, 16, 24, Math.PI * 1.8);
  const compressor = new THREE.Mesh(compressorGeo, brushedAluminumMat);
  compressor.rotation.y = Math.PI / 2;
  turboGroup.add(compressor);

  // Turbine Snail Housing (lado quente em bronze/ferro fundido)
  const turbineGeo = new THREE.TorusGeometry(0.075, 0.04, 16, 24, Math.PI * 1.8);
  const turbine = new THREE.Mesh(turbineGeo, copperGoldMat);
  turbine.position.set(0.12, 0, 0);
  turbine.rotation.y = Math.PI / 2;
  turboGroup.add(turbine);
  turbines.push(turbine);

  // Wastegate Actuator Canister
  const wastegateGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.09);
  const wastegate = new THREE.Mesh(wastegateGeo, brushedAluminumMat);
  wastegate.position.set(0.06, 0.12, -0.06);
  turboGroup.add(wastegate);

  engineGroup.add(turboGroup);

  // Front Intercooler behind lower grille
  const intercoolerGeo = new THREE.BoxGeometry(1.15, 0.18, 0.08);
  const intercooler = new THREE.Mesh(intercoolerGeo, brushedAluminumMat);
  intercooler.position.set(0, 0.32, 2.18);
  engineGroup.add(intercooler);

  // Intercooler Aluminum Boost Pipes with Blue Silicone Hoses
  const boostPipeMat = new THREE.MeshStandardMaterial({ color: '#3b82f6', roughness: 0.4 });
  for (const bx of [-0.55, 0.45]) {
    const pipeGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 12);
    const pipe = new THREE.Mesh(pipeGeo, boostPipeMat);
    pipe.position.set(bx, 0.42, 1.95);
    pipe.rotation.x = Math.PI / 4;
    engineGroup.add(pipe);
  }

  // Radiator Assembly with Dual Fans
  const radiatorGeo = new THREE.BoxGeometry(1.28, 0.48, 0.08);
  const radiator = new THREE.Mesh(radiatorGeo, satinBlackTrimMat);
  radiator.position.set(0, 0.52, 2.05);
  engineGroup.add(radiator);

  // Dual spinning fans
  for (const fx of [-0.32, 0.32]) {
    const fanRingGeo = new THREE.TorusGeometry(0.16, 0.02, 12, 24);
    const fanRing = new THREE.Mesh(fanRingGeo, satinBlackTrimMat);
    fanRing.position.set(fx, 0.52, 1.98);
    engineGroup.add(fanRing);

    const fanBladesGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.015, 8);
    const fanBlades = new THREE.Mesh(fanBladesGeo, satinBlackTrimMat);
    fanBlades.rotation.x = Math.PI / 2;
    fanBlades.position.set(fx, 0.52, 1.98);
    engineGroup.add(fanBlades);
    coolingFans.push(fanBlades);
  }

  // Coolant Overflow Reservoir with pink G12 coolant
  const coolantTankGeo = new THREE.BoxGeometry(0.24, 0.22, 0.18);
  const coolantMat = new THREE.MeshPhysicalMaterial({
    color: '#f43f5e',
    transmission: 0.6,
    roughness: 0.2,
    transparent: true,
  });
  const coolantTank = new THREE.Mesh(coolantTankGeo, coolantMat);
  coolantTank.position.set(-0.62, 0.72, 1.85);
  engineGroup.add(coolantTank);

  // Serpentine Belt & Pulleys
  const beltGroup = new THREE.Group();
  beltGroup.position.set(0, 0.52, 0.94);

  const crankPulleyGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.04, 20);
  const crankPulley = new THREE.Mesh(crankPulleyGeo, chromeMirrorMat);
  crankPulley.rotation.x = Math.PI / 2;
  beltGroup.add(crankPulley);
  pulleys.push(crankPulley);

  const altPulleyGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.04, 20);
  const altPulley = new THREE.Mesh(altPulleyGeo, chromeMirrorMat);
  altPulley.rotation.x = Math.PI / 2;
  altPulley.position.set(-0.25, 0.22, 0);
  beltGroup.add(altPulley);
  pulleys.push(altPulley);

  engineGroup.add(beltGroup);

  // 12V Battery with terminals and branding
  const batteryGeo = new THREE.BoxGeometry(0.34, 0.26, 0.28);
  const battery = new THREE.Mesh(batteryGeo, satinBlackTrimMat);
  battery.position.set(0.58, 0.68, 1.15);
  engineGroup.add(battery);

  const posTermGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.04);
  const redMat = new THREE.MeshBasicMaterial({ color: '#ef4444' });
  const posTerm = new THREE.Mesh(posTermGeo, redMat);
  posTerm.position.set(0.52, 0.83, 1.1);
  engineGroup.add(posTerm);

  const negTermGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.04);
  const blueMat = new THREE.MeshBasicMaterial({ color: '#3b82f6' });
  const negTerm = new THREE.Mesh(negTermGeo, blueMat);
  negTerm.position.set(0.64, 0.83, 1.1);
  engineGroup.add(negTerm);

  // ==========================================
  // 10. DRIVETRAIN & EXHAUST SYSTEM
  // ==========================================
  // Automatic Gearbox / Transmission Casing
  const gearboxGeo = new THREE.BoxGeometry(0.52, 0.42, 0.85);
  const gearbox = new THREE.Mesh(gearboxGeo, castIronEngineMat);
  gearbox.position.set(0, 0.42, 0.58);
  gearbox.castShadow = true;
  engineGroup.add(gearbox);

  // Longitudinal Driveshaft (Cardã)
  const driveshaftGeo = new THREE.CylinderGeometry(0.038, 0.038, 2.1, 16);
  const driveshaft = new THREE.Mesh(driveshaftGeo, brushedAluminumMat);
  driveshaft.rotation.x = Math.PI / 2;
  driveshaft.position.set(0, 0.28, -0.62);
  chassisGroup.add(driveshaft);

  // Rear Differential Housing with cooling ribs
  const diffGeo = new THREE.SphereGeometry(0.16, 16, 16);
  const diffMesh = new THREE.Mesh(diffGeo, castIronEngineMat);
  diffMesh.position.set(0, 0.32, -1.55);
  chassisGroup.add(diffMesh);

  // Rear Axle Half-Shafts with CV Rubber Boots
  for (const side of [-1, 1]) {
    const halfShaftGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.65, 12);
    const halfShaft = new THREE.Mesh(halfShaftGeo, castIronEngineMat);
    halfShaft.rotation.z = Math.PI / 2;
    halfShaft.position.set(side * 0.45, 0.32, -1.55);
    chassisGroup.add(halfShaft);

    const cvBootGeo = new THREE.CylinderGeometry(0.045, 0.04, 0.08, 12);
    const cvBoot = new THREE.Mesh(cvBootGeo, satinBlackTrimMat);
    cvBoot.rotation.z = Math.PI / 2;
    cvBoot.position.set(side * 0.68, 0.32, -1.55);
    chassisGroup.add(cvBoot);
  }

  // Exhaust System
  // 4-into-1 Exhaust Manifold Runners
  for (let r = 0; r < 4; r++) {
    const runnerGeo = new THREE.TorusGeometry(0.08, 0.022, 12, 16, Math.PI / 2);
    const runner = new THREE.Mesh(runnerGeo, copperGoldMat);
    runner.position.set(0.24, 0.62, 1.1 + r * 0.16);
    runner.rotation.y = Math.PI;
    engineGroup.add(runner);
  }

  // Catalytic Converter with stamped heat shield
  const catGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.45, 16);
  const catMesh = new THREE.Mesh(catGeo, copperGoldMat);
  catMesh.rotation.x = Math.PI / 2;
  catMesh.position.set(0.18, 0.25, 0.38);
  chassisGroup.add(catMesh);

  // Mid-pipe resonator
  const resGeo = new THREE.CylinderGeometry(0.075, 0.075, 0.55, 16);
  const resonator = new THREE.Mesh(resGeo, brushedAluminumMat);
  resonator.rotation.x = Math.PI / 2;
  resonator.position.set(0.15, 0.24, -0.65);
  chassisGroup.add(resonator);

  // Crossflow Rear Muffler
  const mufflerGeo = new THREE.BoxGeometry(0.72, 0.22, 0.38);
  const muffler = new THREE.Mesh(mufflerGeo, brushedAluminumMat);
  muffler.position.set(0, 0.26, -1.82);
  chassisGroup.add(muffler);

  // Dual Twin-Tip Polished Stainless Exhaust Tips
  for (const tx of [-0.48, 0.48]) {
    for (const subX of [-0.05, 0.05]) {
      const tipGeo = new THREE.CylinderGeometry(0.038, 0.036, 0.24, 20);
      const tip = new THREE.Mesh(tipGeo, chromeMirrorMat);
      tip.rotation.x = Math.PI / 2;
      tip.position.set(tx + subX, 0.24, -2.18);
      chassisGroup.add(tip);
    }
  }

  // Molded Fuel Tank (Tanque de Combustível)
  const fuelTankGeo = new THREE.BoxGeometry(1.2, 0.25, 0.65);
  const fuelTank = new THREE.Mesh(fuelTankGeo, satinBlackTrimMat);
  fuelTank.position.set(0, 0.28, -1.15);
  chassisGroup.add(fuelTank);

  // ==========================================
  // 11. WHEELS, HIGH-PERF BRAKES & SUSPENSION
  // ==========================================
  const wheelPositions: [number, number, number][] = [
    [-0.92, 0.36, 1.4], // Front Left
    [0.92, 0.36, 1.4],  // Front Right
    [-0.92, 0.36, -1.45], // Rear Left
    [0.92, 0.36, -1.45],  // Rear Right
  ];

  wheelPositions.forEach(([x, y, z], idx) => {
    const isFront = z > 0;
    const isLeft = x < 0;
    const wheelSubGroup = new THREE.Group();
    wheelSubGroup.position.set(x, y, z);

    // High-Grip Low Profile Tire with realistic tread grooves
    const tireOuterGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.28, 36);
    const tire = new THREE.Mesh(tireOuterGeo, tireRubberMat);
    tire.rotation.z = Math.PI / 2;
    tire.castShadow = true;
    wheelSubGroup.add(tire);

    // Tread lines (3 circumferential drainage grooves)
    for (const gOffset of [-0.06, 0, 0.06]) {
      const grooveGeo = new THREE.TorusGeometry(0.382, 0.008, 8, 36);
      const groove = new THREE.Mesh(grooveGeo, satinBlackTrimMat);
      groove.position.set(gOffset, 0, 0);
      groove.rotation.y = Math.PI / 2;
      wheelSubGroup.add(groove);
    }

    // 19-inch Alloy Rim Barrel
    const rimBarrelGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.29, 24);
    const rimBarrel = new THREE.Mesh(rimBarrelGeo, brushedAluminumMat);
    rimBarrel.rotation.z = Math.PI / 2;
    wheelSubGroup.add(rimBarrel);

    // 5-Twin-Spoke Wheel Face
    const wheelFaceGroup = new THREE.Group();
    wheelFaceGroup.position.set(isLeft ? -0.14 : 0.14, 0, 0);

    for (let s = 0; s < 5; s++) {
      const angle = (s * Math.PI * 2) / 5;
      for (const split of [-0.08, 0.08]) {
        const spokeGeo = new THREE.BoxGeometry(0.02, 0.22, 0.03);
        const spoke = new THREE.Mesh(spokeGeo, chromeMirrorMat);
        spoke.rotation.x = angle + split;
        spoke.position.set(0, Math.sin(angle + split) * 0.12, Math.cos(angle + split) * 0.12);
        wheelFaceGroup.add(spoke);
      }
    }

    // Center Cap & Chrome Lug Nuts
    const centerCapGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16);
    const centerCap = new THREE.Mesh(centerCapGeo, satinBlackTrimMat);
    centerCap.rotation.z = Math.PI / 2;
    wheelFaceGroup.add(centerCap);

    for (let l = 0; l < 5; l++) {
      const lugAngle = (l * Math.PI * 2) / 5;
      const lugGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.025, 8);
      const lug = new THREE.Mesh(lugGeo, chromeMirrorMat);
      lug.rotation.z = Math.PI / 2;
      lug.position.set(0, Math.sin(lugAngle) * 0.032, Math.cos(lugAngle) * 0.032);
      wheelFaceGroup.add(lug);
    }
    wheelSubGroup.add(wheelFaceGroup);

    // Cross-Drilled Ventilated Brake Disc (Disco Perfurado)
    const discGeo = new THREE.CylinderGeometry(0.21, 0.21, 0.035, 32);
    const discMat = new THREE.MeshStandardMaterial({
      color: '#e2e8f0',
      metalness: 0.95,
      roughness: 0.15,
    });
    const brakeDisc = new THREE.Mesh(discGeo, discMat);
    brakeDisc.rotation.z = Math.PI / 2;
    brakeDisc.position.x = isLeft ? 0.06 : -0.06;
    wheelSubGroup.add(brakeDisc);

    // Multi-Piston Racing Caliper (Pinça Brembo Vermelha)
    const caliperGeo = new THREE.BoxGeometry(0.09, 0.14, 0.1);
    const caliper = new THREE.Mesh(caliperGeo, brakeCaliperRedMat);
    caliper.position.set(isLeft ? 0.06 : -0.06, 0.13, 0);
    wheelSubGroup.add(caliper);

    // REAL COILED 3D SPRING SUSPENSION (Mola Helicoidal 3D Real com Torus)
    const suspensionGroup = new THREE.Group();
    suspensionGroup.position.set(isLeft ? 0.18 : -0.18, 0.15, 0);

    // Damper Strut Inner Tube
    const strutTubeGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12);
    const strutTube = new THREE.Mesh(strutTubeGeo, chromeMirrorMat);
    strutTube.position.set(0, 0.12, 0);
    suspensionGroup.add(strutTube);

    // 3D Coil Spring (stacked TorusGeometry coils)
    const springWireMat = new THREE.MeshStandardMaterial({
      color: isFront ? '#eab308' : '#3b82f6',
      metalness: 0.85,
      roughness: 0.2,
    });
    for (let c = 0; c < 6; c++) {
      const coilTorusGeo = new THREE.TorusGeometry(0.065, 0.014, 10, 20);
      const coil = new THREE.Mesh(coilTorusGeo, springWireMat);
      coil.rotation.x = Math.PI / 2;
      coil.position.set(0, 0.02 + c * 0.045, 0);
      suspensionGroup.add(coil);
    }
    wheelSubGroup.add(suspensionGroup);

    wheelsGroup.add(wheelSubGroup);
  });

  // ==========================================
  // 12. 3D INTERACTIVE HOTSPOT PINS
  // ==========================================
  const hotspotPins: { mesh: THREE.Mesh; comp: CarComponent3DInfo }[] = [];
  car3DComponents.forEach((comp) => {
    const pinGroup = new THREE.Group();
    pinGroup.position.set(...comp.position3D);

    const pinSphereGeo = new THREE.SphereGeometry(0.09, 24, 24);
    const pinColor = comp.urgency === 'critical' ? '#ff3b30' : comp.urgency === 'warning' ? '#ff9f0a' : '#2997ff';
    const pinMat = new THREE.MeshStandardMaterial({
      color: pinColor,
      emissive: pinColor,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.9,
    });
    const pinSphere = new THREE.Mesh(pinSphereGeo, pinMat);
    pinSphere.userData = { componentId: comp.id };
    pinGroup.add(pinSphere);

    // Outer beacon pulse ring
    const ringGeo = new THREE.RingGeometry(0.12, 0.14, 24);
    const ringMat = new THREE.MeshBasicMaterial({
      color: pinColor,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const beaconRing = new THREE.Mesh(ringGeo, ringMat);
    beaconRing.rotation.x = Math.PI / 2;
    pinGroup.add(beaconRing);

    carRoot.add(pinGroup);
    hotspotPins.push({ mesh: pinSphere, comp });
  });

  return {
    carRoot,
    exteriorGroup,
    engineGroup,
    wheelsGroup,
    interiorGroup,
    chassisGroup,
    hoodAssembly,
    driverDoorAssembly,
    pistons,
    coolingFans,
    pulleys,
    turbines,
    headlightSpots,
    headlightGlows,
    taillightGlows,
    bodyMaterials,
    hotspotPins,
  };
}
