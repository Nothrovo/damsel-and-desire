import { supabase } from "./supabase";
import { CANON_SESSION1_NPCS } from "../data/canonSession1Npcs";
import { ALL_CANON_NPCS, getCanonNpcBySlug } from "../data/allCanonCharacters";
import { getAllLoveInterests, getLoveInterestBySlug } from "../data/loveInterestCompendium";
import type {
  CodexCategory,
  CodexCharacterCard,
  CodexCharacterDetail,
  CodexSectionDetail,
  CodexSectionKey,
  DmCodexCharacter,
  DmRevealLogEntry
} from "../types";

const LOCAL_CANON_REVEALS_KEY = "dnd_canon_session1_reveals_v2";

export function getLocalCanonRevealsMap(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(LOCAL_CANON_REVEALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore storage errors
  }
  const initial: Record<string, string[]> = {};
  for (const npc of ALL_CANON_NPCS) {
    initial[npc.slug] = ["identity", "appearance"];
  }
  for (const npc of CANON_SESSION1_NPCS) {
    if (!initial[npc.slug]) {
      initial[npc.slug] = [];
    }
  }
  return initial;
}

export function saveLocalCanonRevealsMap(map: Record<string, string[]>): void {
  try {
    localStorage.setItem(LOCAL_CANON_REVEALS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getCanonNpcByIdOrSlug(idOrSlug: string) {
  const cleanId = idOrSlug.replace(/^(canon_|li_)/, "").toLowerCase();
  return (
    ALL_CANON_NPCS.find(
      (c) =>
        c.slug.toLowerCase() === cleanId ||
        c.id.toLowerCase() === idOrSlug.toLowerCase() ||
        c.slug.toLowerCase() === idOrSlug.toLowerCase()
    ) ||
    CANON_SESSION1_NPCS.find(
      (c) =>
        c.slug.toLowerCase() === cleanId ||
        c.id.toLowerCase() === idOrSlug.toLowerCase() ||
        c.slug.toLowerCase() === idOrSlug.toLowerCase()
    )
  );
}

export const SUPABASE_STORAGE_PORTRAITS_URL = "https://oavkhnjigdqacvqfkzpf.supabase.co/storage/v1/object/public/codex-assets/portraits";

export function resolvePortraitUrl(rawUrl?: string | null, slug?: string): string {
  if (!rawUrl && !slug) {
    return "";
  }

  // 1. If rawUrl is empty or DiceBear, fallback to Supabase Storage if slug is provided
  if (!rawUrl || rawUrl.includes("dicebear")) {
    if (slug) {
      return `${SUPABASE_STORAGE_PORTRAITS_URL}/${slug}.png`;
    }
    return rawUrl || "";
  }

  // 2. If rawUrl is relative (/portraits/... or portraits/...)
  if (rawUrl.startsWith("/portraits/") || rawUrl.startsWith("portraits/")) {
    const filename = rawUrl.replace(/^\/?portraits\//, "");
    return `${SUPABASE_STORAGE_PORTRAITS_URL}/${filename}`;
  }

  // 3. Absolute URL
  return rawUrl;
}

function buildCanonCard(npc: any, revealedSections: string[]): CodexCharacterCard | null {
  if (!revealedSections || revealedSections.length === 0) {
    if ((npc.visibilityMode as string) === "hidden") return null;
    return {
      id: npc.id,
      category_id: npc.categoryId,
      sort_order: npc.sortOrder,
      locked: true,
      is_love_interest: npc.isLoveInterest
    };
  }

  const identitySec = npc.sections.find((s: any) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
  const appearanceSec = npc.sections.find((s: any) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;
  const hasIdentity = revealedSections.includes("identity");
  const hasAppearance = revealedSections.includes("appearance");

  return {
    id: npc.id,
    slug: npc.slug,
    category_id: npc.categoryId,
    sort_order: npc.sortOrder,
    locked: false,
    is_love_interest: npc.isLoveInterest,
    name: hasIdentity ? (identitySec?.name || "???") : "???",
    furigana: hasIdentity ? (identitySec?.furigana || "") : "",
    tagline: hasIdentity ? (identitySec?.tagline || "") : "",
    avatar_url: hasAppearance ? resolvePortraitUrl(appearanceSec?.avatar_url, npc.slug) : "",
    class_room: hasIdentity ? (identitySec?.class_room || "") : "",
    role: hasIdentity ? (identitySec?.role || "") : "",
    club: hasIdentity ? (identitySec?.club || "") : "",
    home_room_id: hasIdentity ? npc.homeRoomId : null,
    revealed_sections: revealedSections
  };
}

function buildCanonDetail(npc: any, revealedSections: string[]): CodexCharacterDetail | null {
  if (!revealedSections || revealedSections.length === 0) {
    if ((npc.visibilityMode as string) === "hidden") return null;
    return {
      id: npc.id,
      category_id: npc.categoryId,
      sort_order: npc.sortOrder,
      locked: true,
      is_love_interest: npc.isLoveInterest
    };
  }

  const identitySec = npc.sections.find((s: any) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
  const appearanceSec = npc.sections.find((s: any) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;
  const hasIdentity = revealedSections.includes("identity");
  const hasAppearance = revealedSections.includes("appearance");

  const sections: CodexSectionDetail[] = npc.sections
    .filter((s: any) => s.sectionKey !== "dm_notes")
    .sort((a: any, b: any) => a.tier - b.tier || a.sectionKey.localeCompare(b.sectionKey))
    .map((sec: any) => {
      const isRevealed = revealedSections.includes(sec.sectionKey);
      if (isRevealed) {
        return {
          section_key: sec.sectionKey as CodexSectionKey,
          tier: sec.tier,
          locked: false,
          content: sec.content as Record<string, any>
        };
      }
      return {
        section_key: sec.sectionKey as CodexSectionKey,
        tier: sec.tier,
        locked: true,
        locked_hint: sec.lockedHint || "Terkunci oleh Game Master."
      };
    });

  return {
    id: npc.id,
    slug: npc.slug,
    category_id: npc.categoryId,
    sort_order: npc.sortOrder,
    locked: false,
    is_love_interest: npc.isLoveInterest,
    name: hasIdentity ? (identitySec?.name || "???") : "???",
    furigana: hasIdentity ? (identitySec?.furigana || "") : "",
    tagline: hasIdentity ? (identitySec?.tagline || "") : "",
    avatar_url: hasAppearance ? resolvePortraitUrl(appearanceSec?.avatar_url, npc.slug) : "",
    home_room_id: hasIdentity ? npc.homeRoomId : null,
    sections
  };
}

export const DEFAULT_CODEX_CATEGORIES: CodexCategory[] = [
  { id: "osis", name: "Presidium OSIS & Komite Disiplin", description: "Jajaran pimpinan dewan siswa dan penegak ketertiban akademi", sort_order: 1, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "kokuhou", name: "Geng Berandal Kokuhou (黒鳳)", description: "Aliansi berandal pelindung belakang sekolah dan wilayah Housen", sort_order: 2, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "touki", name: "SMA Kejuruan Touki (東鬼高校)", description: "Geng berandal bengis kawasan pelabuhan dermaga industri", sort_order: 3, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_1_1", name: "Kelas 10-1", description: "Siswa-siswi tahun pertama kelas 10-1 (Grade 10)", sort_order: 4, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_1_2", name: "Kelas 10-2", description: "Siswa-siswi tahun pertama kelas 10-2 (Grade 10)", sort_order: 5, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_2_1", name: "Kelas 11-1", description: "Siswa-siswi tahun kedua kelas 11-1 (Grade 11)", sort_order: 6, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_2_2", name: "Kelas 11-2", description: "Siswa-siswi tahun kedua kelas 11-2 (Grade 11)", sort_order: 7, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_3_1", name: "Kelas 12-1", description: "Siswa-siswi tahun ketiga kelas 12-1 (Grade 12 / Senior)", sort_order: 8, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_3_2", name: "Kelas 12-2", description: "Siswa-siswi tahun ketiga kelas 12-2 (Grade 12 / Senior)", sort_order: 9, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "faculty", name: "Guru & Staf Sekolah", description: "Pengajar, staf konseling, kepala sekolah, dan staf keamanan/medis", sort_order: 10, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "clubs", name: "Klub Ekstrakurikuler", description: "Tokoh penting dan faksi 16 klub ekskul", sort_order: 11, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "outside_school", name: "Di Luar Sekolah & Alumni", description: "Alumni legendaris, keluarga, dan tokoh luar sekolah", sort_order: 12, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "other", name: "Lainnya", description: "Karakter pendukung lainnya", sort_order: 13, show_totals: false, default_visibility_mode: "placeholder" }
];

// ----------------------------------------------------------------------------
// Player APIs (Read sanitized data)
// ----------------------------------------------------------------------------

export async function fetchCodexCategories(): Promise<CodexCategory[]> {
  try {
    const { data, error } = await supabase
      .from("codex_categories")
      .select("*")
      .order("sort_order", { ascending: true });

    if (!error && data && data.length > 0) {
      // 1. Filter out deprecated/removed category 'love_interest'
      const list = (data as CodexCategory[]).filter((c) => c.id !== "love_interest");

      // 2. Ensure new official categories exist (osis, kokuhou, touki, etc.)
      const existingIds = new Set(list.map((c) => c.id));
      for (const defCat of DEFAULT_CODEX_CATEGORIES) {
        if (!existingIds.has(defCat.id)) {
          list.push(defCat);
        }
      }

      // 3. Harmonize names, descriptions and sort_order with latest official definitions
      for (const cat of list) {
        const def = DEFAULT_CODEX_CATEGORIES.find((d) => d.id === cat.id);
        if (def) {
          cat.sort_order = def.sort_order;
          cat.name = def.name;
          cat.description = def.description;
        }
      }

      list.sort((a, b) => a.sort_order - b.sort_order);
      return list;
    }
  } catch (e) {
    console.warn("Gagal memuat kategori dari Supabase, menggunakan default:", e);
  }
  return DEFAULT_CODEX_CATEGORIES;
}

export async function fetchCodexList(categoryId?: string): Promise<CodexCharacterCard[]> {
  let remoteList: CodexCharacterCard[] = [];
  try {
    const { data, error } = await supabase.rpc("list_codex", {
      p_category_id: categoryId || null
    });

    if (error) throw error;
    remoteList = (data || []) as CodexCharacterCard[];
  } catch (e: any) {
    console.error("Gagal memanggil list_codex:", e);
  }

  // Harmonisasi category_id di remoteList sesuai canon compendium
  for (const card of remoteList) {
    if (card.slug) {
      const canon = getLoveInterestBySlug(card.slug);
      if (canon && canon.category_id) {
        card.category_id = canon.category_id;
      }
    }
  }

  // Jika categoryId diminta, filter remoteList yang sudah diharmonisasikan
  if (categoryId) {
    remoteList = remoteList.filter((c) => c.category_id === categoryId);
  }

  const existingSlugs = new Set(remoteList.map((c) => c.slug).filter(Boolean));
  const localRevealsMap = getLocalCanonRevealsMap();

  for (const npc of ALL_CANON_NPCS) {
    if (existingSlugs.has(npc.slug)) continue;
    const canon = getLoveInterestBySlug(npc.slug);
    const catId = canon?.category_id || npc.categoryId;
    const matchesCategory = !categoryId || catId === categoryId;
    if (!matchesCategory) continue;

    const revealed = localRevealsMap[npc.slug] ?? ["identity", "appearance"];
    const card = buildCanonCard(npc, revealed);
    if (card) {
      card.category_id = catId;
      remoteList.push(card);
      existingSlugs.add(npc.slug);
    }
  }

  for (const npc of CANON_SESSION1_NPCS) {
    if (existingSlugs.has(npc.slug)) continue;
    const canon = getLoveInterestBySlug(npc.slug);
    const catId = canon?.category_id || npc.categoryId;
    const matchesCategory = !categoryId || catId === categoryId;
    if (!matchesCategory) continue;

    const revealed = localRevealsMap[npc.slug] ?? [];
    const card = buildCanonCard(npc, revealed);
    if (card) {
      card.category_id = catId;
      remoteList.push(card);
      existingSlugs.add(npc.slug);
    }
  }

  // Lengkapi dengan seluruh karakter canon dari compendium
  const allCompendium = getAllLoveInterests();
  for (const compChar of allCompendium) {
    if (existingSlugs.has(compChar.slug)) continue;
    const matchesCategory = !categoryId || compChar.category_id === categoryId;
    if (!matchesCategory) continue;

    const revealed = localRevealsMap[compChar.slug] ?? ["identity", "appearance"];
    const hasIdentity = revealed.includes("identity");
    const hasAppearance = revealed.includes("appearance");
    const isLocked = revealed.length === 0;

    remoteList.push({
      id: compChar.id,
      slug: compChar.slug,
      category_id: compChar.category_id,
      sort_order: 10,
      locked: isLocked,
      is_love_interest: true,
      name: hasIdentity ? compChar.name : "???",
      furigana: hasIdentity ? compChar.furigana : "",
      tagline: hasIdentity ? compChar.tagline : "",
      avatar_url: hasAppearance ? resolvePortraitUrl(compChar.avatar_url, compChar.slug) : "",
      class_room: hasIdentity ? compChar.class_room : "",
      role: hasIdentity ? compChar.role : "",
      club: hasIdentity ? compChar.club : "",
      home_room_id: null,
      revealed_sections: revealed
    });
    existingSlugs.add(compChar.slug);
  }

  // Harmonisasi card dengan definisi canon compendium resmi
  for (const card of remoteList) {
    if (card.slug && !card.locked) {
      card.avatar_url = resolvePortraitUrl(card.avatar_url, card.slug);
      const canon = getLoveInterestBySlug(card.slug);
      if (canon) {
        card.role = canon.role;
        card.club = canon.club;
        card.class_room = canon.class_room;
        if (canon.tagline && (!card.tagline || card.tagline === "???")) card.tagline = canon.tagline;
        if (canon.furigana && !card.furigana) card.furigana = canon.furigana;
      }
    }
  }

  return remoteList;
}

export async function fetchCodexCharacter(idOrSlug: string): Promise<CodexCharacterDetail | null> {
  try {
    const { data, error } = await supabase.rpc("get_codex_character", {
      p_id_or_slug: idOrSlug
    });

    if (!error && data) {
      const detail = data as CodexCharacterDetail;
      if (detail.slug) {
        detail.avatar_url = resolvePortraitUrl(detail.avatar_url, detail.slug);
        const appSec = detail.sections?.find((s) => s.section_key === "appearance");
        if (appSec && appSec.content) {
          appSec.content.avatar_url = resolvePortraitUrl(appSec.content.avatar_url, detail.slug);
        }
        const canon = getLoveInterestBySlug(detail.slug);
        if (canon) {
          const idSec = detail.sections?.find((s) => s.section_key === "identity");
          if (idSec && idSec.content) {
            idSec.content.role = canon.role;
            idSec.content.club = canon.club;
            idSec.content.club_role = canon.club_role;
            idSec.content.class_room = canon.class_room;
          }
        }
      }
      return detail;
    }
  } catch (e: any) {
    console.error("Gagal memanggil get_codex_character:", e);
  }

  const canonNpc = getCanonNpcByIdOrSlug(idOrSlug);
  if (canonNpc) {
    const localRevealsMap = getLocalCanonRevealsMap();
    const revealed = localRevealsMap[canonNpc.slug] ?? ["identity", "appearance"];
    return buildCanonDetail(canonNpc, revealed);
  }

  const compChar = getLoveInterestBySlug(idOrSlug);
  if (compChar) {
    const localRevealsMap = getLocalCanonRevealsMap();
    const revealed = localRevealsMap[compChar.slug] ?? ["identity", "appearance"];
    const isLocked = revealed.length === 0;
    if (isLocked) {
      return {
        id: compChar.id,
        category_id: compChar.category_id,
        sort_order: 10,
        locked: true,
        is_love_interest: true
      };
    }

    const sections: CodexSectionDetail[] = [
      {
        section_key: "identity",
        tier: 1,
        locked: !revealed.includes("identity"),
        content: {
          name: compChar.name,
          furigana: compChar.furigana,
          nickname: compChar.nickname,
          tagline: compChar.tagline,
          grade: compChar.grade,
          class_room: compChar.class_room,
          role: compChar.role,
          club: compChar.club,
          club_role: compChar.club_role,
          age: compChar.age,
          birthday: compChar.birthday,
          zodiac: compChar.zodiac,
          mbti: compChar.mbti,
          gender: compChar.gender,
          archetype: compChar.archetype,
          social_class: compChar.social_class,
          stats: compChar.stats,
          vitals: compChar.vitals
        }
      },
      {
        section_key: "appearance",
        tier: 1,
        locked: !revealed.includes("appearance"),
        content: {
          avatar_url: resolvePortraitUrl(compChar.avatar_url, compChar.slug),
          raw_markdown: compChar.appearance
        }
      },
      {
        section_key: "personality",
        tier: 2,
        locked: !revealed.includes("personality"),
        content: {
          likes: compChar.likes,
          dislikes: compChar.dislikes,
          raw_markdown: `### Karakter Dasar\n${compChar.personality?.traits || ""}\n\n### Celah Emosional\n${compChar.personality?.flaws || ""}\n\n### Pola Kasmaran\n${compChar.personality?.dere_pattern || ""}`
        }
      },
      {
        section_key: "background",
        tier: 2,
        locked: !revealed.includes("background"),
        content: {
          raw_markdown: `Karakter resmi ${compChar.name} di Housen Academy (${compChar.class_room}).`
        }
      },
      {
        section_key: "relationships",
        tier: 2,
        locked: !revealed.includes("relationships"),
        content: {
          raw_markdown: `Afiliasi resmi: ${compChar.category_id.toUpperCase()} • ${compChar.role}`
        }
      },
      {
        section_key: "mind",
        tier: 3,
        locked: !revealed.includes("mind"),
        content: {
          heart_meter: compChar.heart_meter,
          confession_dc: compChar.heart_meter?.confession_target_dc || 17,
          heart_meter_base: compChar.heart_meter?.base || 1,
          raw_markdown: compChar.personality?.dere_pattern || ""
        }
      },
      {
        section_key: "secrets",
        tier: 3,
        locked: !revealed.includes("secrets"),
        content: {
          raw_markdown: `Catatan rahasia untuk ${compChar.name}.`
        }
      },
      {
        section_key: "dm_notes",
        tier: 99,
        locked: true,
        content: {
          notes: `Arketipe: ${compChar.archetype} | Kelas: ${compChar.class_room} | Peran: ${compChar.role}`
        }
      }
    ];

    return {
      id: compChar.id,
      slug: compChar.slug,
      category_id: compChar.category_id,
      sort_order: 10,
      locked: false,
      is_love_interest: true,
      name: revealed.includes("identity") ? compChar.name : "???",
      furigana: revealed.includes("identity") ? compChar.furigana : "",
      tagline: revealed.includes("identity") ? compChar.tagline : "",
      avatar_url: revealed.includes("appearance") ? resolvePortraitUrl(compChar.avatar_url, compChar.slug) : "",
      home_room_id: null,
      sections
    };
  }

  return null;
}

// ----------------------------------------------------------------------------
// DM APIs (Privileged with Session Token)
// ----------------------------------------------------------------------------

async function ensureCanonNpcsSyncedToDb(sessionToken: string, existingList: DmCodexCharacter[]): Promise<boolean> {
  let anySynced = false;
  const localRevealsMap = getLocalCanonRevealsMap();
  const existingMap = new Map(existingList.map((c) => [c.slug, c]));

  for (const npc of CANON_SESSION1_NPCS) {
    const existing = existingMap.get(npc.slug);
    const identitySec = npc.sections.find((s) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
    const appearanceSec = npc.sections.find((s) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;

    const cleanDbAvatar = existing?.avatar_url ? resolvePortraitUrl(existing.avatar_url, npc.slug) : "";
    const cleanLocalAvatar = appearanceSec?.avatar_url ? resolvePortraitUrl(appearanceSec.avatar_url, npc.slug) : "";

    // Jika sudah ada dan role, club, serta avatar sudah cocok (bukan dicebear), lewati
    const isOutdated =
      !existing ||
      existing.role !== identitySec?.role ||
      existing.club !== identitySec?.club ||
      !cleanDbAvatar ||
      cleanDbAvatar.includes("dicebear") ||
      (cleanLocalAvatar && cleanDbAvatar !== cleanLocalAvatar);

    if (!isOutdated) {
      continue;
    }

    try {
      const payload = {
        slug: npc.slug,
        categoryId: npc.categoryId,
        category_id: npc.categoryId,
        sortOrder: npc.sortOrder,
        sort_order: npc.sortOrder,
        visibilityMode: npc.visibilityMode,
        visibility_mode: npc.visibilityMode,
        homeRoomId: npc.homeRoomId,
        home_room_id: npc.homeRoomId,
        isLoveInterest: npc.isLoveInterest,
        is_love_interest: npc.isLoveInterest,
        sections: npc.sections.map((s) => ({
          sectionKey: s.sectionKey,
          section_key: s.sectionKey,
          tier: s.tier,
          content: s.sectionKey === "appearance" && s.content
            ? {
                ...s.content,
                avatar_url: resolvePortraitUrl((s.content as any).avatar_url, npc.slug),
                images: [{ path: resolvePortraitUrl((s.content as any).avatar_url, npc.slug), caption: "ID Portrait" }]
              }
            : s.content,
          lockedHint: s.lockedHint,
          locked_hint: s.lockedHint
        }))
      };
      const res = await dmUpsertCharacter(sessionToken, payload);
      if (res.success && res.id) {
        anySynced = true;
      }
    } catch (err) {
      console.warn("Gagal sinkronisasi otomatis NPC canon ke DB:", npc.slug, err);
    }
  }
  return anySynced;
}

export async function dmLogin(password: string): Promise<{ success: boolean; session_token?: string; expires_at?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("dm_login", {
      p_password: password
    });

    if (error) throw error;
    return data as any;
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal masuk mode DM" };
  }
}

export async function dmLogout(sessionToken: string): Promise<boolean> {
  try {
    await supabase.rpc("dm_logout", {
      p_session_token: sessionToken
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function dmVerifySession(sessionToken: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("dm_verify_session", {
      p_session_token: sessionToken
    });
    if (error || !data) return false;
    return Boolean(data.valid);
  } catch (e) {
    return false;
  }
}

export async function dmChangePassword(sessionToken: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("dm_change_password", {
      p_session_token: sessionToken,
      p_new_password: newPassword
    });
    if (error) throw error;
    return data as any;
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal mengganti password DM" };
  }
}

export async function dmListAll(sessionToken: string): Promise<DmCodexCharacter[]> {
  try {
    const { data, error } = await supabase.rpc("dm_list_all", {
      p_session_token: sessionToken
    });
    if (error) throw error;
    let list = (data || []) as DmCodexCharacter[];

    // Otomatis sinkronkan karakter Canon Sesi 1 ke Supabase jika belum ada atau outdated di DB
    const synced = await ensureCanonNpcsSyncedToDb(sessionToken, list);
    if (synced) {
      const { data: refreshed } = await supabase.rpc("dm_list_all", {
        p_session_token: sessionToken
      });
      if (refreshed) {
        list = refreshed as DmCodexCharacter[];
      }
    }

    const finalSlugs = new Set(list.map((c) => c.slug));
    const localRevealsMap = getLocalCanonRevealsMap();
    for (const npc of CANON_SESSION1_NPCS) {
      if (finalSlugs.has(npc.slug)) continue;
      const identitySec = npc.sections.find((s) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
      const appearanceSec = npc.sections.find((s) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;
      const dmNotesSec = npc.sections.find((s) => s.sectionKey === "dm_notes")?.content as Record<string, any> | undefined;
      const canon = getLoveInterestBySlug(npc.slug);
      list.push({
        id: npc.id,
        slug: npc.slug,
        category_id: canon?.category_id || npc.categoryId,
        sort_order: npc.sortOrder,
        visibility_mode: npc.visibilityMode as any,
        is_love_interest: npc.isLoveInterest,
        name: identitySec?.name || npc.slug,
        furigana: identitySec?.furigana || "",
        tagline: identitySec?.tagline || "",
        avatar_url: appearanceSec?.avatar_url || "",
        class_room: identitySec?.class_room || "",
        role: identitySec?.role || "",
        club: identitySec?.club || "",
        home_room_id: npc.homeRoomId,
        revealed_sections: localRevealsMap[npc.slug] ?? [],
        dm_notes: dmNotesSec?.notes || ""
      });
      finalSlugs.add(npc.slug);
    }

    // Tambahkan seluruh karakter dari compendium
    const allCompendium = getAllLoveInterests();
    for (const compChar of allCompendium) {
      if (finalSlugs.has(compChar.slug)) continue;
      list.push({
        id: compChar.id,
        slug: compChar.slug,
        category_id: compChar.category_id,
        sort_order: 10,
        visibility_mode: "placeholder",
        is_love_interest: true,
        name: compChar.name,
        furigana: compChar.furigana,
        tagline: compChar.tagline,
        avatar_url: resolvePortraitUrl(compChar.avatar_url, compChar.slug),
        class_room: compChar.class_room,
        role: compChar.role,
        club: compChar.club,
        home_room_id: null,
        revealed_sections: localRevealsMap[compChar.slug] ?? ["identity", "appearance"],
        dm_notes: `Arketipe: ${compChar.archetype} | Kelas: ${compChar.class_room}`
      });
      finalSlugs.add(compChar.slug);
    }

    // Harmonisasi dengan definisi canon compendium resmi
    for (const char of list) {
      if (char.slug) {
        char.avatar_url = resolvePortraitUrl(char.avatar_url, char.slug);
        const canon = getLoveInterestBySlug(char.slug);
        if (canon) {
          if (canon.category_id) char.category_id = canon.category_id;
          char.role = canon.role;
          char.club = canon.club;
          char.class_room = canon.class_room;
          if (canon.tagline) char.tagline = canon.tagline;
          if (canon.furigana) char.furigana = canon.furigana;
        }
      }
    }

    return list;
  } catch (e: any) {
    console.error("Gagal memanggil dm_list_all:", e);
    throw e;
  }
}

export async function dmGetCharacter(sessionToken: string, characterId: string): Promise<any> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId);
  const localNpc = getCanonNpcByIdOrSlug(characterId);

  if (!isUuid && localNpc) {
    const localRevealsMap = getLocalCanonRevealsMap();
    const revealed = localRevealsMap[localNpc.slug] ?? ["identity", "appearance"];
    const dmNotesSec = localNpc.sections.find((s: any) => s.sectionKey === "dm_notes");
    return {
      id: localNpc.id,
      slug: localNpc.slug,
      category_id: localNpc.categoryId,
      sort_order: localNpc.sortOrder,
      visibility_mode: localNpc.visibilityMode,
      home_room_id: localNpc.homeRoomId,
      is_love_interest: localNpc.isLoveInterest,
      revealed_sections: revealed,
      dm_notes: (dmNotesSec?.content as any)?.notes || "",
      sections: localNpc.sections.map((s: any) => ({
        section_key: s.sectionKey,
        tier: s.tier,
        revealed: revealed.includes(s.sectionKey),
        content: s.content,
        locked_hint: s.lockedHint
      }))
    };
  }

  if (isUuid) {
    try {
      const { data, error } = await supabase.rpc("dm_get_character", {
        p_session_token: sessionToken,
        p_character_id: characterId
      });
      if (!error && data) {
        if (data.slug) {
          data.avatar_url = resolvePortraitUrl(data.avatar_url, data.slug);
          const appSec = data.sections?.find((s: any) => s.section_key === "appearance");
          if (appSec && appSec.content) {
            appSec.content.avatar_url = resolvePortraitUrl(appSec.content.avatar_url, data.slug);
          }
          const canon = getLoveInterestBySlug(data.slug);
          if (canon) {
            const idSec = data.sections?.find((s: any) => s.section_key === "identity");
            if (idSec && idSec.content) {
              idSec.content.role = canon.role;
              idSec.content.club = canon.club;
              idSec.content.club_role = canon.club_role;
              idSec.content.class_room = canon.class_room;
            }
          }
        }
        return data;
      }
    } catch (e: any) {
      console.warn("Supabase dm_get_character gagal, cek local fallback:", e);
    }
  }

  if (localNpc) {
    const localRevealsMap = getLocalCanonRevealsMap();
    const revealed = localRevealsMap[localNpc.slug] ?? ["identity", "appearance"];
    const dmNotesSec = localNpc.sections.find((s: any) => s.sectionKey === "dm_notes");
    return {
      id: localNpc.id,
      slug: localNpc.slug,
      category_id: localNpc.categoryId,
      sort_order: localNpc.sortOrder,
      visibility_mode: localNpc.visibilityMode,
      home_room_id: localNpc.homeRoomId,
      is_love_interest: localNpc.isLoveInterest,
      revealed_sections: revealed,
      dm_notes: (dmNotesSec?.content as any)?.notes || "",
      sections: localNpc.sections.map((s: any) => ({
        section_key: s.sectionKey,
        tier: s.tier,
        revealed: revealed.includes(s.sectionKey),
        content: s.content,
        locked_hint: s.lockedHint
      }))
    };
  }

  return null;
}

export async function dmSetReveal(
  sessionToken: string,
  characterId: string,
  sectionKey: string,
  revealed: boolean
): Promise<boolean> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId);
  const localNpc = getCanonNpcByIdOrSlug(characterId);

  if (!isUuid || localNpc) {
    const slug = localNpc ? localNpc.slug : characterId.replace(/^(canon_|li_)/, "");
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[slug] ?? ["identity", "appearance"]);
    if (revealed) current.add(sectionKey);
    else current.delete(sectionKey);
    map[slug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
    if (!isUuid) return true;
  }

  try {
    const { data, error } = await supabase.rpc("dm_set_reveal", {
      p_session_token: sessionToken,
      p_character_id: characterId,
      p_section_key: sectionKey,
      p_revealed: revealed
    });
    if (error) throw error;
    return Boolean(data?.success);
  } catch (e: any) {
    console.error("Gagal memanggil dm_set_reveal:", e);
    throw e;
  }
}

export async function dmSetTierReveal(
  sessionToken: string,
  characterId: string,
  tier: number,
  revealed: boolean
): Promise<boolean> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId);
  const localNpc = getCanonNpcByIdOrSlug(characterId);

  if (!isUuid || localNpc) {
    const slug = localNpc ? localNpc.slug : characterId.replace(/^(canon_|li_)/, "");
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[slug] ?? ["identity", "appearance"]);
    for (const sec of (localNpc?.sections || [])) {
      if (sec.tier === tier && sec.sectionKey !== "dm_notes") {
        if (revealed) current.add(sec.sectionKey);
        else current.delete(sec.sectionKey);
      }
    }
    map[slug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
    if (!isUuid) return true;
  }

  try {
    const { data, error } = await supabase.rpc("dm_set_tier_reveal", {
      p_session_token: sessionToken,
      p_character_id: characterId,
      p_tier: tier,
      p_revealed: revealed
    });
    if (error) throw error;
    return Boolean(data?.success);
  } catch (e: any) {
    console.error("Gagal memanggil dm_set_tier_reveal:", e);
    throw e;
  }
}

export async function dmIntroduce(sessionToken: string, characterId: string, slug?: string): Promise<boolean> {
  const effectiveSlug = slug || getCanonNpcByIdOrSlug(characterId)?.slug || (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId) ? characterId.replace(/^(canon_|li_)/, "") : "");
  if (effectiveSlug) {
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[effectiveSlug] ?? []);
    current.add("identity");
    current.add("appearance");
    map[effectiveSlug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId);
  if (!isUuid) return true;

  try {
    const { data, error } = await supabase.rpc("dm_introduce", {
      p_session_token: sessionToken,
      p_character_id: characterId
    });
    if (error) throw error;
    return Boolean(data?.success);
  } catch (e: any) {
    console.error("Gagal memanggil dm_introduce:", e);
    throw e;
  }
}

export async function dmLockAll(sessionToken: string, characterId?: string, slug?: string): Promise<boolean> {
  const map = getLocalCanonRevealsMap();
  const effectiveSlug = slug || (characterId ? getCanonNpcByIdOrSlug(characterId)?.slug : "") || (characterId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId) ? characterId.replace(/^(canon_|li_)/, "") : "");
  
  if (effectiveSlug) {
    map[effectiveSlug] = [];
    saveLocalCanonRevealsMap(map);
  } else if (!characterId) {
    for (const npc of ALL_CANON_NPCS) {
      map[npc.slug] = [];
    }
    for (const npc of CANON_SESSION1_NPCS) {
      map[npc.slug] = [];
    }
    saveLocalCanonRevealsMap(map);
  }

  const isUuid = characterId ? /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(characterId) : false;
  if (characterId && !isUuid) return true;

  try {
    const { data, error } = await supabase.rpc("dm_lock_all", {
      p_session_token: sessionToken,
      p_character_id: isUuid ? characterId : null
    });
    if (error) throw error;
    return Boolean(data?.success);
  } catch (e: any) {
    console.error("Gagal memanggil dm_lock_all:", e);
    throw e;
  }
}

export async function dmGetLog(sessionToken: string): Promise<DmRevealLogEntry[]> {
  try {
    const { data, error } = await supabase.rpc("dm_get_log", {
      p_session_token: sessionToken
    });
    if (error) throw error;
    return (data || []) as DmRevealLogEntry[];
  } catch (e: any) {
    console.error("Gagal memanggil dm_get_log:", e);
    return [];
  }
}

export async function dmUpsertCharacter(sessionToken: string, payload: any): Promise<{ success: boolean; id?: string; slug?: string; error?: string }> {
  try {
    const { data, error } = await supabase.rpc("dm_upsert_character", {
      p_session_token: sessionToken,
      p_payload: payload
    });
    if (error) {
      // Jika kategori belum ada di database cloud (foreign key constraint), fallback ke 'other' di level baris
      if (error.message && error.message.includes("category_id_fkey")) {
        console.warn("Kategori belum ada di database cloud, retry dengan fallback 'other'...");
        const fallbackPayload = {
          ...payload,
          categoryId: "other",
          category_id: "other"
        };
        const { data: fbData, error: fbError } = await supabase.rpc("dm_upsert_character", {
          p_session_token: sessionToken,
          p_payload: fallbackPayload
        });
        if (!fbError && fbData) {
          return fbData as any;
        }
      }
      throw error;
    }
    return data as any;
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal menyimpan karakter ke database" };
  }
}

export async function dmBatchIntroduce(sessionToken: string, characterIds: string[]): Promise<boolean> {
  if (characterIds.length === 0) return true;
  try {
    const { data, error } = await supabase.rpc("dm_batch_introduce", {
      p_session_token: sessionToken,
      p_character_ids: characterIds
    });
    if (!error && data?.success) return true;
  } catch (e) {
    // fallback to parallel execution
  }
  await Promise.all(characterIds.map(id => dmIntroduce(sessionToken, id)));
  return true;
}

export async function dmBatchSetTier(
  sessionToken: string,
  characterIds: string[],
  tier: number,
  revealed: boolean
): Promise<boolean> {
  if (characterIds.length === 0) return true;
  try {
    const { data, error } = await supabase.rpc("dm_batch_set_tier", {
      p_session_token: sessionToken,
      p_character_ids: characterIds,
      p_tier: tier,
      p_revealed: revealed
    });
    if (!error && data?.success) return true;
  } catch (e) {
    // fallback
  }
  await Promise.all(characterIds.map(id => dmSetTierReveal(sessionToken, id, tier, revealed)));
  return true;
}

export async function dmBatchLockAll(sessionToken: string, characterIds: string[]): Promise<boolean> {
  if (characterIds.length === 0) return true;
  try {
    const { data, error } = await supabase.rpc("dm_batch_lock_all", {
      p_session_token: sessionToken,
      p_character_ids: characterIds
    });
    if (!error && data?.success) return true;
  } catch (e) {
    // fallback
  }
  await Promise.all(characterIds.map(id => dmLockAll(sessionToken, id)));
  return true;
}

export async function dmDeleteCharacter(sessionToken: string, characterId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc("dm_delete_character", {
      p_session_token: sessionToken,
      p_character_id: characterId
    });
    if (error) throw error;
    return Boolean(data?.success);
  } catch (e: any) {
    console.error("Gagal menghapus karakter:", e);
    throw e;
  }
}

export async function dmUploadCharacterImage(
  sessionToken: string,
  file: File
): Promise<{ success: boolean; url?: string; error?: string }> {
  // 1. Cek sesi token dasar
  if (!sessionToken) {
    return { success: false, error: "Sesi DM tidak valid atau telah kedaluwarsa." };
  }

  // 2. Coba unggah ke bucket codex-assets
  try {
    const ext = (file.name.split(".").pop() || "png").toLowerCase();
    const randomId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    const filePath = `portraits/asset_${randomId}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("codex-assets")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      });

    if (!uploadError) {
      const { data } = supabase.storage
        .from("codex-assets")
        .getPublicUrl(filePath);

      if (data?.publicUrl) {
        return { success: true, url: data.publicUrl };
      }
    } else {
      console.warn("Storage upload error:", uploadError);
    }
  } catch (e) {
    // Jika upload bucket gagal, fallback ke kompresi lokal (Data URL)
  }

  // 3. Fallback: Kompresi gambar lokal menjadi Data URL yang rapi
  try {
    const compressedDataUrl = await compressImageFile(file, 600, 0.82);
    return { success: true, url: compressedDataUrl };
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal mengunggah foto." };
  }
}

function compressImageFile(file: File, maxWidth: number, quality: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(ev.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("File gambar rusak atau tidak didukung."));
      img.src = ev.target?.result as string;
    };
    reader.onerror = () => reject(new Error("Gagal membaca file gambar."));
    reader.readAsDataURL(file);
  });
}


