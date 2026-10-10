import fs from "fs";
import path from "path";
import { parseMarkdownCharacter } from "./validateCodex.js";

const TARGET_DIR = "Characters/Love Interests";
const OUTPUT_FILE = "src/data/loveInterestCompendium.ts";

function mapClassRoomToCategory(meta) {
  const gradeStr = String(meta?.grade || "").toLowerCase();
  const cr = String(meta?.class_room || "").toLowerCase();
  if (
    gradeStr.includes("faculty") ||
    cr.includes("faculty") ||
    cr.includes("guru") ||
    cr.includes("staf") ||
    cr.includes("kepala sekolah") ||
    cr.includes("principal") ||
    cr.includes("uks") ||
    cr.includes("perpustakaan")
  ) {
    return "faculty";
  }
  if (cr.includes("12-1") || cr.includes("3-1")) return "class_3_1";
  if (cr.includes("12-2") || cr.includes("3-2")) return "class_3_2";
  if (cr.includes("11-1") || cr.includes("2-1")) return "class_2_1";
  if (cr.includes("11-2") || cr.includes("2-2")) return "class_2_2";
  if (cr.includes("10-1") || cr.includes("1-1")) return "class_1_1";
  if (cr.includes("10-2") || cr.includes("1-2")) return "class_1_2";
  return "other";
}

function parseHeartMilestones(text) {
  const milestones = [];
  if (!text) return milestones;

  // Format A: Markdown list: * **1–2 ♥ (Angkuh Berjarak / Ujian Tatapan):** deskripsi
  const listRegex = /\*\s*\*\*([0-9–\-]+)\s*♥(?:\s*\(([^)]+)\))?:\*\*\s*([\s\S]*?)(?=(?:\r?\n\*\s*\*\*|\r?\n###|\r?\n##|$))/g;
  let match;
  while ((match = listRegex.exec(text)) !== null) {
    const range = match[1].trim();
    const title = (match[2] || "").trim();
    const desc = match[3].trim().replace(/\r?\n+/g, " ");

    const parts = range.split(/[–\-]/).map((n) => parseInt(n.trim(), 10));
    const minHearts = parts[0] || 1;
    const maxHearts = parts.length > 1 ? parts[1] : minHearts;

    milestones.push({
      range: `${range} ♥`,
      minHearts,
      maxHearts,
      title: title || `${range} ♥`,
      description: desc
    });
  }

  if (milestones.length > 0) return milestones;

  // Format B: Table: | **1 ♥** | *Status* | Perilaku | Event |
  const tableRowRegex = /\|\s*\*\*([0-9]+)\s*♥\*\*\s*\|\s*\*?([^*|]+)\*?\s*\|\s*([^|]+)\s*\|\s*([^|]+)\s*\|/g;
  while ((match = tableRowRegex.exec(text)) !== null) {
    const val = parseInt(match[1].trim(), 10);
    const title = match[2].trim();
    const behavior = match[3].trim();
    const event = match[4].trim();

    milestones.push({
      range: `${val} ♥`,
      minHearts: val,
      maxHearts: val,
      title,
      description: `${behavior}${event ? ` (${event})` : ""}`
    });
  }

  return milestones;
}

function parseGifts(text) {
  const gifts = {
    favorite: [],
    normal: [],
    disliked: []
  };
  if (!text) return gifts;

  // Format A: * **Hadiah Favorit (+Afeksi Besar):** item1, item2
  const favMatch = text.match(/\*\s*\*\*(?:Hadiah Favorit|Sangat Disukai)[^:]*:\*\*\s*([^\n\r]+)/i);
  if (favMatch) {
    gifts.favorite = favMatch[1].split(/[,•]/).map((s) => s.trim().replace(/^\*\s*/, "")).filter(Boolean);
  }

  const normMatch = text.match(/\*\s*\*\*(?:Hadiah Biasa|Disukai)[^:]*:\*\*\s*([^\n\r]+)/i);
  if (normMatch) {
    gifts.normal = normMatch[1].split(/[,•]/).map((s) => s.trim().replace(/^\*\s*/, "")).filter(Boolean);
  }

  const disMatch = text.match(/\*\s*\*\*(?:Hadiah Terlarang|Dibenci)[^:]*:\*\*\s*([^\n\r]+)/i);
  if (disMatch) {
    gifts.disliked = disMatch[1].split(/[,•]/).map((s) => s.trim().replace(/^\*\s*/, "")).filter(Boolean);
  }

  // Format B: Sub-bullets
  if (gifts.favorite.length === 0) {
    const favBlock = text.match(/(?:Sangat Disukai|Hadiah Favorit)[\s\S]*?(?=(?:Disukai|Hadiah Biasa|Dibenci|Hadiah Terlarang|$))/i);
    if (favBlock) {
      gifts.favorite = (favBlock[0].match(/^\s*\*\s+([^\n\r]+)/gm) || [])
        .map((s) => s.replace(/^\s*\*\s+/, "").trim())
        .filter((s) => !s.startsWith("**"));
    }
  }

  if (gifts.normal.length === 0) {
    const normBlock = text.match(/(?:Disukai|Hadiah Biasa)[\s\S]*?(?=(?:Dibenci|Hadiah Terlarang|$))/i);
    if (normBlock) {
      gifts.normal = (normBlock[0].match(/^\s*\*\s+([^\n\r]+)/gm) || [])
        .map((s) => s.replace(/^\s*\*\s+/, "").trim())
        .filter((s) => !s.startsWith("**"));
    }
  }

  if (gifts.disliked.length === 0) {
    const disBlock = text.match(/(?:Dibenci|Hadiah Terlarang)[\s\S]*?$/i);
    if (disBlock) {
      gifts.disliked = (disBlock[0].match(/^\s*\*\s+([^\n\r]+)/gm) || [])
        .map((s) => s.replace(/^\s*\*\s+/, "").trim())
        .filter((s) => !s.startsWith("**"));
    }
  }

  return gifts;
}

function parseDateSpots(text) {
  if (!text) return [];
  const spots = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    const numbered = trimmed.match(/^[0-9]+\.\s*\*\*?([^*]+)\*\*?:?\s*(.*)$/);
    if (numbered) {
      const spotName = numbered[1].trim();
      const spotDesc = numbered[2].trim();
      spots.push(spotDesc ? `${spotName} — ${spotDesc}` : spotName);
      continue;
    }
    const bullet = trimmed.match(/^\*\s*\*\*?([^*]+)\*\*?:?\s*(.*)$/);
    if (bullet && !trimmed.toLowerCase().includes("lokasi kencan")) {
      const spotName = bullet[1].trim();
      const spotDesc = bullet[2].trim();
      spots.push(spotDesc ? `${spotName} — ${spotDesc}` : spotName);
    }
  }
  return spots.slice(0, 5);
}

