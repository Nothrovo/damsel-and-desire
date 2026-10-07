import { MAP_FLOORS } from "./mapData";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import { getCategoryLabel } from "./mapUtils";
import type { FloorId, Room } from "./types";

export interface SearchResult {
  room: Room;
  floorId: FloorId;
  floorLabel: string;
  categoryLabel: string;
  matchedText: string;
  ekskulName?: string;
  score: number;
}

// Build pre-indexed search catalog for instantaneous lookup (<1ms)
interface SearchEntry {
  room: Room;
  floorId: FloorId;
  floorLabel: string;
  categoryLabel: string;
  ekskulName?: string;
  searchableTokens: string[];
}

let searchCatalog: SearchEntry[] | null = null;

function buildSearchCatalog(): SearchEntry[] {
  if (searchCatalog) return searchCatalog;

  const ekskulMap = new Map<string, string>();
  for (const ek of FALLBACK_DD_DATA.ekskul) {
    ekskulMap.set(ek.id, ek.name);
  }

  const entries: SearchEntry[] = [];

  for (const floor of Object.values(MAP_FLOORS)) {
    for (const room of floor.rooms) {
      const tokens: string[] = [
        room.name.toLowerCase(),
        room.id.toLowerCase(),
        room.category.toLowerCase(),
        getCategoryLabel(room.category).toLowerCase(),
        floor.label.toLowerCase(),
        floor.id.toLowerCase()
      ];

      if (room.shortLabel) {
        tokens.push(room.shortLabel.toLowerCase());
      }
      if (room.description) {
        tokens.push(room.description.toLowerCase());
      }

      let ekskulName: string | undefined;
      if (room.ekskulId && ekskulMap.has(room.ekskulId)) {
        ekskulName = ekskulMap.get(room.ekskulId);
        if (ekskulName) tokens.push(ekskulName.toLowerCase());
      }

      if (room.relatedEkskulIds) {
        for (const relId of room.relatedEkskulIds) {
          const relName = ekskulMap.get(relId);
          if (relName) tokens.push(relName.toLowerCase());
        }
      }

      entries.push({
        room,
        floorId: floor.id,
        floorLabel: floor.label,
        categoryLabel: getCategoryLabel(room.category),
        ekskulName,
        searchableTokens: tokens
      });
    }
  }

  searchCatalog = entries;
  return searchCatalog;
}

export function searchSchoolMap(query: string, maxResults: number = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const catalog = buildSearchCatalog();
  const results: SearchResult[] = [];

  for (const entry of catalog) {
    let score = 0;
    let matchedText = "";

    const roomNameLower = entry.room.name.toLowerCase();
    const shortLabelLower = (entry.room.shortLabel || "").toLowerCase();
    const ekskulNameLower = (entry.ekskulName || "").toLowerCase();

    // 1. Exact or starts-with room name
    if (roomNameLower === q) {
      score += 100;
      matchedText = entry.room.name;
    } else if (roomNameLower.startsWith(q)) {
      score += 80;
      matchedText = entry.room.name;
    } else if (roomNameLower.includes(q)) {
      score += 60;
      matchedText = entry.room.name;
    }

    // 2. Short label match
    if (shortLabelLower && shortLabelLower.includes(q)) {
      score += Math.max(score, 50);
      if (!matchedText) matchedText = entry.room.shortLabel!;
    }

    // 3. Ekskul name match
    if (ekskulNameLower) {
      if (ekskulNameLower === q) {
        score += 90;
        matchedText = `Klub: ${entry.ekskulName}`;
      } else if (ekskulNameLower.startsWith(q)) {
        score += 75;
        matchedText = `Klub: ${entry.ekskulName}`;
      } else if (ekskulNameLower.includes(q)) {
        score += 55;
        matchedText = `Klub: ${entry.ekskulName}`;
      }
    }

    // 4. Category match
    const categoryLower = entry.categoryLabel.toLowerCase();
    if (categoryLower.includes(q) || entry.room.category.toLowerCase().includes(q)) {
      score += 30;
      if (!matchedText) matchedText = `Kategori: ${entry.categoryLabel}`;
    }

    // 5. Floor token match (e.g. "3f", "rooftop", "kampus")
    if (entry.floorId.toLowerCase() === q || entry.floorLabel.toLowerCase().includes(q)) {
      score += 20;
      if (!matchedText) matchedText = entry.floorLabel;
    }

    // 6. Substring match in description or other tokens
    if (score === 0) {
      for (const token of entry.searchableTokens) {
        if (token.includes(q)) {
          score += 15;
          matchedText = entry.room.name;
          break;
        }
      }
    }

    if (score > 0) {
      results.push({
        room: entry.room,
        floorId: entry.floorId,
        floorLabel: entry.floorLabel,
        categoryLabel: entry.categoryLabel,
        matchedText: matchedText || entry.room.name,
        ekskulName: entry.ekskulName,
        score
      });
    }
  }

  // Sort descending by score, then alphabetically by room name
  return results
    .sort((a, b) => b.score - a.score || a.room.name.localeCompare(b.room.name))
    .slice(0, maxResults);
}
