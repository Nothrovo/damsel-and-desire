import fs from "fs";
import path from "path";
import { parseMarkdownCharacter } from "./validateCodex.js";

const TARGET_DIR = "Characters/Love Interests";

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
      !ent.name.toLowerCase().includes("prompt") &&
      !ent.name.includes("COMPENDIUM")
    ) {
      list.push({ filePath: full, dirPath: dir, fileName: ent.name });
    }
  }
  return list;
}

function mapClassRoomToCategory(meta) {
  if (meta?.category_id) return meta.category_id;
  if (meta?.faction) return meta.faction;
  const gradeStr = String(meta?.grade || "").toLowerCase();
  const cr = String(meta?.class_room || "").toLowerCase();
  const roleStr = String(meta?.role || "").toLowerCase();
  const clubStr = String(meta?.ekskul || meta?.club || "").toLowerCase();

  if (cr.includes("touki") || roleStr.includes("touki")) return "touki";
  if (cr.includes("kokuhou") || roleStr.includes("kokuhou")) return "kokuhou";
  if (clubStr === "student_council" || roleStr.includes("osis") || roleStr.includes("komite disiplin")) return "osis";

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
  if (cr.includes("alumni") || cr.includes("outside")) return "outside_school";
  return "other";
}

function findSectionsByKeyword(sections, keywords) {
  const results = [];
  for (const [title, body] of Object.entries(sections)) {
    if (title === "tagline" || !body) continue;
    const lower = title.toLowerCase();
    if (keywords.some((kw) => lower.includes(kw.toLowerCase()))) {
      results.push({ title, body: String(body).trim() });
    }
  }
  return results;
}

function extractH3Subsections(markdownText) {
  const subs = {};
  if (!markdownText) return subs;
  const regex = /(?:^|\r?\n)###(?!#)\s+([^\n\r]+)\r?\n([\s\S]*?)(?=(?:\r?\n###(?!#)\s+|$))/g;
  let m;
  while ((m = regex.exec(markdownText)) !== null) {
    subs[m[1].trim()] = m[2].trim();
  }
  return subs;
}