function parsePersonalitySection(text) {
  const result = {
    traits: "",
    flaws: "",
    dere_pattern: ""
  };
  if (!text) return result;

  const traitsMatch = text.match(/###\s*(?:1\.\s*)?Karakter Dasar[^\n\r]*\r?\n([\s\S]*?)(?=(?:\r?\n###|$))/i);
  if (traitsMatch) result.traits = traitsMatch[1].trim();

  const flawsMatch = text.match(/###\s*(?:2\.\s*)?Celah Emosional[^\n\r]*\r?\n([\s\S]*?)(?=(?:\r?\n###|$))/i);
  if (flawsMatch) result.flaws = flawsMatch[1].trim();

  const dereMatch = text.match(/###\s*(?:3\.\s*)?Pola Kasmaran[^\n\r]*\r?\n([\s\S]*?)(?=(?:\r?\n###|$))/i);
  if (dereMatch) result.dere_pattern = dereMatch[1].trim();

  return result;
}

function findSection(sections, keywords) {
  for (const [title, body] of Object.entries(sections)) {
    if (title === "tagline" || !body) continue;
    const lower = title.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      return body;
    }
  }
  return "";
}

function scanDir(dir, list = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanDir(full, list);
    } else if (
      ent.isFile() &&
      ent.name.endsWith(".md") &&
      !ent.name.startsWith("_") &&
      !ent.name.includes("TEMPLATE") &&
      !ent.name.includes("PROMPTS") &&
      !ent.name.includes("COMPENDIUM")
    ) {
      list.push({ filePath: full, dirPath: dir, fileName: ent.name });
    }
  }
  return list;
}

