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

  // 2. Campus Zones
  campusFloor.rooms.forEach(room => {
    const roomCenter = getRoomCenter(room);
    const worldPos = svgToWorld3D(roomCenter.x, roomCenter.y, viewBox);
    const w = room.rect.width * SCALE_3D;
    const d = room.rect.height * SCALE_3D;

    if (room.id === "campus_main_building") {
      // Create transparent proxy volume covering the main building footprint for raycasting
      const buildingHeight = 4 * FLOOR_HEIGHT_3D;
      const geom = new THREE.BoxGeometry(w, buildingHeight, d);
      const mat = new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(worldPos.x, buildingHeight / 2, worldPos.z);
      mesh.userData = {
        isRoom: true,
        roomId: room.id,
        room: room,
        baseColor: 0x1e293b,
        emissiveColor: 0xe11d48,
        category: room.category
      };
      group.add(mesh);
      return;
    }

    let zoneColor = 0x1e293b;
    let zoneHeight = 1.5;

    if (room.id === "campus_athletic_field") {
      zoneColor = 0x831843; // Running track wine red
      zoneHeight = 0.8;
    } else if (room.id === "campus_swimming_pool") {
      zoneColor = 0x0284c7; // Water azure
      zoneHeight = 0.5;
    } else if (room.id === "campus_gymnasium") {
      zoneColor = 0x334155; // Gym building
      zoneHeight = 16;
    } else if (room.id.includes("garden")) {
      zoneColor = 0x064e3b; // Garden emerald
      zoneHeight = 1.0;
    } else if (room.id === "campus_hedge_maze") {
      zoneColor = 0x14532d; // Maze forest green
      zoneHeight = 6.0;
    }

    const geom = new THREE.BoxGeometry(w, zoneHeight, d);
    const mat = new THREE.MeshStandardMaterial({
      color: zoneColor,
      roughness: room.id === "campus_swimming_pool" ? 0.1 : 0.7,
      metalness: room.id === "campus_swimming_pool" ? 0.4 : 0.1
    });

    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(worldPos.x, zoneHeight / 2, worldPos.z);
    mesh.castShadow = zoneHeight > 2;
    mesh.receiveShadow = true;

    mesh.userData = {
      isRoom: true,
      roomId: room.id,
      room: room,
      baseColor: zoneColor,
      emissiveColor: 0xe11d48,
      category: room.category
    };

    group.add(mesh);

    // Label
    const label = createRoomLabelSprite(room, viewBox, zoneHeight + 2);
    group.add(label);
  });

  return group;
}
