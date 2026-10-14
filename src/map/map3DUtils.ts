import * as THREE from "three";
import type { Floor, Room, RoomCategory, Point, FloorId } from "./types";
import { getRoomCenter } from "./mapUtils";

// Scale factor from 2D SVG units to 3D world units
export const SCALE_3D = 0.5;

// Floor vertical spacing
export const FLOOR_HEIGHT_3D = 22;

export function svgToWorld3D(
  x: number,
  y: number,
  viewBox: string,
  scale: number = SCALE_3D
): { x: number; z: number } {
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  return {
    x: (x - vbW / 2) * scale,
    z: (y - vbH / 2) * scale
  };
}

export function getCategory3DColor(category: RoomCategory): {
  floor: number;
  wall: number;
  emissive: number;
} {
  switch (category) {
    case "classroom":
      return { floor: 0x172554, wall: 0x1e293b, emissive: 0x38bdf8 };
    case "club":
      return { floor: 0x4c0519, wall: 0x27101e, emissive: 0xf43f5e };
    case "admin":
      return { floor: 0x3b0764, wall: 0x241434, emissive: 0xc084fc };
    case "facility":
      return { floor: 0x064e3b, wall: 0x112720, emissive: 0x34d399 };
    case "utility":
      return { floor: 0x134e4a, wall: 0x132a28, emissive: 0x2dd4bf };
    case "common":
      return { floor: 0x451a03, wall: 0x2c1f13, emissive: 0xfbbf24 };
    case "outdoor":
      return { floor: 0x14532d, wall: 0x142b1f, emissive: 0x4ade80 };
    case "access":
      return { floor: 0x2e1065, wall: 0x22153b, emissive: 0xa855f7 };
    default:
      return { floor: 0x1e293b, wall: 0x334155, emissive: 0x94a3b8 };
  }
}

/**
 * Creates an extruded slab from a 2D polygon with optional courtyard hole.
 */
export function createFloorSlabMesh(
  outline: Point[],
  courtyard: Point[] | undefined,
  viewBox: string,
  thickness: number = 2,
  color: number = 0x0f172a
): THREE.Mesh {
  const shape = new THREE.Shape();
  const firstPt = svgToWorld3D(outline[0].x, outline[0].y, viewBox);
  shape.moveTo(firstPt.x, -firstPt.z);

  for (let i = 1; i < outline.length; i++) {
    const pt = svgToWorld3D(outline[i].x, outline[i].y, viewBox);
    shape.lineTo(pt.x, -pt.z);
  }
  shape.closePath();

  if (courtyard && courtyard.length > 0) {
    const holePath = new THREE.Path();
    const firstHole = svgToWorld3D(courtyard[0].x, courtyard[0].y, viewBox);
    holePath.moveTo(firstHole.x, -firstHole.z);

    for (let i = 1; i < courtyard.length; i++) {
      const hpt = svgToWorld3D(courtyard[i].x, courtyard[i].y, viewBox);
      holePath.lineTo(hpt.x, -hpt.z);
    }
    holePath.closePath();
    shape.holes.push(holePath);
  }

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.4,
    bevelSize: 0.4,
    bevelSegments: 2
  });

  // Rotate from XY to XZ plane
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.75,
    metalness: 0.15
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates 3D staircase structure for access rooms: taller cabin, pitched roof, interior steps,
 * door frame, safety railings, and raycasting metadata.
 */
