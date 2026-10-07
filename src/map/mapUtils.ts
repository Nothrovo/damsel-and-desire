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
        fill: "#ffe0f1",
        stroke: "#ffacda",
        text: "#be185d",
        badgeBg: "rgba(255, 224, 241, 0.35)",
        badgeBorder: "#ffacda"
      };
    case "club":
      return {
        fill: "#ffd7ec",
        stroke: "#f472b6",
        text: "#9d174d",
        badgeBg: "rgba(244, 114, 182, 0.2)",
        badgeBorder: "#f472b6"
      };
    case "facility":
      return {
        fill: "#fce7f3",
        stroke: "#ec4899",
        text: "#831843",
        badgeBg: "rgba(236, 72, 153, 0.2)",
        badgeBorder: "#ec4899"
      };
    case "admin":
      return {
        fill: "#fae8ff",
        stroke: "#d946ef",
        text: "#701a75",
        badgeBg: "rgba(217, 70, 239, 0.2)",
        badgeBorder: "#d946ef"
      };
    case "utility":
      return {
        fill: "#fdf2f8",
        stroke: "#fbcfe8",
        text: "#6b7280",
        badgeBg: "rgba(251, 207, 232, 0.25)",
        badgeBorder: "#fbcfe8"
      };
    case "common":
      return {
        fill: "#fff1f2",
        stroke: "#fb7185",
        text: "#9f1239",
        badgeBg: "rgba(251, 113, 133, 0.2)",
        badgeBorder: "#fb7185"
      };
    case "outdoor":
      return {
        fill: "#f0fdf4",
        stroke: "#4ade80",
        text: "#15803d",
        badgeBg: "rgba(74, 222, 128, 0.2)",
        badgeBorder: "#4ade80"
      };
    case "access":
      return {
        fill: "#f5f3ff",
        stroke: "#c084fc",
        text: "#581c87",
        badgeBg: "rgba(192, 132, 252, 0.2)",
        badgeBorder: "#c084fc"
      };
  }
}