function getLocalPortraitImage(dirPath, slug) {
  if (!fs.existsSync(dirPath)) return null;
  const files = fs.readdirSync(dirPath).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
  const candidate = files.find((f) => /portrait|avatar|uniform/i.test(f)) || files[0];
  if (candidate) {
    return `/portraits/${slug}.png`;
  }
  return null;
}

export function buildLoveInterests() {
  const files = scanDir(TARGET_DIR);
  console.log(`Ditemukan ${files.length} berkas markdown Love Interest.`);

  // Make sure public/portraits exists
  if (!fs.existsSync("public/portraits")) {
    fs.mkdirSync("public/portraits", { recursive: true });
  }

  const records = [];

  for (const item of files) {
    const parsed = parseMarkdownCharacter(item.filePath);
    if (!parsed.valid) {
      console.warn(`  ⚠️ Skip invalid file: ${item.fileName}`);
      continue;
    }

    const meta = parsed.metadata;
    const sections = parsed.sections;

    let fullName = meta.name || "";
    let furigana = "";
    const jpMatch = fullName.match(/\(([^)]+)\)/);
    if (jpMatch) {
      furigana = jpMatch[1].trim();
    }

    const slug = meta.id;

    // Copy portrait to public/portraits if present
    const dirFiles = fs.readdirSync(item.dirPath).filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f));
    const portraitFile =
      dirFiles.find((f) => /portrait|avatar|uniform/i.test(f) && !/ceremony|speech|reverie|scene/i.test(f)) ||
      dirFiles.find((f) => !/ceremony|speech|reverie|scene/i.test(f));

    let avatarUrl = "";
    if (portraitFile) {
      const srcPath = path.join(item.dirPath, portraitFile);
      const destPath = path.join("public/portraits", `${slug}.png`);
      fs.copyFileSync(srcPath, destPath);
      avatarUrl = `/portraits/${slug}.png`;
    } else {
      avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(slug)}`;
    }

    const personalityText = findSection(sections, ["Kepribadian", "Pola Emosional"]);
    const personality = parsePersonalitySection(personalityText);

    const romanceText = findSection(sections, ["Panduan Mekanik", "Romansa", "Sistem Romansa"]);
    const giftsText = findSection(sections, ["Hadiah", "Gift"]);
    const dateSpotsText = findSection(sections, ["Lokasi Kencan", "Dating Spots"]);

    const heartMilestones = parseHeartMilestones(romanceText);
    const gifts = parseGifts(giftsText || romanceText);
    const dateSpots = parseDateSpots(dateSpotsText || romanceText);

    const appearanceText = findSection(sections, ["Penampilan Fisik", "Gaya Visual"]);

    records.push({
      id: `li_${slug}`,
      slug,
      name: fullName,
      furigana,
      nickname: meta.nickname || [],
      tagline: sections.tagline || "",
      grade: meta.grade || 10,
      class_room: meta.class_room || "",
      category_id: mapClassRoomToCategory(meta),
      role: meta.role || "Love Interest",
      club: meta.ekskul || "",
      club_role: meta.club_role || "",
      archetype: meta.archetype || "",
      social_class: meta.social_class || "middle_class",
      age: meta.age || 16,
      birthday: meta.birthday || "",
      zodiac: meta.zodiac || "",
      mbti: meta.mbti || "",
      gender: meta.gender || "Female",
      avatar_url: avatarUrl,
      stats: meta.stats || {},
      vitals: meta.vitals || {},
      likes: meta.likes || [],
      dislikes: meta.dislikes || [],
      personality,
      appearance: appearanceText,
      heart_meter: {
        base: parseInt(String(meta.heart_meter?.base || 1).replace(/[^\d].*$/, "").trim(), 10) || 1,
        confession_target_dc: parseInt(String(meta.heart_meter?.confession_target_dc || 15).replace(/[^\d].*$/, "").trim(), 10) || 15,
        milestones: heartMilestones
      },
      gifts,
      date_spots: dateSpots
    });

    console.log(`  ✓ Diproses: ${slug} (${fullName}) — ${heartMilestones.length} milestones, ${dateSpots.length} date spots`);
  }

  // Sort by class / grade then name
  records.sort((a, b) => {
    if (a.grade !== b.grade) return a.grade - b.grade;
    return a.name.localeCompare(b.name);
  });

  const tsFileContent = `// Auto-generated via scripts/buildLoveInterests.js — DO NOT EDIT DIRECTLY