export function createStaircaseGroup(
  room: Room,
  viewBox: string,
  wallHeight: number = 10
): THREE.Group {
  const group = new THREE.Group();
  group.name = `staircase_${room.id}`;

  const colors = getCategory3DColor(room.category);
  const roomCenter = getRoomCenter(room);
  const worldCenter = svgToWorld3D(roomCenter.x, roomCenter.y, viewBox);

  const w = room.rect.width * SCALE_3D;
  const d = room.rect.height * SCALE_3D;
  const cabinHeight = wallHeight * 1.3;
  const halfW = w / 2;
  const halfD = d / 2;
  const halfH = cabinHeight / 2;

  // 1. Penthouse Cabin — taller box with darker walls
  const cabinWallColor = 0x1a1025;
  const wallMat = new THREE.MeshStandardMaterial({
    color: cabinWallColor,
    roughness: 0.85,
    metalness: 0.1
  });

  // Floor tile (interactive raycaster target)
  const floorGeom = new THREE.BoxGeometry(Math.max(1, w - 1.2), 0.6, Math.max(1, d - 1.2));
  const floorMat = new THREE.MeshStandardMaterial({
    color: colors.floor,
    roughness: 0.6,
    metalness: 0.2,
    emissive: 0x000000,
    emissiveIntensity: 0
  });
  const floorMesh = new THREE.Mesh(floorGeom, floorMat);
  floorMesh.position.set(worldCenter.x, 0.3, worldCenter.z);
  floorMesh.receiveShadow = true;
  floorMesh.userData = {
    isRoom: true,
    roomId: room.id,
    room: room,
    baseColor: colors.floor,
    emissiveColor: colors.emissive,
    category: 'access'
  };
  group.add(floorMesh);

  // North wall
  const northWall = new THREE.Mesh(
    new THREE.BoxGeometry(w, cabinHeight, 1.2), wallMat
  );
  northWall.position.set(worldCenter.x, halfH, worldCenter.z - halfD);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  group.add(northWall);

  // South wall
  const southWall = new THREE.Mesh(
    new THREE.BoxGeometry(w, cabinHeight, 1.2), wallMat
  );
  southWall.position.set(worldCenter.x, halfH, worldCenter.z + halfD);
  southWall.castShadow = true;
  southWall.receiveShadow = true;
  group.add(southWall);

  // West wall
  const westWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, cabinHeight, d), wallMat
  );
  westWall.position.set(worldCenter.x - halfW, halfH, worldCenter.z);
  westWall.castShadow = true;
  westWall.receiveShadow = true;
  group.add(westWall);

  // East wall
  const eastWall = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, cabinHeight, d), wallMat
  );
  eastWall.position.set(worldCenter.x + halfW, halfH, worldCenter.z);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  group.add(eastWall);

  // Wall edge accent lines
  const edgesGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, cabinHeight, d));
  const edgesMat = new THREE.LineBasicMaterial({
    color: colors.emissive,
    transparent: true,
    opacity: 0.35
  });
  const edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
  edgesLine.position.set(worldCenter.x, halfH, worldCenter.z);
  group.add(edgesLine);

  // 2. Pitched Roof — triangular prism (wedge)
  const roofColor = 0x1a1a2e;
  const roofPeakHeight = 5;
  const roofOverhang = 1.5;

  const roofVertices = new Float32Array([
    // Front triangle
    -(halfW + roofOverhang), 0, -(halfD + roofOverhang),
     (halfW + roofOverhang), 0, -(halfD + roofOverhang),
     0, roofPeakHeight, -(halfD + roofOverhang),
    // Back triangle
    -(halfW + roofOverhang), 0,  (halfD + roofOverhang),
     (halfW + roofOverhang), 0,  (halfD + roofOverhang),
     0, roofPeakHeight,  (halfD + roofOverhang),
  ]);

  const roofIndices = [
    // Front face
    0, 1, 2,
    // Back face
    3, 5, 4,
    // Left slope
    0, 2, 5, 0, 5, 3,
    // Right slope
    1, 4, 5, 1, 5, 2,
    // Bottom
    0, 3, 4, 0, 4, 1
  ];

  const roofGeom = new THREE.BufferGeometry();
  roofGeom.setAttribute('position', new THREE.BufferAttribute(roofVertices, 3));
  roofGeom.setIndex(roofIndices);
  roofGeom.computeVertexNormals();

  const roofMat = new THREE.MeshStandardMaterial({
    color: roofColor,
    roughness: 0.8,
    metalness: 0.15
  });
  const roofMesh = new THREE.Mesh(roofGeom, roofMat);
  roofMesh.position.set(worldCenter.x, cabinHeight, worldCenter.z);
  roofMesh.castShadow = true;
  group.add(roofMesh);

  // 3. Interior Steps — 8 steps stacked at incremental Y with Z offset
  const stepCount = 8;
  const stepWidth = w * 0.65;
  const stepDepth = (d * 0.75) / stepCount;
  const stepHeight = 0.4;
  const stepTotalRise = cabinHeight * 0.7;

  for (let i = 0; i < stepCount; i++) {
    const stepGeom = new THREE.BoxGeometry(stepWidth, stepHeight, stepDepth * 0.9);
    const stepColor = i % 2 === 0 ? 0x2e1065 : 0x3b1a8a;
    const stepMat = new THREE.MeshStandardMaterial({
      color: stepColor,
      roughness: 0.7,
      metalness: 0.15
    });
    const step = new THREE.Mesh(stepGeom, stepMat);
    const yPos = (stepTotalRise / stepCount) * (i + 0.5);
    const zPos = worldCenter.z - halfD * 0.6 + (stepDepth * i);
    step.position.set(worldCenter.x, yPos, zPos);
    step.castShadow = true;
    step.receiveShadow = true;
    group.add(step);
  }

  // 4. Door Frame — thin box outline at south face
  const doorWidth = w * 0.35;
  const doorHeight = cabinHeight * 0.65;
  const doorThickness = 0.3;
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.5,
    metalness: 0.4
  });

  // Left jamb
  const leftJamb = new THREE.Mesh(
    new THREE.BoxGeometry(doorThickness, doorHeight, doorThickness), frameMat
  );
  leftJamb.position.set(
    worldCenter.x - doorWidth / 2, doorHeight / 2, worldCenter.z + halfD + 0.2
  );
  group.add(leftJamb);

  // Right jamb
  const rightJamb = new THREE.Mesh(
    new THREE.BoxGeometry(doorThickness, doorHeight, doorThickness), frameMat
  );
  rightJamb.position.set(
    worldCenter.x + doorWidth / 2, doorHeight / 2, worldCenter.z + halfD + 0.2
  );
  group.add(rightJamb);

  // Lintel
  const lintel = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + doorThickness, doorThickness, doorThickness), frameMat
  );
  lintel.position.set(
    worldCenter.x, doorHeight, worldCenter.z + halfD + 0.2
  );
  group.add(lintel);

  // 5. Safety Railings — 4 corner posts
  const railRadius = 0.3;
  const railHeight = cabinHeight;
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    roughness: 0.4,
    metalness: 0.6
  });
  const railGeom = new THREE.CylinderGeometry(railRadius, railRadius, railHeight, 8);

  const cornerOffsets = [
    { x: -halfW, z: -halfD },
    { x:  halfW, z: -halfD },
    { x: -halfW, z:  halfD },
    { x:  halfW, z:  halfD }
  ];
  for (const offset of cornerOffsets) {
    const rail = new THREE.Mesh(railGeom, railMat);
    rail.position.set(
      worldCenter.x + offset.x,
      railHeight / 2,
      worldCenter.z + offset.z
    );
    rail.castShadow = true;
    group.add(rail);
  }

  return group;
}

/**
 * Creates 3D room representation: floor tile, walls, and edge lines.
 */
