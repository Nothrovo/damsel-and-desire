import fs from "fs";
import path from "path";
import { parseMarkdownCharacter } from "./validateCodex.js";

const NEW_NPC_FILES = [
  "Characters/Love Interests/Class 11-2/Setsuna/KISARAGI SETSUNA (如月 刹那).md",
  "Characters/Love Interests/Faculty/Kaede/SAIONJI KAEDE (西園寺 楓).md",
  "Characters/Love Interests/Faculty/Mei/SHIRANUI MEI (不知火 芽衣).md",
  "Characters/Love Interests/Faculty/Fumiko/TSUKISHIMA FUMIKO (月島 文子).md",
  "Characters/Love Interests/Class 12-1/Rin/TACHIBANA RIN (橘 凛).md",
  "Characters/Love Interests/Class 12-1/Koharu/SAEGUSA KOHARU (三枝 小春).md",
  "Characters/Love Interests/Class 12-2/Hinata/WAKABA HINATA (若葉 日向).md"
];

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
  const avatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(meta.id)}`;

  const identityContent = {
    name: fullName,
    furigana,
    nickname: meta.nickname || [],
    tagline: sections.tagline || "",
    grade: meta.grade || 10,
    class_room: meta.class_room || "",
    role: meta.role || "Murid",
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

  const appSecs = findSectionsByKeyword(sections, ["Penampilan Fisik"]);
  const appearanceMarkdown = appSecs.map((s) => s.body).join("\n\n");
  const appearanceContent = {
    avatar_url: avatarUrl,
    images: [],
    raw_markdown: appearanceMarkdown
  };

  const persSecs = findSectionsByKeyword(sections, ["Kepribadian"]);
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

const payloads = NEW_NPC_FILES.map((fp, idx) => {
  const parsed = parseMarkdownCharacter(fp);
  if (!parsed.valid) {
    throw new Error(`Invalid markdown ${fp}: ${parsed.errors.join(", ")}`);
  }
  return buildPayload(parsed, 20 + idx);
});

// 1. Write src/data/canonSession1Npcs.ts
const tsContent = `// Auto-generated from Characters/Love Interests markdown files via scripts/syncCanonNpcs.js
export const CANON_SESSION1_NPCS = ${JSON.stringify(payloads, null, 2)} as const;
`;
fs.writeFileSync("src/data/canonSession1Npcs.ts", tsContent, "utf-8");
console.log("✓ Generated src/data/canonSession1Npcs.ts");

// 2. Write supabase/migrations/20261009000002_seed_session1_canon_npcs.sql
function sqlEscapeJson(obj) {
  return JSON.stringify(obj).replace(/'/g, "''");
}

let sqlLines = [
  "-- ============================================================================",
  "-- Migration: 20261009000002_seed_session1_canon_npcs.sql",
  "-- Description: Seed 7 Canon NPCs / Love Interests for Session 1 (April Events)",
  "-- ============================================================================",
  "",
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

  // Also reveal identity & appearance (Tier 1) by default for Session 1 Key NPCs so players can see them in Codex!
  sqlLines.push(`  INSERT INTO public.codex_reveals (character_id, section_key, revealed_by)
  VALUES (v_char_id, 'identity', 'SYSTEM_SEED'), (v_char_id, 'appearance', 'SYSTEM_SEED')
  ON CONFLICT (character_id, section_key) DO NOTHING;
`);
}

sqlLines.push("END $$;", "");
fs.writeFileSync(
  "supabase/migrations/20261009000002_seed_session1_canon_npcs.sql",
  sqlLines.join("\n"),
  "utf-8"
);
console.log("✓ Generated supabase/migrations/20261009000002_seed_session1_canon_npcs.sql");
