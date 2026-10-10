import { supabase } from "./supabase";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmListAll, dmGetCharacter, fetchCodexList, fetchCodexCharacter, resolvePortraitUrl } from "./codex";
import {
  CANON_LOVE_INTERESTS,
  getAllLoveInterests,
  getLoveInterestBySlug,
  findLoveInterestByName,
  getCurrentMilestone,
  type LoveInterestDefinition,
  type HeartMilestone,
  type LoveInterestGifts,
  type LoveInterestPersonality
} from "../data/loveInterestCompendium";
import type { TargetSecret } from "../types";

let cachedDynamicLoveInterests: LoveInterestDefinition[] | null = null;

/**
 * Normalisasi data karakter dari Supabase menjadi struktur LoveInterestDefinition.
 * Ini memastikan jika DM menambahkan heroine baru di database (via Codex / DM Tools),
 * karakter tersebut langsung dikenali oleh sistem Affection tanpa perlu koding ulang.
 */
function normalizeDbToLoveInterest(dbChar: any): LoveInterestDefinition {
  const slug = dbChar.slug || dbChar.id || `custom_${Date.now()}`;
  const identity = dbChar.sections?.find?.((s: any) => s.section_key === "identity" || s.sectionKey === "identity")?.content || dbChar.identity || {};
  const appearance = dbChar.sections?.find?.((s: any) => s.section_key === "appearance" || s.sectionKey === "appearance")?.content || dbChar.appearance || {};
  const mind = dbChar.sections?.find?.((s: any) => s.section_key === "mind" || s.sectionKey === "mind")?.content || dbChar.mind || {};
  const dmNotes = dbChar.sections?.find?.((s: any) => s.section_key === "dm_notes" || s.sectionKey === "dm_notes")?.content || dbChar.dm_notes || {};

  const name = identity.name || dbChar.name || slug;
  let furigana = identity.furigana || dbChar.furigana || "";
  if (!furigana) {
    const jpMatch = String(name).match(/\(([^)]+)\)/);
    if (jpMatch) furigana = jpMatch[1].trim();
  }

  const rawMilestones = mind.heart_meter?.milestones || mind.heart_meter_progression || [];
  const milestones: HeartMilestone[] = Array.isArray(rawMilestones) && rawMilestones.length > 0
    ? rawMilestones.map((m: any) => ({
        range: m.range || `${m.minHearts || 1}–${m.maxHearts || 10} ♥`,
        minHearts: m.minHearts || 1,
        maxHearts: m.maxHearts || 10,
        title: m.title || "Tahap Hubungan",
        description: m.description || ""
      }))
    : [
        { range: "1–2 ♥", minHearts: 1, maxHearts: 2, title: "Kesan Pertama & Keakraban Awal", description: "Mulai mengenali satu sama lain dalam percakapan santai di koridor." },
        { range: "3–4 ♥", minHearts: 3, maxHearts: 4, title: "Teman Berbagi & Kepercayaan", description: "Mulai bertukar cerita rahasia dan saling mendukung sepulang sekolah." },
        { range: "5–6 ♥", minHearts: 5, maxHearts: 6, title: "Debaran Hati & Salting", description: "Perasaan cinta mulai disadari; canggung dan salah tingkah tiap kali berduaan." },
        { range: "7–8 ♥", minHearts: 7, maxHearts: 8, title: "Ikatan Kasmaran Mendalam", description: "Menjadi sosok paling berharga bagi satu sama lain; janji kencan spesial." },
        { range: "9 ♥", minHearts: 9, maxHearts: 9, title: "Di Ambang Pernyataan Cinta", description: "Momen puncak pengakuan perasaan cinta di bawah pohon sakura atau atap sekolah." },
        { range: "10 ♥", minHearts: 10, maxHearts: 10, title: "Kekasih Sejati (Canon Lovers)", description: "Resmi berpasangan; saling mempercayakan seluruh jiwa dan masa depan." }
      ];

  const gifts: LoveInterestGifts = {
    favorite: mind.gifts?.favorite || mind.gift_preferences?.favorite || ["Hadiah buatan tangan yang tulus", "Makanan manis favorit"],
    normal: mind.gifts?.normal || mind.gift_preferences?.normal || ["Minuman teh kemasan", "Alat tulis sekolah"],
    disliked: mind.gifts?.disliked || mind.gift_preferences?.disliked || ["Barang tiruan murah", "Sesuatu yang menyinggung perasaannya"]
  };

  const personality: LoveInterestPersonality = {
    traits: mind.personality?.traits || identity.tagline || dbChar.tagline || "Siswi unik Housen Academy.",
    flaws: mind.personality?.flaws || mind.flaws || "Menyimpan keraguan batin yang menunggu disembuhkan.",
    dere_pattern: mind.personality?.dere_pattern || identity.archetype || dbChar.archetype || "Manis dan perhatian saat berdua."
  };

  const avatarUrl =
    resolvePortraitUrl(appearance.avatar_url || dbChar.avatar_url, slug) ||
    `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(slug)}`;

  return {
    id: dbChar.id || `li_${slug}`,
    slug,
    name,
    furigana,
    nickname: Array.isArray(identity.nickname) ? identity.nickname : dbChar.nickname || [],
    tagline: identity.tagline || dbChar.tagline || "",
    grade: identity.grade || dbChar.grade || 10,
    class_room: identity.class_room || dbChar.class_room || "",
    category_id: dbChar.category_id || "love_interest",
    role: identity.role || dbChar.role || "Target Asmara",
    club: identity.club || dbChar.club || "",
    club_role: identity.club_role || dbChar.club_role || "",
    archetype: identity.archetype || dbChar.archetype || "Siswi Idola",
    social_class: identity.social_class || dbChar.social_class || "middle_class",
    age: identity.age || dbChar.age || 16,
    birthday: identity.birthday || dbChar.birthday || "",
    zodiac: identity.zodiac || dbChar.zodiac || "",
    mbti: identity.mbti || dbChar.mbti || "",
    gender: identity.gender || dbChar.gender || "Female",
    avatar_url: avatarUrl,
    stats: identity.stats || dbChar.stats || {},
    vitals: identity.vitals || dbChar.vitals || {},
    likes: dbChar.likes || [],
    dislikes: dbChar.dislikes || [],
    personality,
    appearance: appearance.raw_markdown || appearance.description || "",
    heart_meter: {
      base: identity.heart_meter?.base || 1,
      confession_target_dc: identity.heart_meter?.confession_target_dc || 15,
      milestones
    },
    gifts,
    date_spots: mind.date_spots || ["Atap Sekolah Saat Senja", "Kedai Minuman Dekat Stasiun", "Taman Bunga Belakang Akademi"]
  };
}