export function create3DRoomGroup(
  room: Room,
  viewBox: string,
  wallHeight: number = 10,
  wallThickness: number = 1.2
): THREE.Group {
  const group = new THREE.Group();
  group.name = `room_${room.id}`;

  const colors = getCategory3DColor(room.category);
  const roomCenter = getRoomCenter(room);
  const worldCenter = svgToWorld3D(roomCenter.x, roomCenter.y, viewBox);

  const w = room.rect.width * SCALE_3D;
  const d = room.rect.height * SCALE_3D;

  // 1. Room Floor Tile (interactive target for raycaster)
  const floorGeom = new THREE.BoxGeometry(
    Math.max(1, w - wallThickness),
    0.6,
    Math.max(1, d - wallThickness)
  );
  const floorMat = new THREE.MeshStandardMaterial({
    color: colors.floor,
    roughness: 0.6,
    metalness: 0.2,
    emissive: 0x000000,
    emissiveIntensity: 0
  });

  const floorMesh = new THREE.Mesh(floorGeom, floorMat);
  floorMesh.position.set(worldCenter.x, 0.3, worldCenter.z);
  floorMesh.receiveShadow = true;

  // Attach metadata for raycasting & selection
  floorMesh.userData = {
    isRoom: true,
    roomId: room.id,
    room: room,
    baseColor: colors.floor,
    emissiveColor: colors.emissive,
    category: room.category
  };

  group.add(floorMesh);

  // 2. Room Walls
  const wallMat = new THREE.MeshStandardMaterial({
    color: colors.wall,
    roughness: 0.85,
    metalness: 0.1
  });

  const halfW = w / 2;
  const halfD = d / 2;
  const halfH = wallHeight / 2;

  // North wall
  const northWallGeom = new THREE.BoxGeometry(w, wallHeight, wallThickness);
  const northWall = new THREE.Mesh(northWallGeom, wallMat);
  northWall.position.set(worldCenter.x, halfH, worldCenter.z - halfD);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  group.add(northWall);

  // South wall
  const southWallGeom = new THREE.BoxGeometry(w, wallHeight, wallThickness);
  const southWall = new THREE.Mesh(southWallGeom, wallMat);
  southWall.position.set(worldCenter.x, halfH, worldCenter.z + halfD);
  southWall.castShadow = true;
  southWall.receiveShadow = true;
  group.add(southWall);

  // West wall
  const westWallGeom = new THREE.BoxGeometry(wallThickness, wallHeight, d);
  const westWall = new THREE.Mesh(westWallGeom, wallMat);
  westWall.position.set(worldCenter.x - halfW, halfH, worldCenter.z);
  westWall.castShadow = true;
  westWall.receiveShadow = true;
  group.add(westWall);

  // East wall
  const eastWallGeom = new THREE.BoxGeometry(wallThickness, wallHeight, d);
  const eastWall = new THREE.Mesh(eastWallGeom, wallMat);
  eastWall.position.set(worldCenter.x + halfW, halfH, worldCenter.z);
  eastWall.castShadow = true;
  eastWall.receiveShadow = true;
  group.add(eastWall);

  // 3. Wall Rim Accent Lines (Dark fantasy border glow)
  const edgesGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(w, wallHeight, d));
  const edgesMat = new THREE.LineBasicMaterial({
    color: colors.emissive,
    transparent: true,
    opacity: 0.35
  });
  const edgesLine = new THREE.LineSegments(edgesGeom, edgesMat);
  edgesLine.position.set(worldCenter.x, halfH, worldCenter.z);
  group.add(edgesLine);

  return group;
}

/**
 * Creates high-DPI text billboard sprite for room short label.
 */
export function createRoomLabelSprite(room: Room, viewBox: string, wallHeight: number = 10): THREE.Sprite {
  const labelText = room.shortLabel || room.name;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 72;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pill background
    ctx.fillStyle = "rgba(11, 15, 25, 0.85)";
    ctx.strokeStyle = "rgba(255, 172, 218, 0.4)";
    ctx.lineWidth = 2.5;

    const r = 16;
    const pad = 6;
    ctx.beginPath();
    ctx.moveTo(pad + r, pad);
    ctx.lineTo(canvas.width - pad - r, pad);
    ctx.quadraticCurveTo(canvas.width - pad, pad, canvas.width - pad, pad + r);
    ctx.lineTo(canvas.width - pad, canvas.height - pad - r);
    ctx.quadraticCurveTo(canvas.width - pad, canvas.height - pad, canvas.width - pad - r, canvas.height - pad);
    ctx.lineTo(pad + r, canvas.height - pad);
    ctx.quadraticCurveTo(pad, canvas.height - pad, pad, canvas.height - pad - r);
    ctx.lineTo(pad, pad + r);
    ctx.quadraticCurveTo(pad, pad, pad + r, pad);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px 'Plus Jakarta Sans', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(labelText, canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 0.9,
    depthTest: false
  });

  const sprite = new THREE.Sprite(spriteMat);
  const roomCenter = getRoomCenter(room);
  const worldPos = svgToWorld3D(roomCenter.x, roomCenter.y, viewBox);

  sprite.position.set(worldPos.x, wallHeight + 4, worldPos.z);
  sprite.scale.set(22, 6.2, 1);
  sprite.name = `label_${room.id}`;

  return sprite;
}

/**
 * Converts an SVG path string (consisting of M, L, Z commands) into an extruded 3D mesh.
 */
