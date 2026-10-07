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
    const walkwaysMesh = createSvgPathMesh(walkwayElement.pathData, viewBox, 0.35, 0x24324a);
    if (walkwaysMesh) {
      group.add(walkwaysMesh);
    }
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

  return group;
}