function buildPayload(parsed, sortOrder) {
  const meta = parsed.metadata;
  const sections = parsed.sections;

  let fullName = meta.name || "";
  let furigana = "";
  const jpMatch = fullName.match(/\(([^)]+)\)/);
  if (jpMatch) {
    furigana = jpMatch[1];
  }

  const categoryId = mapClassRoomToCategory(meta);
  const portraitExists = fs.existsSync(`public/portraits/${meta.id}.png`);
  const avatarUrl = portraitExists
    ? `/portraits/${meta.id}.png`
    : `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(meta.id)}`;

  const identityContent = {
    name: fullName,
    furigana,
    nickname: meta.nickname || [],
    tagline: sections.tagline || "",
    grade: meta.grade || 10,
    class_room: meta.class_room || "",
    role: (meta.role || "Siswa Housen Academy").replace(/^Love Interest\s*\/\s*(?:Target Asmara\s*)?/i, "").trim() || "Siswa Housen Academy",
    club: meta.ekskul || "",
    club_role: meta.club_role || "Anggota",
    age: meta.age || 16,
    birthday: meta.birthday || "",
    zodiac: meta.zodiac || "",
    mbti: meta.mbti || "",
    gender: meta.gender || "Female",
    archetype: meta.archetype || "",
    social_class: meta.social_class || "middle_class",
    primary_stats: meta.primary_stats || [],
    stats: meta.stats || {},
    vitals: meta.vitals || {}
  };

  const appSecs = findSectionsByKeyword(sections, ["Penampilan Fisik", "Gaya Visual"]);
  const appearanceMarkdown = appSecs.map((s) => s.body).join("\n\n");
  const appearanceContent = {
    avatar_url: avatarUrl,
    images: [],
    raw_markdown: appearanceMarkdown
  };

  const persSecs = findSectionsByKeyword(sections, ["Kepribadian", "Pola Emosional"]);
  const fullPersonalityMd = persSecs.map((s) => s.body).join("\n\n");
  const persH3 = extractH3Subsections(fullPersonalityMd);

  const personalityContent = {
    likes: meta.likes || [],
    dislikes: meta.dislikes || [],
    raw_markdown: fullPersonalityMd
  };

  const bgSecs = findSectionsByKeyword(sections, [
    "Latar Belakang",
    "Backstory",
    "Kehidupan Klub",
    "Kehidupan Sekolah"
  ]);
  const backgroundMarkdown = bgSecs
    .map((s, idx) => (idx === 0 ? s.body : `### ${s.title}\n\n${s.body}`))
    .join("\n\n");
  const backgroundContent = {
    raw_markdown: backgroundMarkdown
  };

  const relSecs = findSectionsByKeyword(sections, [
    "Jaringan Relasi",
    "Relationships",
    "Hubungan Sosial",
    "Dialog Khas",
    "Lokasi Kencan",
    "Preferensi Hadiah"
  ]);
  const relationshipsMarkdown = relSecs
    .map((s, idx) => (idx === 0 && s.title.includes("Relasi") ? s.body : `### ${s.title}\n\n${s.body}`))
    .join("\n\n");
  const relationshipsContent = {
    raw_markdown: relationshipsMarkdown
  };

  const mindParts = [];
  for (const [h3Title, h3Body] of Object.entries(persH3)) {
    if (/celah|kelemahan|sisi tersembunyi|kasmaran|love language/i.test(h3Title)) {
      mindParts.push(`### ${h3Title}\n\n${h3Body}`);
    }
  }
  const romanceSecs = findSectionsByKeyword(sections, ["Sistem Romansa", "Panduan Mekanik & Romansa"]);
  for (const rSec of romanceSecs) {
    mindParts.push(`### ${rSec.title}\n\n${rSec.body}`);
  }
  const mindContent = {
    heart_meter: meta.heart_meter || {},
    confession_dc: meta.heart_meter?.confession_target_dc || 17,
    heart_meter_base: meta.heart_meter?.base || 1,
    raw_markdown: mindParts.join("\n\n") || fullPersonalityMd
  };

  const secretParts = [];
  for (const [h3Title, h3Body] of Object.entries(persH3)) {
    if (/celah|kelemahan|sisi tersembunyi/i.test(h3Title)) {
      secretParts.push(`### ${h3Title}\n\n${h3Body}`);
    }
  }
  const triviaSecs = findSectionsByKeyword(sections, ["Trivia"]);
  for (const tSec of triviaSecs) {
    secretParts.push(`### ${tSec.title}\n\n${tSec.body}`);
  }
  const secretsContent = {
    raw_markdown: secretParts.join("\n\n")
  };

  const dmNotesParts = [
    `Pola & Tag Karakter: ${(meta.tags || []).join(", ") || "-"}`,
    `Confession Target DC: ${meta.heart_meter?.confession_target_dc || 17} (Base Heart: ${meta.heart_meter?.base || 1} ♥)`,
    `Primary Stats: ${(meta.primary_stats || []).join(", ")} | Hit Die: ${meta.hit_die || "d8"}`
  ];
  if (romanceSecs.length > 0) {
    dmNotesParts.push(`\n--- PANDUAN ROMANSA & EVENT ---\n${romanceSecs.map((s) => s.body).join("\n\n")}`);
  }
  const dmNotesContent = {
    notes: dmNotesParts.join("\n")
  };

  return {
    id: `canon_${meta.id}`,
    slug: meta.id,
    categoryId,
    sortOrder,
    visibilityMode: "placeholder",
    homeRoomId: null,
    isLoveInterest: true,
    sections: [
      { sectionKey: "identity", tier: 1, content: identityContent, lockedHint: "Karakter belum diperkenalkan." },
      { sectionKey: "appearance", tier: 1, content: appearanceContent, lockedHint: "Penampilan visual belum terungkap." },
      { sectionKey: "personality", tier: 2, content: personalityContent, lockedHint: "Kenali dia lebih dekat dalam kehidupan sekolah untuk membuka informasi ini." },
      { sectionKey: "background", tier: 2, content: backgroundContent, lockedHint: "Bicaralah dengannya sepulang sekolah untuk mendengar masa lalunya." },
      { sectionKey: "relationships", tier: 2, content: relationshipsContent, lockedHint: "Hubungan sosial dan interaksinya akan terbuka saat lingkaran pertemanannya dikenali." },
      { sectionKey: "mind", tier: 3, content: mindContent, lockedHint: "Hanya terbuka bagi mereka yang telah meraih ikatan hati terdalam." },
      { sectionKey: "secrets", tier: 3, content: secretsContent, lockedHint: "Hanya terbuka saat kepercayaan mutlak telah terbentuk." },
      { sectionKey: "dm_notes", tier: 99, content: dmNotesContent, lockedHint: "Hanya untuk Game Master." }
    ]
  };
}