export function createSvgPathMesh(
  pathData: string,
  viewBox: string,
  depth: number = 0.35,
  color: number = 0x24324a,
  scale: number = SCALE_3D
): THREE.Mesh | null {
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const shapePath = new THREE.ShapePath();
  const tokens = pathData.trim().split(/\s+/);
  let i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i];
    if (cmd === "M") {
      shapePath.moveTo(parseFloat(tokens[i + 1]), parseFloat(tokens[i + 2]));
      i += 3;
    } else if (cmd === "L") {
      shapePath.lineTo(parseFloat(tokens[i + 1]), parseFloat(tokens[i + 2]));
      i += 3;
    } else if (cmd === "Z") {
      i++;
    } else {
      i++;
    }
  }

  const shapes = shapePath.toShapes();
  if (!shapes || shapes.length === 0) return null;

  const geom = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: false
  });

  geom.rotateX(Math.PI / 2);
  geom.scale(scale, 1, scale);
  geom.translate(-vbW * scale / 2, depth, -vbH * scale / 2);

  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.8,
    metalness: 0.15
  });

  const mesh = new THREE.Mesh(geom, mat);
  mesh.receiveShadow = true;
  return mesh;
}

/**
 * Creates a lamp post with pole, glowing head, and point light.
 */
export function createLampPost(x: number, z: number): THREE.Group {
  const lampGroup = new THREE.Group();
  lampGroup.name = "lamp_post";

  // Pole
  const poleGeom = new THREE.CylinderGeometry(0.4, 0.4, 8, 6);
  const poleMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.5,
    metalness: 0.6
  });
  const pole = new THREE.Mesh(poleGeom, poleMat);
  pole.position.set(x, 4, z);
  pole.castShadow = true;
  lampGroup.add(pole);

  // Lamp head — warm amber glow
  const headGeom = new THREE.SphereGeometry(1.5, 8, 6);
  const headMat = new THREE.MeshStandardMaterial({
    color: 0xfde68a,
    emissive: 0xfde68a,
    emissiveIntensity: 0.6,
    roughness: 0.3,
    metalness: 0.0
  });
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.set(x, 8.5, z);
  lampGroup.add(head);

  // Point light
  const light = new THREE.PointLight(0xfde68a, 0.3, 25);
  light.position.set(x, 8.5, z);
  lampGroup.add(light);

  return lampGroup;
}

/**
 * Creates a chain-link fence around a rectangular area with a gate opening on the east side.
 */
export function createChainLinkFence(
  centerX: number,
  centerZ: number,
  width: number,
  depth: number,
  height: number
): THREE.Group {
  const fenceGroup = new THREE.Group();
  fenceGroup.name = "chain_link_fence";

  const halfW = width / 2;
  const halfD = depth / 2;
  const gateGap = 10;

  const wireMat = new THREE.MeshStandardMaterial({
    color: 0x64748b,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });

  const postMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.4,
    metalness: 0.7
  });

  // North panel
  const northPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    wireMat
  );
  northPanel.position.set(centerX, height / 2, centerZ - halfD);
  fenceGroup.add(northPanel);

  // South panel
  const southPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    wireMat
  );
  southPanel.position.set(centerX, height / 2, centerZ + halfD);
  fenceGroup.add(southPanel);

  // West panel
  const westPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(depth, height),
    wireMat
  );
  westPanel.position.set(centerX - halfW, height / 2, centerZ);
  westPanel.rotation.y = Math.PI / 2;
  fenceGroup.add(westPanel);

  // East panel — two halves with gate gap
  const eastPanelHalfLen = (depth - gateGap) / 2;
  if (eastPanelHalfLen > 0) {
    const eastTop = new THREE.Mesh(
      new THREE.PlaneGeometry(eastPanelHalfLen, height),
      wireMat
    );
    eastTop.position.set(centerX + halfW, height / 2, centerZ - halfD + eastPanelHalfLen / 2);
    eastTop.rotation.y = Math.PI / 2;
    fenceGroup.add(eastTop);

    const eastBottom = new THREE.Mesh(
      new THREE.PlaneGeometry(eastPanelHalfLen, height),
      wireMat
    );
    eastBottom.position.set(centerX + halfW, height / 2, centerZ + halfD - eastPanelHalfLen / 2);
    eastBottom.rotation.y = Math.PI / 2;
    fenceGroup.add(eastBottom);
  }

  // Corner posts
  const postGeom = new THREE.CylinderGeometry(0.3, 0.3, height, 6);
  const corners = [
    [centerX - halfW, centerZ - halfD],
    [centerX + halfW, centerZ - halfD],
    [centerX - halfW, centerZ + halfD],
    [centerX + halfW, centerZ + halfD]
  ];
  corners.forEach(([cx, cz]) => {
    const post = new THREE.Mesh(postGeom, postMat);
    post.position.set(cx, height / 2, cz);
    post.castShadow = true;
    fenceGroup.add(post);
  });

  return fenceGroup;
}

/**
 * Creates the Confession Tree Hill (Bukit Pohon Sakura) — terraced mound, giant sakura, bench, stone path.
 */