/**
 * Mengambil daftar seluruh Love Interest secara dinamis dari Supabase DB,
 * lalu menggabungkannya dengan katalog canon lokal agar tetap tangguh saat offline.
 */
export async function fetchDynamicLoveInterests(forceRefresh = false): Promise<LoveInterestDefinition[]> {
  if (!forceRefresh && cachedDynamicLoveInterests && cachedDynamicLoveInterests.length > 0) {
    return cachedDynamicLoveInterests;
  }

  // Mulai dengan basis canon yang sudah tervalidasi
  const resultMap = new Map<string, LoveInterestDefinition>();
  for (const canon of getAllLoveInterests()) {
    resultMap.set(canon.slug.toLowerCase(), canon);
  }

  try {
    // 1. Coba panggil RPC khusus list_love_interests jika ada di DB
    const { data: rpcData, error: rpcErr } = await supabase.rpc("list_love_interests");
    if (!rpcErr && Array.isArray(rpcData) && rpcData.length > 0) {
      for (const item of rpcData) {
        const norm = normalizeDbToLoveInterest(item);
        resultMap.set(norm.slug.toLowerCase(), norm);
      }
    }
  } catch {
    // Abaikan jika RPC belum di-deploy
  }

  try {
    // 2. Jika DM memiliki token aktif, gunakan dmListAll untuk mendapatkan karakter terbaru dari DB
    const dmToken = dmAuthStore.getToken();
    if (dmToken) {
      const allDmChars = await dmListAll(dmToken);
      for (const c of allDmChars) {
        if (c.is_love_interest || c.category_id === "love_interest") {
          const norm = normalizeDbToLoveInterest(c);
          resultMap.set(norm.slug.toLowerCase(), norm);
        }
      }
    } else {
      // 3. Jika sesi biasa, ambil kartu dari list_codex
      const codexList = await fetchCodexList("love_interest");
      for (const c of codexList) {
        if (!c.locked && c.slug) {
          const existing = resultMap.get(c.slug.toLowerCase());
          if (!existing) {
            // Heroine baru yang didaftarkan di Supabase!
            resultMap.set(c.slug.toLowerCase(), normalizeDbToLoveInterest(c));
          } else if (c.avatar_url) {
            existing.avatar_url = c.avatar_url;
          }
        }
      }
    }
  } catch (err) {
    console.warn("Koneksi remote DB love interests terhambat, menggunakan katalog lokal:", err);
  }

  const combined = Array.from(resultMap.values());
  // Sortir rapi berdasarkan tingkatan kelas
  combined.sort((a, b) => {
    const ga = typeof a.grade === "number" ? a.grade : 99;
    const gb = typeof b.grade === "number" ? b.grade : 99;
    if (ga !== gb) return ga - gb;
    return a.name.localeCompare(b.name);
  });

  cachedDynamicLoveInterests = combined;
  return combined;
}