const allFiles = scanDir(TARGET_DIR);
console.log(`Ditemukan ${allFiles.length} file karakter untuk disinkronkan.`);

const payloads = allFiles.map((fileObj, idx) => {
  const parsed = parseMarkdownCharacter(fileObj.filePath);
  if (!parsed.valid) {
    throw new Error(`Invalid markdown ${fileObj.filePath}: ${parsed.errors.join(", ")}`);
  }
  return buildPayload(parsed, 10 + idx);
});

// 1. Write src/data/canonSession1Npcs.ts
const tsContent = `// Auto-generated from Characters/Love Interests markdown files via scripts/syncCanonNpcs.js
export const CANON_SESSION1_NPCS = ${JSON.stringify(payloads, null, 2)} as const;
`;
fs.writeFileSync("src/data/canonSession1Npcs.ts", tsContent, "utf-8");
console.log(`✓ Generated src/data/canonSession1Npcs.ts (${payloads.length} characters)`);

// 2. Write supabase/migrations/20261015000001_seed_all_canon_npcs_and_factions.sql
function sqlEscapeJson(obj) {
  return JSON.stringify(obj).replace(/'/g, "''");
}

let sqlLines = [
  "-- ============================================================================",
  "-- Migration: 20261015000001_seed_all_canon_npcs_and_factions.sql",
  "-- Description: Official Factions (OSIS, Kokuhou, Touki), Categories & 47 Canon NPCs Seed",
  "-- ============================================================================",
  "",
  "-- 1. Seed Official Codex Categories",
  "INSERT INTO public.codex_categories (id, name, description, sort_order, show_totals, default_visibility_mode) VALUES",
  "  ('osis', 'Presidium OSIS & Komite Disiplin', 'Jajaran pimpinan dewan siswa dan penegak ketertiban akademi', 1, false, 'placeholder'),",
  "  ('kokuhou', 'Geng Berandal Kokuhou (黒鳳)', 'Aliansi berandal pelindung belakang sekolah dan wilayah Housen', 2, false, 'placeholder'),",
  "  ('touki', 'SMA Kejuruan Touki (東鬼高校)', 'Geng berandal bengis kawasan pelabuhan dermaga industri', 3, false, 'placeholder'),",
  "  ('class_1_1', 'Kelas 10-1', 'Siswa-siswi tahun pertama kelas 10-1 (Grade 10)', 4, false, 'placeholder'),",
  "  ('class_1_2', 'Kelas 10-2', 'Siswa-siswi tahun pertama kelas 10-2 (Grade 10)', 5, false, 'placeholder'),",
  "  ('class_2_1', 'Kelas 11-1', 'Siswa-siswi tahun kedua kelas 11-1 (Grade 11)', 6, false, 'placeholder'),",
  "  ('class_2_2', 'Kelas 11-2', 'Siswa-siswi tahun kedua kelas 11-2 (Grade 11)', 7, false, 'placeholder'),",
  "  ('class_3_1', 'Kelas 12-1', 'Siswa-siswi tahun ketiga kelas 12-1 (Grade 12 / Senior)', 8, false, 'placeholder'),",
  "  ('class_3_2', 'Kelas 12-2', 'Siswa-siswi tahun ketiga kelas 12-2 (Grade 12 / Senior)', 9, false, 'placeholder'),",
  "  ('faculty', 'Guru & Staf Sekolah', 'Pengajar, staf konseling, kepala sekolah, dan staf keamanan/medis', 10, false, 'placeholder'),",
  "  ('clubs', 'Klub Ekstrakurikuler', 'Tokoh penting dan faksi 16 klub ekskul', 11, false, 'placeholder'),",
  "  ('outside_school', 'Di Luar Sekolah & Alumni', 'Alumni legendaris, keluarga, dan tokoh luar sekolah', 12, false, 'placeholder'),",
  "  ('other', 'Lainnya', 'Karakter pendukung lainnya', 13, false, 'placeholder')",
  "ON CONFLICT (id) DO UPDATE SET",
  "  name = EXCLUDED.name,",
  "  description = EXCLUDED.description,",
  "  sort_order = EXCLUDED.sort_order,",
  "  default_visibility_mode = EXCLUDED.default_visibility_mode;",
  "",
  "-- Migrate any remaining legacy love_interest characters before removing the category",
  "UPDATE public.codex_characters SET category_id = 'class_1_1' WHERE category_id = 'love_interest';",
  "DELETE FROM public.codex_categories WHERE id = 'love_interest';",
  "",
  "-- 2. Seed All 47 Canon NPCs and Sections",
  "DO $$",
  "DECLARE",
  "  v_char_id UUID;",
  "BEGIN"
];

for (const p of payloads) {
  sqlLines.push(`
  -- Character: ${p.slug} (${p.categoryId})
  INSERT INTO public.codex_characters (slug, category_id, sort_order, visibility_mode, is_love_interest, updated_at)
  VALUES ('${p.slug}', '${p.categoryId}', ${p.sortOrder}, '${p.visibilityMode}', true, now())
  ON CONFLICT (slug) DO UPDATE SET
    category_id = EXCLUDED.category_id,
    sort_order = EXCLUDED.sort_order,
    is_love_interest = EXCLUDED.is_love_interest,
    updated_at = now()
  RETURNING id INTO v_char_id;
`);

  for (const sec of p.sections) {
    const escapedContent = sqlEscapeJson(sec.content);
    const escapedHint = String(sec.lockedHint || "").replace(/'/g, "''");
    sqlLines.push(`  INSERT INTO public.codex_character_sections (character_id, section_key, tier, content, locked_hint, updated_at)
  VALUES (v_char_id, '${sec.sectionKey}', ${sec.tier}, '${escapedContent}'::jsonb, '${escapedHint}', now())
  ON CONFLICT (character_id, section_key) DO UPDATE SET
    tier = EXCLUDED.tier,
    content = EXCLUDED.content,
    locked_hint = EXCLUDED.locked_hint,
    updated_at = now();
`);
  }

  // Reveal identity & appearance (Tier 1) by default so players can see characters in Codex!
  sqlLines.push(`  INSERT INTO public.codex_reveals (character_id, section_key, revealed_by)
  VALUES (v_char_id, 'identity', 'SYSTEM_SEED'), (v_char_id, 'appearance', 'SYSTEM_SEED')
  ON CONFLICT (character_id, section_key) DO NOTHING;
`);
}

sqlLines.push("END $$;", "");
const migrationPath = "supabase/migrations/20261015000001_seed_all_canon_npcs_and_factions.sql";
fs.writeFileSync(migrationPath, sqlLines.join("\n"), "utf-8");
console.log(`✓ Generated ${migrationPath}`);