export function createConfessionTreeHill(viewBox: string): THREE.Group {
  const hillGroup = new THREE.Group();
  hillGroup.name = "confession_tree_hill";

  // Flagpole circle position: cx:343, cy:64
  const hillWorld = svgToWorld3D(343, 64, viewBox);
  const hx = hillWorld.x;
  const hz = hillWorld.z;

  // --- Terraced hill mound (3 stacked discs) ---
  const tiers = [
    { radius: 18, height: 2, color: 0x14532d, yBase: 0 },
    { radius: 12, height: 3, color: 0x166534, yBase: 2 },
    { radius: 7,  height: 2, color: 0x166534, yBase: 5 }
  ];
  tiers.forEach(tier => {
    const geom = new THREE.CylinderGeometry(tier.radius, tier.radius, tier.height, 12);
    const mat = new THREE.MeshStandardMaterial({ color: tier.color, roughness: 0.9 });
    const disc = new THREE.Mesh(geom, mat);
    disc.position.set(hx, tier.yBase + tier.height / 2, hz);
    disc.receiveShadow = true;
    disc.castShadow = true;
    hillGroup.add(disc);
  });

  const treeBaseY = 7; // top of terraced mound

  // --- Giant sakura tree ---
  // Trunk — tapered, slightly tilted
  const trunkGeom = new THREE.CylinderGeometry(1.2, 2.0, 12, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
  const trunk = new THREE.Mesh(trunkGeom, trunkMat);
  trunk.position.set(hx, treeBaseY + 6, hz);
  trunk.rotation.z = 0.08;
  trunk.castShadow = true;
  hillGroup.add(trunk);

  // Branch system — 5 radiating branches from trunk top
  const branchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
  const branchAngles = [0, Math.PI * 0.4, Math.PI * 0.8, Math.PI * 1.2, Math.PI * 1.6];
  branchAngles.forEach(angle => {
    const branchGeom = new THREE.CylinderGeometry(0.3, 0.6, 6, 6);
    const branch = new THREE.Mesh(branchGeom, branchMat);
    branch.position.set(
      hx + Math.cos(angle) * 3,
      treeBaseY + 12,
      hz + Math.sin(angle) * 3
    );
    branch.rotation.z = Math.cos(angle) * 0.6;
    branch.rotation.x = Math.sin(angle) * 0.6;
    branch.castShadow = true;
    hillGroup.add(branch);
  });

  // Canopy — overlapping pink spheres in a dome arrangement
  const canopyConfigs = [
    { r: 8,  x: 0,  y: 16, z: 0,  color: 0xf472b6 },
    { r: 6,  x: 5,  y: 15, z: 3,  color: 0xfbcfe8 },
    { r: 7,  x: -4, y: 14, z: 4,  color: 0xf472b6 },
    { r: 5,  x: 3,  y: 17, z: -4, color: 0xfbcfe8 },
    { r: 6,  x: -3, y: 16, z: -3, color: 0xf472b6 },
    { r: 5,  x: 0,  y: 18, z: 0,  color: 0xfbcfe8 },
    { r: 4,  x: 4,  y: 17, z: 2,  color: 0xf472b6 }
  ];
  canopyConfigs.forEach(cfg => {
    const geom = new THREE.SphereGeometry(cfg.r, 8, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: cfg.color,
      transparent: true,
      opacity: 0.85,
      roughness: 0.8,
      metalness: 0.0,
      depthWrite: false
    });
    const sphere = new THREE.Mesh(geom, mat);
    sphere.position.set(hx + cfg.x, treeBaseY + cfg.y, hz + cfg.z);
    sphere.castShadow = true;
    hillGroup.add(sphere);
  });

  // --- Semi-circular bench at base of tree ---
  const benchSegments = 3;
  for (let i = 0; i < benchSegments; i++) {
    const angle = (Math.PI / 2) + (i * Math.PI) / (benchSegments - 1); // semicircle from PI/2 to 3PI/2 (front-facing)
    const benchGeom = new THREE.BoxGeometry(8, 0.8, 2);
    const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
    const bench = new THREE.Mesh(benchGeom, benchMat);
    bench.position.set(
      hx + Math.cos(angle) * 10,
      treeBaseY + 0.4,
      hz + Math.sin(angle) * 10
    );
    bench.rotation.y = -angle + Math.PI / 2;
    bench.receiveShadow = true;
    hillGroup.add(bench);
  }

  // --- Stone stepping path spiraling up the hill ---
  const stoneCount = 6;
  for (let i = 0; i < stoneCount; i++) {
    const t = i / stoneCount;
    const spiralAngle = t * Math.PI * 2.5; // 2.5 rotations
    const spiralRadius = 18 - t * 14;      // from outer rim toward center
    const stoneGeom = new THREE.CylinderGeometry(1.5, 1.5, 0.3, 6);
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
    const stone = new THREE.Mesh(stoneGeom, stoneMat);
    stone.position.set(
      hx + Math.cos(spiralAngle) * spiralRadius,
      t * 6 + 0.15,
      hz + Math.sin(spiralAngle) * spiralRadius
    );
    stone.receiveShadow = true;
    hillGroup.add(stone);
  }

  return hillGroup;
}

/**
 * Creates a sakura petal particle system that drifts and falls.
 * Returns the Points object and an update function to call each frame.
 */
export function createSakuraPetalSystem(
  viewBox: string
): { points: THREE.Points; update: (time: number) => void } {
  const hillWorld = svgToWorld3D(343, 64, viewBox);
  const hx = hillWorld.x;
  const hz = hillWorld.z;
  const canopyY = 7 + 18; // treeBaseY + highest canopy y

  const count = 300;
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3); // vx, vy, vz per particle
  const phases = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    // Random within 30-unit radius sphere above canopy
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.random() * 30;
    positions[i3] = hx + Math.sin(phi) * Math.cos(theta) * r;
    positions[i3 + 1] = canopyY + Math.random() * 10;
    positions[i3 + 2] = hz + Math.sin(phi) * Math.sin(theta) * r;

    velocities[i3] = 0;
    velocities[i3 + 1] = -(0.08 + Math.random() * 0.04);
    velocities[i3 + 2] = 0;

    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xfda4af,
    size: 1.2,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  points.name = "sakura_petals";

  const update = (time: number) => {
    const posAttr = geometry.attributes.position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const phase = phases[i];

      // Horizontal drift
      posArray[i3] += Math.sin(time * 0.001 * 0.5 + phase) * 0.15;
      // Vertical fall
      posArray[i3 + 1] += velocities[i3 + 1];
      // Z drift
      posArray[i3 + 2] += Math.cos(time * 0.001 * 0.3 + phase) * 0.1;

      // Reset petal when it falls below ground
      if (posArray[i3 + 1] < -5) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 20;
        posArray[i3] = hx + Math.cos(theta) * r;
        posArray[i3 + 1] = canopyY + 5 + Math.random() * 10; // 15-25 above tree base
        posArray[i3 + 2] = hz + Math.sin(theta) * r;
      }
    }

    posAttr.needsUpdate = true;
  };

  return { points, update };
}