/**
 * Mengambil detail lengkap suatu Love Interest secara dinamis
 */
export async function fetchDynamicLoveInterestDetail(idOrSlug: string): Promise<LoveInterestDefinition | null> {
  const all = await fetchDynamicLoveInterests();
  const found = all.find((li) => li.slug.toLowerCase() === idOrSlug.toLowerCase() || li.id.toLowerCase() === idOrSlug.toLowerCase());
  if (found) return found;

  // Coba ambil langsung dari Supabase codex
  try {
    const dmToken = dmAuthStore.getToken();
    if (dmToken) {
      const dmChar = await dmGetCharacter(dmToken, idOrSlug);
      if (dmChar) {
        return normalizeDbToLoveInterest(dmChar);
      }
    } else {
      const publicChar = await fetchCodexCharacter(idOrSlug);
      if (publicChar && !publicChar.locked) {
        return normalizeDbToLoveInterest(publicChar);
      }
    }
  } catch (e) {
    console.warn("Gagal fetch love interest detail dinamis:", e);
  }

  // Fallback pencarian nama/slug lokal
  return findLoveInterestByName(idOrSlug) || getLoveInterestBySlug(idOrSlug) || null;
}

/**
 * Mencocokkan TargetSecret yang tersimpan di Character Sheet dengan LoveInterestDefinition
 */
export function matchTargetToLoveInterest(target: TargetSecret, allInterests: LoveInterestDefinition[]): LoveInterestDefinition | null {
  if (!target) return null;

  // 1. Cocokkan berdasarkan slug eksplisit jika ada
  if (target.slug) {
    const bySlug = allInterests.find((li) => li.slug.toLowerCase() === target.slug!.toLowerCase());
    if (bySlug) return bySlug;
  }

  // 2. Cocokkan berdasarkan character_id jika ada
  if (target.character_id) {
    const byId = allInterests.find((li) => li.id === target.character_id || li.slug === target.character_id);
    if (byId) return byId;
  }

  // 3. Pencocokan cerdas berdasarkan nama target
  const q = (target.name || "").toLowerCase().trim();
  if (!q) return null;

  // Cek exact name atau prefix
  const exact = allInterests.find((li) => {
    const liName = li.name.toLowerCase();
    const romajiOnly = li.name.replace(/\([^)]+\)/, "").trim().toLowerCase();
    return (
      liName === q ||
      romajiOnly === q ||
      liName.startsWith(q) ||
      romajiOnly.startsWith(q) ||
      q.includes(romajiOnly) ||
      romajiOnly.includes(q)
    );
  });
  if (exact) return exact;

  // Cek apakah query ada di dalam nicknames
  const byNick = allInterests.find((li) =>
    (li.nickname || []).some((nick) => {
      const n = nick.toLowerCase();
      return n === q || q.includes(n) || n.includes(q);
    })
  );
  if (byNick) return byNick;

  return null;
}

export {
  getCurrentMilestone,
  type LoveInterestDefinition,
  type HeartMilestone,
  type LoveInterestGifts,
  type LoveInterestPersonality
};