export interface HeartMilestone {
  range: string;
  minHearts: number;
  maxHearts: number;
  title: string;
  description: string;
}

export interface LoveInterestGifts {
  favorite: string[];
  normal: string[];
  disliked: string[];
}

export interface LoveInterestPersonality {
  traits: string;
  flaws: string;
  dere_pattern: string;
}

export interface LoveInterestDefinition {
  id: string;
  slug: string;
  name: string;
  furigana: string;
  nickname: string[];
  tagline: string;
  grade: number | string;
  class_room: string;
  category_id: string;
  role: string;
  club: string;
  club_role: string;
  archetype: string;
  social_class: string;
  age: number;
  birthday: string;
  zodiac: string;
  mbti: string;
  gender: string;
  avatar_url: string;
  stats: Record<string, number>;
  vitals: Record<string, number>;
  likes: string[];
  dislikes: string[];
  personality: LoveInterestPersonality;
  appearance: string;
  heart_meter: {
    base: number;
    confession_target_dc: number;
    milestones: HeartMilestone[];
  };
  gifts: LoveInterestGifts;
  date_spots: string[];
}

export const CANON_LOVE_INTERESTS: LoveInterestDefinition[] = ${JSON.stringify(records, null, 2)};

export function getAllLoveInterests(): LoveInterestDefinition[] {
  return CANON_LOVE_INTERESTS;
}

export function getLoveInterestBySlug(slug: string): LoveInterestDefinition | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return CANON_LOVE_INTERESTS.find((li) => li.slug.toLowerCase() === clean || li.id.toLowerCase() === clean);
}

export function findLoveInterestByName(query: string): LoveInterestDefinition | undefined {
  if (!query) return undefined;
  const q = query.toLowerCase().trim();

  // 1. Direct slug or id exact match
  const bySlug = CANON_LOVE_INTERESTS.find(
    (li) => li.slug.toLowerCase() === q || li.id.toLowerCase() === q
  );
  if (bySlug) return bySlug;

  // 2. Exact name match (or contains)
  const byExact = CANON_LOVE_INTERESTS.find(
    (li) => li.name.toLowerCase() === q || li.name.toLowerCase().startsWith(q) || q.startsWith(li.name.toLowerCase())
  );
  if (byExact) return byExact;

  // 3. Name contains query or query contains romaji part of name
  const byPart = CANON_LOVE_INTERESTS.find((li) => {
    const rawRomaji = li.name.replace(/\\([^)]+\\)/, "").trim().toLowerCase();
    const cleanNicknames = (li.nickname || []).map((n) => n.toLowerCase());
    return (
      rawRomaji.includes(q) ||
      q.includes(rawRomaji) ||
      cleanNicknames.some((nick) => nick.includes(q) || q.includes(nick)) ||
      li.furigana.toLowerCase().includes(q)
    );
  });
  if (byPart) return byPart;

  return undefined;
}

export function getCurrentMilestone(li: LoveInterestDefinition, hearts: number): HeartMilestone | undefined {
  const h = Math.max(1, Math.min(10, hearts || 1));
  const milestones = li.heart_meter?.milestones || [];
  return milestones.find((m) => h >= m.minHearts && h <= m.maxHearts) || milestones[milestones.length - 1];
}
`;

  fs.writeFileSync(OUTPUT_FILE, tsFileContent, "utf-8");
  console.log(`\n✓ Berhasil menghasilkan: ${OUTPUT_FILE} (${records.length} Love Interests)`);
}

// CLI runner
if (process.argv[1] && process.argv[1].endsWith("buildLoveInterests.js")) {
  buildLoveInterests();
}