/**
 * Creates 3D representation for campus grounds (Athletic field, pool, gym, gardens, maze).
 */
export function createCampusFacilitiesGroup(campusFloor: Floor): THREE.Group {
  const group = new THREE.Group();
  group.name = "campus_facilities";
  const viewBox = campusFloor.viewBox;

  // 1. Ground terrain slab
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const groundGeom = new THREE.BoxGeometry(vbW * SCALE_3D + 40, 2, vbH * SCALE_3D + 40);
  const groundMat = new THREE.MeshStandardMaterial({
    color: 0x090d16,
    roughness: 0.9,
    metalness: 0.1
  });
  const groundMesh = new THREE.Mesh(groundGeom, groundMat);
  groundMesh.position.set(0, -1, 0);
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // 2. Full Campus Walkway Network (Extruded from authentic SVG path)
  const walkwayElement = campusFloor.decorativeElements?.find(e => e.id === "campus_walkways");
  if (walkwayElement && walkwayElement.type === "path" && walkwayElement.pathData) {
    // Curb border — slightly larger underlay mesh for stepped edge effect
    const curbMesh = createSvgPathMesh(walkwayElement.pathData, viewBox, 0.6, 0x1e293b);
    if (curbMesh) {
      curbMesh.position.y = 0.0;
      curbMesh.scale.set(1.04, 1, 1.04);
      group.add(curbMesh);
    }

    // Main walkway surface — elevated with improved contrast
    const walkwaysMesh = createSvgPathMesh(walkwayElement.pathData, viewBox, 0.35, 0x334155);
    if (walkwaysMesh) {
      walkwaysMesh.position.y = 0.2;
      group.add(walkwaysMesh);
    }

    // Lamp posts along walkway intersections
    const lampPositions = [
      { svgX: 200, svgY: 350 },  // Near pool entrance
      { svgX: 480, svgY: 350 },  // Near gym entrance
      { svgX: 340, svgY: 840 },  // South gate area
      { svgX: 120, svgY: 550 },  // West garden junction
      { svgX: 560, svgY: 550 },  // East maze junction
    ];
    lampPositions.forEach(pos => {
      const world = svgToWorld3D(pos.svgX, pos.svgY, viewBox);
      group.add(createLampPost(world.x, world.z));
    });
  }

  // Chain-link fence around the swimming pool
  const poolRoom = campusFloor.rooms.find(r => r.id === "campus_swimming_pool");
  if (poolRoom) {
    const poolCX = poolRoom.rect.x + poolRoom.rect.width / 2;
    const poolCY = poolRoom.rect.y + poolRoom.rect.height / 2;
    const poolWorld = svgToWorld3D(poolCX, poolCY, viewBox);
    const fenceW = poolRoom.rect.width * SCALE_3D + 12;
    const fenceD = poolRoom.rect.height * SCALE_3D + 12;
    group.add(createChainLinkFence(poolWorld.x, poolWorld.z, fenceW, fenceD, 6));
  }

  // 3. Campus Zones & Buildings
  campusFloor.rooms.forEach(room => {
    const roomCenter = getRoomCenter(room);
    const worldPos = svgToWorld3D(roomCenter.x, roomCenter.y, viewBox);
    const w = room.rect.width * SCALE_3D;
    const d = room.rect.height * SCALE_3D;

    // --- MAIN BUILDING (3 Storeys with courtyard atrium) ---
    if (room.id === "campus_main_building") {
      const bGroup = new THREE.Group();
      bGroup.name = "campus_main_building_structure";

      const totalW = w; // 145
      const totalD = d; // 164
      const buildingHeight = 22; // 3 storeys

      // Courtyard inner dimensions
      const courtyardW = 175 * SCALE_3D; // 87.5
      const courtyardD = 174 * SCALE_3D; // 87
      const wingThickX = (totalW - courtyardW) / 2; // 28.75
      const courtyardRelZ = -10.5;
      const northWingD = (totalD - courtyardD) / 2 + courtyardRelZ; // ~ 28
      const southWingD = (totalD - courtyardD) / 2 - courtyardRelZ; // ~ 49

      const facadeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.7,
        metalness: 0.2
      });

      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.85,
        metalness: 0.1
      });

      // West Wing
      const westWing = new THREE.Mesh(
        new THREE.BoxGeometry(wingThickX, buildingHeight, totalD),
        facadeMat
      );
      westWing.position.set(worldPos.x - totalW / 2 + wingThickX / 2, buildingHeight / 2, worldPos.z);
      westWing.castShadow = true;
      westWing.receiveShadow = true;
      bGroup.add(westWing);

      // East Wing
      const eastWing = new THREE.Mesh(
        new THREE.BoxGeometry(wingThickX, buildingHeight, totalD),
        facadeMat
      );
      eastWing.position.set(worldPos.x + totalW / 2 - wingThickX / 2, buildingHeight / 2, worldPos.z);
      eastWing.castShadow = true;
      eastWing.receiveShadow = true;
      bGroup.add(eastWing);

      // North Wing
      const northWing = new THREE.Mesh(
        new THREE.BoxGeometry(courtyardW, buildingHeight, northWingD),
        facadeMat
      );
      northWing.position.set(worldPos.x, buildingHeight / 2, worldPos.z - totalD / 2 + northWingD / 2);
      northWing.castShadow = true;
      northWing.receiveShadow = true;
      bGroup.add(northWing);

      // South Wing (Main Front Facade)
      const southWing = new THREE.Mesh(
        new THREE.BoxGeometry(courtyardW, buildingHeight, southWingD),
        facadeMat
      );
      southWing.position.set(worldPos.x, buildingHeight / 2, worldPos.z + totalD / 2 - southWingD / 2);
      southWing.castShadow = true;
      southWing.receiveShadow = true;
      bGroup.add(southWing);

      // Roof caps on the 4 wings (leaves the central courtyard atrium open to the sky!)
      const westRoofCap = new THREE.Mesh(
        new THREE.BoxGeometry(wingThickX + 1, 1.2, totalD + 1),
        roofMat
      );
      westRoofCap.position.set(worldPos.x - totalW / 2 + wingThickX / 2, buildingHeight + 0.6, worldPos.z);
      bGroup.add(westRoofCap);

      const eastRoofCap = new THREE.Mesh(
        new THREE.BoxGeometry(wingThickX + 1, 1.2, totalD + 1),
        roofMat
      );
      eastRoofCap.position.set(worldPos.x + totalW / 2 - wingThickX / 2, buildingHeight + 0.6, worldPos.z);
      bGroup.add(eastRoofCap);

      const northRoofCap = new THREE.Mesh(
        new THREE.BoxGeometry(courtyardW + 1, 1.2, northWingD + 1),
        roofMat
      );
      northRoofCap.position.set(worldPos.x, buildingHeight + 0.6, worldPos.z - totalD / 2 + northWingD / 2);
      bGroup.add(northRoofCap);

      const southRoofCap = new THREE.Mesh(
        new THREE.BoxGeometry(courtyardW + 1, 1.2, southWingD + 1),
        roofMat
      );
      southRoofCap.position.set(worldPos.x, buildingHeight + 0.6, worldPos.z + totalD / 2 - southWingD / 2);
      bGroup.add(southRoofCap);

      // Inner Courtyard Grass & Plaza
      const courtSlab = new THREE.Mesh(
        new THREE.BoxGeometry(courtyardW, 0.4, courtyardD),
        new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 })
      );
      courtSlab.position.set(worldPos.x, 0.2, worldPos.z + courtyardRelZ);
      bGroup.add(courtSlab);

      // South Entrance Portico Canopy
      const canopy = new THREE.Mesh(
        new THREE.BoxGeometry(32, 2.5, 10),
        new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 })
      );
      canopy.position.set(worldPos.x, 5, worldPos.z + totalD / 2 + 5);
      canopy.castShadow = true;
      bGroup.add(canopy);

      // Raycasting volume covering the whole building
      const hitGeom = new THREE.BoxGeometry(totalW + 4, buildingHeight + 4, totalD + 4);
      const hitMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        transparent: true,
        opacity: 0.05,
        depthWrite: false
      });
      const hitMesh = new THREE.Mesh(hitGeom, hitMat);
      hitMesh.position.set(worldPos.x, buildingHeight / 2, worldPos.z);
      hitMesh.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x1e293b,
        emissiveColor: 0xe11d48,
        category: room.category
      };
      bGroup.add(hitMesh);

      group.add(bGroup);

      // Label
      const label = createRoomLabelSprite(room, viewBox, buildingHeight + 5);
      group.add(label);
      return;
    }

    // --- GYMNASIUM ---
    if (room.id === "campus_gymnasium") {
      const gymGroup = new THREE.Group();
      const gymHeight = 16;

      const hallGeom = new THREE.BoxGeometry(w, gymHeight, d);
      const hallMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.65,
        metalness: 0.2
      });
      const hall = new THREE.Mesh(hallGeom, hallMat);
      hall.position.set(worldPos.x, gymHeight / 2, worldPos.z);
      hall.castShadow = true;
      hall.receiveShadow = true;
      gymGroup.add(hall);

      const roofGeom = new THREE.BoxGeometry(w + 3, 4.5, d + 3);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.7,
        metalness: 0.3
      });
      const roof = new THREE.Mesh(roofGeom, roofMat);
      roof.position.set(worldPos.x, gymHeight + 2.25, worldPos.z);
      roof.castShadow = true;
      gymGroup.add(roof);

      hall.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x1e293b,
        emissiveColor: 0xe11d48,
        category: room.category
      };

      group.add(gymGroup);

      const label = createRoomLabelSprite(room, viewBox, gymHeight + 6);
      group.add(label);
      return;
    }

    // --- SWIMMING POOL ---
    if (room.id === "campus_swimming_pool") {
      const poolGroup = new THREE.Group();

      const deckGeom = new THREE.BoxGeometry(w, 0.8, d);
      const deckMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.8
      });
      const deck = new THREE.Mesh(deckGeom, deckMat);
      deck.position.set(worldPos.x, 0.4, worldPos.z);
      deck.receiveShadow = true;
      poolGroup.add(deck);

      const waterW = w - 16;
      const waterD = d - 14;
      const waterGeom = new THREE.BoxGeometry(waterW, 0.4, waterD);
      const waterMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.3,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35
      });
      const water = new THREE.Mesh(waterGeom, waterMat);
      water.position.set(worldPos.x, 0.82, worldPos.z);
      poolGroup.add(water);

      // Swimming lane divider lines
      const laneCount = 4;
      for (let l = 1; l < laneCount; l++) {
        const laneZ = worldPos.z - waterD / 2 + (waterD / laneCount) * l;
        const laneGeom = new THREE.BoxGeometry(waterW - 4, 0.05, 0.6);
        const laneMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const lane = new THREE.Mesh(laneGeom, laneMat);
        lane.position.set(worldPos.x, 1.05, laneZ);
        poolGroup.add(lane);
      }

      const bleacherGeom = new THREE.BoxGeometry(waterW, 3.5, 8);
      const bleacherMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
      const bleachers = new THREE.Mesh(bleacherGeom, bleacherMat);
      bleachers.position.set(worldPos.x, 1.75, worldPos.z - d / 2 + 4);
      bleachers.castShadow = true;
      poolGroup.add(bleachers);

      deck.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x1e293b,
        emissiveColor: 0xe11d48,
        category: room.category
      };

      group.add(poolGroup);

      const label = createRoomLabelSprite(room, viewBox, 6);
      group.add(label);
      return;
    }

    // --- ATHLETIC FIELD ---
    if (room.id === "campus_athletic_field") {
      const fieldGroup = new THREE.Group();

      const trackGeom = new THREE.BoxGeometry(w, 0.8, d);
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x831843,
        roughness: 0.85
      });
      const track = new THREE.Mesh(trackGeom, trackMat);
      track.position.set(worldPos.x, 0.4, worldPos.z);
      track.receiveShadow = true;
      fieldGroup.add(track);

      const grassW = w - 50;
      const grassD = d - 32;
      const grassGeom = new THREE.BoxGeometry(grassW, 0.4, grassD);
      const grassMat = new THREE.MeshStandardMaterial({
        color: 0x064e3b,
        roughness: 0.95
      });
      const grass = new THREE.Mesh(grassGeom, grassMat);
      grass.position.set(worldPos.x, 0.7, worldPos.z);
      grass.receiveShadow = true;
      fieldGroup.add(grass);

      const podiumGeom = new THREE.CylinderGeometry(8, 8, 1.5, 16);
      const podiumMat = new THREE.MeshStandardMaterial({ color: 0x047857 });
      const podium = new THREE.Mesh(podiumGeom, podiumMat);
      podium.position.set(worldPos.x, 1.0, worldPos.z - d / 2 + 10);
      fieldGroup.add(podium);

      const poleGeom = new THREE.CylinderGeometry(0.5, 0.5, 16, 8);
      const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
      const pole = new THREE.Mesh(poleGeom, poleMat);
      pole.position.set(worldPos.x, 9.0, worldPos.z - d / 2 + 10);
      fieldGroup.add(pole);

      track.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x831843,
        emissiveColor: 0xe11d48,
        category: room.category
      };

      group.add(fieldGroup);

      const label = createRoomLabelSprite(room, viewBox, 6);
      group.add(label);
      return;
    }

    // --- HEDGE MAZE ---
    if (room.id === "campus_hedge_maze") {
      const mazeGroup = new THREE.Group();

      const baseGeom = new THREE.BoxGeometry(w, 0.5, d);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.9 });
      const base = new THREE.Mesh(baseGeom, baseMat);
      base.position.set(worldPos.x, 0.25, worldPos.z);
      mazeGroup.add(base);

      const hedgeMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.9 });
      const hHeight = 4.5;
      const wallThickness = 3.5;

      const northHedge = new THREE.Mesh(new THREE.BoxGeometry(w, hHeight, wallThickness), hedgeMat);
      northHedge.position.set(worldPos.x, hHeight / 2, worldPos.z - d / 2 + wallThickness / 2);
      mazeGroup.add(northHedge);

      const southHedge = new THREE.Mesh(new THREE.BoxGeometry(w - 20, hHeight, wallThickness), hedgeMat);
      southHedge.position.set(worldPos.x - 10, hHeight / 2, worldPos.z + d / 2 - wallThickness / 2);
      mazeGroup.add(southHedge);

      const westHedge = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, hHeight, d), hedgeMat);
      westHedge.position.set(worldPos.x - w / 2 + wallThickness / 2, hHeight / 2, worldPos.z);
      mazeGroup.add(westHedge);

      const eastHedge = new THREE.Mesh(new THREE.BoxGeometry(wallThickness, hHeight, d), hedgeMat);
      eastHedge.position.set(worldPos.x + w / 2 - wallThickness / 2, hHeight / 2, worldPos.z);
      mazeGroup.add(eastHedge);

      const innerWall1 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.6, hHeight, wallThickness), hedgeMat);
      innerWall1.position.set(worldPos.x, hHeight / 2, worldPos.z);
      mazeGroup.add(innerWall1);

      base.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x14532d,
        emissiveColor: 0xe11d48,
        category: room.category
      };

      group.add(mazeGroup);

      const label = createRoomLabelSprite(room, viewBox, hHeight + 3);
      group.add(label);
      return;
    }

    // --- GARDENS (West/East Zen & Botanical) ---
    const isZen = room.id.includes("zen");
    const gardenHeight = isZen ? 1.0 : 1.2;
    const geom = new THREE.BoxGeometry(w, gardenHeight, d);
    const mat = new THREE.MeshStandardMaterial({
      color: isZen ? 0x334155 : 0x064e3b,
      roughness: 0.95
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(worldPos.x, gardenHeight / 2, worldPos.z);
    mesh.receiveShadow = true;

    mesh.userData = {
      isRoom: true,
      roomId: room.id,
      room: room,
      baseColor: isZen ? 0x334155 : 0x064e3b,
      emissiveColor: 0xe11d48,
      category: room.category
    };

    group.add(mesh);

    const label = createRoomLabelSprite(room, viewBox, gardenHeight + 3);
    group.add(label);
  });

  // Confession Tree Hill (Bukit Pohon Sakura) — behind the athletic field
  const confessionHill = createConfessionTreeHill(viewBox);
  group.add(confessionHill);

  // Sakura petal particle system
  const petalSystem = createSakuraPetalSystem(viewBox);
  group.add(petalSystem.points);

  // Store petal update on group userData so the render loop can drive it
  group.userData.petalUpdate = petalSystem.update;

  return group;
}
