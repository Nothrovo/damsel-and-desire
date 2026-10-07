import type { Point, Rect, Room, RoomCategory } from "./types";

export function getRoomCenter(room: Room): Point {
  if (room.polygon && room.polygon.length > 0) {
    let sumX = 0;
    let sumY = 0;
    for (const pt of room.polygon) {
      sumX += pt.x;
      sumY += pt.y;
    }
    return {
      x: sumX / room.polygon.length,
      y: sumY / room.polygon.length
    };
  }
  return {
    x: room.rect.x + room.rect.width / 2,
    y: room.rect.y + room.rect.height / 2
  };
}

export function rectToPolygon(rect: Rect): Point[] {
  return [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height }
  ];
}

export function isPointInPolygon(point: Point, polygon: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    const intersect =
      yi > point.y !== yj > point.y &&
      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function doRectanglesOverlap(r1: Rect, r2: Rect, tolerance: number = 2): boolean {
  const noOverlap =
    r1.x + r1.width - tolerance <= r2.x ||
    r2.x + r2.width - tolerance <= r1.x ||
    r1.y + r1.height - tolerance <= r2.y ||
    r2.y + r2.height - tolerance <= r1.y;

  return !noOverlap;
}

export function getCategoryLabel(category: RoomCategory): string {
  switch (category) {
    case "classroom":
      return "Ruang Kelas";
    case "club":
      return "Klub Ekskul";
    case "facility":
      return "Fasilitas Belajar";
    case "admin":
      return "Administrasi & Guru";
    case "utility":
      return "Utilitas & Sanitasi";
    case "common":
      return "Area Bersama";
    case "outdoor":
      return "Area Terbuka / Taman";
    case "access":
      return "Akses Tangga / Atap";
    default:
      return "Ruangan";
  }
}

export function getCategoryColor(category: RoomCategory): {
  fill: string;
  stroke: string;
  text: string;
  badgeBg: string;
  badgeBorder: string;
} {
  switch (category) {
    case "classroom":
      return {
        fill: "#131f33",
        stroke: "#38bdf8",
        text: "#bae6fd",
        badgeBg: "rgba(56, 189, 248, 0.15)",
        badgeBorder: "#38bdf8"
      };
    case "club":
      return {
        fill: "#241321",
        stroke: "#f43f5e",
        text: "#fecdd3",
        badgeBg: "rgba(244, 63, 94, 0.18)",
        badgeBorder: "#f43f5e"
      };
    case "facility":
      return {
        fill: "#0c2321",
        stroke: "#14b8a6",
        text: "#99f6e4",
        badgeBg: "rgba(20, 184, 166, 0.15)",
        badgeBorder: "#14b8a6"
      };
    case "admin":
      return {
        fill: "#261d12",
        stroke: "#f59e0b",
        text: "#fde68a",
        badgeBg: "rgba(245, 158, 11, 0.15)",
        badgeBorder: "#f59e0b"
      };
    case "utility":
      return {
        fill: "#171e2c",
        stroke: "#64748b",
        text: "#cbd5e1",
        badgeBg: "rgba(100, 116, 139, 0.15)",
        badgeBorder: "#64748b"
      };
    case "common":
      return {
        fill: "#1b1933",
        stroke: "#818cf8",
        text: "#c7d2fe",
        badgeBg: "rgba(129, 140, 248, 0.15)",
        badgeBorder: "#818cf8"
      };
    case "outdoor":
      return {
        fill: "#09241b",
        stroke: "#10b981",
        text: "#a7f3d0",
        badgeBg: "rgba(16, 185, 129, 0.15)",
        badgeBorder: "#10b981"
      };
    case "access":
      return {
        fill: "#1c152d",
        stroke: "#a855f7",
        text: "#e9d5ff",
        badgeBg: "rgba(168, 85, 247, 0.15)",
        badgeBorder: "#a855f7"
      };
  }
}

export function calculateFocusTransform(
  room: Room,
  viewBox: string,
  targetDimension: number = 400
): { scale: number; panX: number; panY: number } {
  const center = getRoomCenter(room);
  const [, , vbW, vbH] = viewBox.split(" ").map(Number);
  const targetScale = Math.min(
    2.2,
    Math.max(1.5, targetDimension / Math.max(room.rect.width, room.rect.height))
  );
  const panX = vbW / 2 - targetScale * center.x;
  const panY = vbH / 2 - targetScale * center.y;
  return { scale: targetScale, panX, panY };
}
