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
  if (gradeStr.includes("faculty") || cr.includes("faculty") || cr.includes("guru") || cr.includes("staf") || cr.includes("kepala sekolah") || cr.includes("principal")) {
    return "faculty";
  }
  if (cr.includes("11-1") || cr.includes("2-1")) return "class_2_1";
  if (cr.includes("11-2") || cr.includes("2-2")) return "class_2_2";
  if (cr.includes("12-1") || cr.includes("3-1")) return "class_3_1";
  if (cr.includes("12-2") || cr.includes("3-2")) return "class_3_2";
  if (cr.includes("10-1") || cr.includes("1-1")) return "class_1_1";
  if (cr.includes("10-2") || cr.includes("1-2")) return "class_1_2";
  return "other";
}

function getObfuscatedAssetPath(slug, fileName) {
  const ext = (fileName.split(".").pop() || "png").toLowerCase();
  const hash = crypto.createHash("sha256").update(`codex_asset:${slug}:${fileName}`).digest("hex").slice(0, 32);
  return `portraits/asset_${hash}.${ext}`;
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

  // Look for image files in the character folder
  const images = [];
  if (fs.existsSync(dirPath)) {
    const dirFiles = fs.readdirSync(dirPath);
    for (const f of dirFiles) {
      if (/\.(png|jpg|jpeg|webp)$/i.test(f)) {
        const fullPath = path.join(dirPath, f);
        const isPortrait = /portrait/i.test(f) || /id/i.test(f);
        const storagePath = getObfuscatedAssetPath(meta.id, f);
        let publicUrl = `${SUPABASE_URL}/storage/v1/object/public/codex-assets/${storagePath}`;

        if (!isDryRun && supabase) {
          try {
            const fileBuffer = fs.readFileSync(fullPath);
            const ext = (f.split(".").pop() || "png").toLowerCase();
            const contentType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : ext === "webp" ? "image/webp" : "image/png";
            const { error: upErr } = await supabase.storage
              .from("codex-assets")
              .upload(storagePath, fileBuffer, { contentType, upsert: true });
            if (!upErr) {
              const { data: urlData } = supabase.storage.from("codex-assets").getPublicUrl(storagePath);
              if (urlData?.publicUrl) publicUrl = urlData.publicUrl;
            }
          } catch (e) {
            // Keep deterministic storage URL fallback
          }
        }

        images.push({
          fileName: storagePath.split("/").pop(),
          fullPath,
          url: publicUrl,
          isPortrait
        });
      }
    }
  }

  // Find primary avatar if any
  let avatarUrl = "";
  const portraitImg = images.find(img => img.isPortrait) || images[0];
  if (portraitImg) {
    avatarUrl = portraitImg.url;
  }

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
  const appearanceContent = {
    avatar_url: avatarUrl,
    images: images.map(img => ({
      fileName: img.fileName,
      url: img.url,
      path: img.url,
      type: img.isPortrait ? "portrait" : "cg_scene"
    })),
    raw_markdown: sections["🎀 Penampilan Fisik & Gaya Visual"] || sections["🖼️ Galeri Visual Karakter"] || ""
  };

  // 3. Personality Section (Tier 2)
  const personalityContent = {
    likes: meta.likes || [],
    dislikes: meta.dislikes || [],
    raw_markdown: sections["🧠 Kepribadian & Pola Emosional"] || sections["🔍 Trivia & Fakta Unik"] || ""
  };

  // 4. Background Section (Tier 2)
  const backgroundContent = {
    raw_markdown: sections["📖 Latar Belakang (Backstory)"] || sections["🏫 Kehidupan Klub & Posisi Sekolah (Bukatsu)"] || ""
  };

  // 5. Relationships Section (Tier 2)
  const relationshipsContent = {
    raw_markdown: sections["👥 Jaringan Relasi (Relationships)"] || sections["💬 Gaya Bicara & Interaksi dengan Pemain"] || ""
  };

  // 6. Mind Section (Tier 3)
  const mindContent = {
    heart_meter: meta.heart_meter || {},
    raw_markdown: sections["💘 Mekanika Romansa (Damsel & Desire Engine)"] || ""
  };

  // 7. Secrets Section (Tier 3)
  const secretsContent = {
    raw_markdown: sections["🔒 Rahasia Terdalam"] || sections["📖 Latar Belakang (Backstory)"] || ""
  };

  // 8. DM Notes (Tier 99)
  const dmNotesContent = {
    notes: `Pola Asmara: ${meta.tags?.join(", ") || "-"}\nConfession Target DC: ${meta.heart_meter?.confession_target_dc || 17}\nLikes: ${(meta.likes || []).join(", ")}`
  };

  return {
    slug: meta.id,
    categoryId: categoryId,
    sortOrder: meta.sort_order || 10,
    visibilityMode: "placeholder", // default placeholder silhouette
    homeRoomId: meta.home_room_id || null,
    isLoveInterest: true,
    sections: [
      { sectionKey: "identity", tier: 1, content: identityContent, lockedHint: "Karakter belum diperkenalkan." },
      { sectionKey: "appearance", tier: 1, content: appearanceContent, lockedHint: "Penampilan visual belum terungkap." },
      { sectionKey: "personality", tier: 2, content: personalityContent, lockedHint: "Kenali dia lebih dekat dalam kehidupan sekolah untuk membuka informasi ini." },
      { sectionKey: "background", tier: 2, content: backgroundContent, lockedHint: "Bicaralah dengannya sepulang sekolah untuk mendengar masa lalunya." },
      { sectionKey: "relationships", tier: 2, content: relationshipsContent, lockedHint: "Hubungan sosial akan terbuka saat lingkaran pertemanannya dikenali." },
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
      console.log(`  [DRY-RUN] Siap import: ${payload.slug} (${payload.categoryId}) - ${payload.sections.length} sections`);
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
          console.log(`  ✓ Berhasil upsert: ${payload.slug} -> Kategori: ${payload.categoryId} (ID: ${data.id})`);
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
