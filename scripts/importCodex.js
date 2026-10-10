import fs from "fs";
import path from "path";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { parseMarkdownCharacter } from "./validateCodex.js";

// Load environment from .env or .env.local if present
function loadEnv() {
  const envFiles = [".env.local", ".env"];
  for (const f of envFiles) {
    if (fs.existsSync(f)) {
      const lines = fs.readFileSync(f, "utf-8").split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const eqIdx = trimmed.indexOf("=");
        if (eqIdx !== -1) {
          const key = trimmed.slice(0, eqIdx).trim();
          const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://oavkhnjigdqacvqfkzpf.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_M_ZCTbtu0UYlfiAyLON_2Q_jYWHAiPI";

function mapClassRoomToCategory(meta) {
  const gradeStr = String(meta?.grade || "").toLowerCase();
  const cr = String(meta?.class_room || "").toLowerCase();
  if (gradeStr.includes("faculty") || cr.includes("faculty") || cr.includes("guru") || cr.includes("staf") || cr.includes("kepala sekolah") || cr.includes("principal") || cr.includes("uks") || cr.includes("perpustakaan")) {
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

function getObfuscatedAssetPath(slug, fileName) {
  const ext = (fileName.split(".").pop() || "png").toLowerCase();
  const hash = crypto.createHash("sha256").update(`codex_asset:${slug}:${fileName}`).digest("hex").slice(0, 32);
  return `portraits/asset_${hash}.${ext}`;
}

function findSectionsByKeyword(sections, keywords) {
  const results = [];
  for (const [title, body] of Object.entries(sections)) {
    if (title === "tagline" || !body) continue;
    const lower = title.toLowerCase();
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) {
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

async function buildCharacterPayload(parsed, dirPath, supabase, isDryRun) {
  const meta = parsed.metadata;
  const sections = parsed.sections;

  // Extract Name & Japanese
  let fullName = meta.name || "";
  let furigana = "";
  const jpMatch = fullName.match(/\(([^)]+)\)/);
  if (jpMatch) {
    furigana = jpMatch[1];
  }

  const categoryId = mapClassRoomToCategory(meta);

  // Look for ONLY the ID Portrait image in the character folder (exclude CG scenes!)
  const images = [];
  if (fs.existsSync(dirPath)) {
    const dirFiles = fs.readdirSync(dirPath);
    // Filter out CG / Scene / Ceremony / Reverie images, keep only ID Portrait / Avatar / Uniform
    const candidateFiles = dirFiles.filter(f => {
      if (!/\.(png|jpg|jpeg|webp)$/i.test(f)) return false;
      if (/reverie|ceremony|speech|scene|\bcg\b/i.test(f)) return false;
      return true;
    });

    // Sort so explicit "Portrait" or "Avatar" or "Uniform" comes first, then take ONLY 1 ID photo
    candidateFiles.sort((a, b) => {
      const aScore = /portrait|avatar|id/i.test(a) ? 1 : 0;
      const bScore = /portrait|avatar|id/i.test(b) ? 1 : 0;
      return bScore - aScore;
    });

    const idPhotoFile = candidateFiles[0];
    if (idPhotoFile) {
      const fullPath = path.join(dirPath, idPhotoFile);
      const storagePath = getObfuscatedAssetPath(meta.id, idPhotoFile);
      let publicUrl = `${SUPABASE_URL}/storage/v1/object/public/codex-assets/${storagePath}`;

      if (!isDryRun && supabase) {
        try {
          const fileBuffer = fs.readFileSync(fullPath);
          const ext = (idPhotoFile.split(".").pop() || "png").toLowerCase();
          const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
          const { error: upErr } = await supabase.storage
            .from("codex-assets")
            .upload(storagePath, fileBuffer, { contentType, upsert: true });
          if (upErr) {
            console.warn(`  ⚠️ Gagal upload foto ${meta.id}: ${upErr.message}`);
          } else {
            const { data: urlData } = supabase.storage.from("codex-assets").getPublicUrl(storagePath);
            if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
          }
        } catch (e) {
          console.warn(`  ⚠️ Exception upload foto ${meta.id}: ${e.message}`);
        }
      }

      images.push({
        fileName: storagePath.split("/").pop(),
        url: publicUrl,
        path: publicUrl,
        type: "portrait"
      });
    }
  }

  const avatarUrl = images[0]?.url || "";

  // 1. Identity Section (Tier 1)
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

  // 2. Appearance Section (Tier 1)
  const appSecs = findSectionsByKeyword(sections, ["Penampilan Fisik"]);
  const appearanceMarkdown = appSecs.map(s => s.body).join("\n\n");
  const appearanceContent = {
    avatar_url: avatarUrl,
    images,
    raw_markdown: appearanceMarkdown
  };

  // Parse Personality H2 & its H3 subsections
  const persSecs = findSectionsByKeyword(sections, ["Kepribadian"]);
  const fullPersonalityMd = persSecs.map(s => s.body).join("\n\n");
  const persH3 = extractH3Subsections(fullPersonalityMd);

  // 3. Personality Section (Tier 2)
  const personalityContent = {
    likes: meta.likes || [],
    dislikes: meta.dislikes || [],
    raw_markdown: fullPersonalityMd
  };

  // 4. Background Section (Tier 2): Backstory + Kehidupan Klub / Sekolah / Wilayah Kekuasaan
  const bgSecs = findSectionsByKeyword(sections, ["Latar Belakang", "Backstory", "Kehidupan Klub", "Kehidupan Sekolah", "Wilayah Kekuasaan"]);
  const backgroundMarkdown = bgSecs
    .map((s, idx) => (idx === 0 ? s.body : `### ${s.title}\n\n${s.body}`))
    .join("\n\n");
  const backgroundContent = {
    raw_markdown: backgroundMarkdown
  };

  // 5. Relationships Section (Tier 2): Jaringan Relasi + Dialog Khas + Lokasi Kencan + Preferensi Hadiah
  const relSecs = findSectionsByKeyword(sections, ["Jaringan Relasi", "Relationships", "Dialog Khas", "Lokasi Kencan", "Preferensi Hadiah"]);
  let relationshipsMarkdown = relSecs
    .map((s, idx) => (idx === 0 && s.title.includes("Relasi") ? s.body : `### ${s.title}\n\n${s.body}`))
    .join("\n\n");

  const relationshipsContent = {
    raw_markdown: relationshipsMarkdown
  };

  // 6. Mind Section (Tier 3): Celah Emosional / Sisi Tersembunyi + Pola Kasmaran + Sistem/Panduan Romansa
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

  // 7. Secrets Section (Tier 3): Rahasia Terdalam + Trivia & Fakta Unik/Menarik + Celah Emosional
  const secretParts = [];
  const explicitSecretSecs = findSectionsByKeyword(sections, ["Rahasia"]);
  for (const sSec of explicitSecretSecs) {
    secretParts.push(sSec.body);
  }
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

  // 8. DM Notes (Tier 99)
  const dmNotesParts = [
    `Pola & Tag Karakter: ${(meta.tags || []).join(", ") || "-"}`,
    `Confession Target DC: ${meta.heart_meter?.confession_target_dc || 17} (Base Heart: ${meta.heart_meter?.base || 1} ♥)`,
    `Primary Stats: ${(meta.primary_stats || []).join(", ")} | Hit Die: ${meta.hit_die || "d6"}`
  ];
  if (romanceSecs.length > 0) {
    dmNotesParts.push(`\n--- PANDUAN ROMANSA & EVENT ---\n${romanceSecs.map(s => s.body).join("\n\n")}`);
  }
  const dmNotesContent = {
    notes: dmNotesParts.join("\n")
  };

  return {
    slug: meta.id,
    categoryId: categoryId,
    sortOrder: meta.sort_order || 10,
    visibilityMode: "placeholder",
    homeRoomId: meta.home_room_id || null,
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

async function main() {
  const customDirArg = process.argv.slice(2).find(a => !a.startsWith("--"));
  const targetDir = customDirArg || "Characters/Love Interests";
  const isDryRun = process.argv.includes("--dry-run");
  const passArg = process.argv.find(a => a.startsWith("--password="))?.split("=")[1];
  const dmPassword = passArg || process.env.DM_PASSWORD || "";

  console.log(`\n======================================================`);
  console.log(`📦 Damsel & Desire — Character Codex Importer`);
  console.log(`======================================================`);
  console.log(`Target Direktori : ${targetDir}`);
  console.log(`Mode Operasi     : ${isDryRun ? "DRY RUN (Simulasi)" : "LIVE UPSERT ke Supabase"}`);
  console.log(`Supabase URL     : ${SUPABASE_URL}`);

  if (!fs.existsSync(targetDir)) {
    console.error(`Error: Direktori ${targetDir} tidak ditemukan.`);
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let sessionToken = "";
  if (!isDryRun && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    if (!dmPassword) {
      console.error("Error: Sertakan --password=<kata_sandi_dm> atau set DM_PASSWORD / SUPABASE_SERVICE_ROLE_KEY di .env.local");
      process.exit(1);
    }
    const { data: loginData, error: loginErr } = await supabase.rpc("dm_login", {
      p_password: dmPassword
    });
    if (loginErr || !loginData?.success) {
      console.error("Gagal autentikasi DM ke Supabase:", loginErr?.message || loginData?.error || "Unknown error");
      process.exit(1);
    }
    sessionToken = loginData.session_token;
    console.log("✓ Autentikasi sesi DM berhasil.");
  }

  const characterFiles = [];
  function scan(dir) {
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of list) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        scan(full);
      } else if (ent.isFile() && ent.name.endsWith(".md") && !ent.name.startsWith("_") && !ent.name.includes("TEMPLATE") && !ent.name.includes("PROMPTS") && !ent.name.includes("COMPENDIUM")) {
        characterFiles.push({ filePath: full, dirPath: dir, fileName: ent.name });
      }
    }
  }

  scan(targetDir);
  console.log(`Ditemukan ${characterFiles.length} berkas karakter markdown.\n`);

  let successCount = 0;
  for (const item of characterFiles) {
    const parsed = parseMarkdownCharacter(item.filePath);
    if (!parsed.valid) {
      console.warn(`  ⚠️ Skip invalid file: ${item.fileName} (${parsed.errors.join(", ")})`);
      continue;
    }

    const payload = await buildCharacterPayload(parsed, item.dirPath, supabase, isDryRun);

    if (isDryRun) {
      console.log(`  [DRY-RUN] Siap import: ${payload.slug} (${payload.categoryId}) | Foto: ${payload.sections[1].content.avatar_url ? "ADA" : "KOSONG"}`);
      successCount++;
    } else {
      try {
        const { data, error } = await supabase.rpc("dm_upsert_character", {
          p_session_token: sessionToken,
          p_payload: payload
        });

        if (error) {
          console.error(`  ✗ Gagal upsert ${payload.slug}:`, error.message);
        } else {
          console.log(`  ✓ Berhasil upsert: ${payload.slug} -> Kategori: ${payload.categoryId} | Foto ID: ${payload.sections[1].content.avatar_url ? " Uploaded" : "None"}`);
          successCount++;
        }
      } catch (err) {
        console.error(`  ✗ Exception ${payload.slug}:`, err.message);
      }
    }
  }

  console.log(`\nSelesai! Berhasil memproses ${successCount}/${characterFiles.length} karakter.\n`);
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
