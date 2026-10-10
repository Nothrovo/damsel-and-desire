import { supabase } from "./supabase";
import { CANON_SESSION1_NPCS } from "../data/canonSession1Npcs";
import type {
  CodexCategory,
  CodexCharacterCard,
  CodexCharacterDetail,
  CodexSectionDetail,
  CodexSectionKey,
  DmCodexCharacter,
  DmRevealLogEntry
} from "../types";

const LOCAL_CANON_REVEALS_KEY = "dnd_canon_session1_reveals_v1";

function getLocalCanonRevealsMap(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(LOCAL_CANON_REVEALS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore storage errors
  }
  const initial: Record<string, string[]> = {};
  for (const npc of CANON_SESSION1_NPCS) {
    initial[npc.slug] = ["identity", "appearance"];
  }
  return initial;
}

function saveLocalCanonRevealsMap(map: Record<string, string[]>): void {
  try {
    localStorage.setItem(LOCAL_CANON_REVEALS_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
}

function getCanonNpcByIdOrSlug(idOrSlug: string) {
  return CANON_SESSION1_NPCS.find(
    (c) => c.slug === idOrSlug || c.id === idOrSlug
  );
}

function buildCanonCard(npc: (typeof CANON_SESSION1_NPCS)[number], revealedSections: string[]): CodexCharacterCard | null {
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

  const identitySec = npc.sections.find((s) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
  const appearanceSec = npc.sections.find((s) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;
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
    avatar_url: hasAppearance ? (appearanceSec?.avatar_url || "") : "",
    class_room: hasIdentity ? (identitySec?.class_room || "") : "",
    role: hasIdentity ? (identitySec?.role || "") : "",
    club: hasIdentity ? (identitySec?.club || "") : "",
    home_room_id: hasIdentity ? npc.homeRoomId : null,
    revealed_sections: revealedSections
  };
}

function buildCanonDetail(npc: (typeof CANON_SESSION1_NPCS)[number], revealedSections: string[]): CodexCharacterDetail | null {
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

  const identitySec = npc.sections.find((s) => s.sectionKey === "identity")?.content as Record<string, any> | undefined;
  const appearanceSec = npc.sections.find((s) => s.sectionKey === "appearance")?.content as Record<string, any> | undefined;
  const hasIdentity = revealedSections.includes("identity");
  const hasAppearance = revealedSections.includes("appearance");

  const sections: CodexSectionDetail[] = npc.sections
    .filter((s) => s.sectionKey !== "dm_notes")
    .sort((a, b) => a.tier - b.tier || a.sectionKey.localeCompare(b.sectionKey))
    .map((sec) => {
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
    avatar_url: hasAppearance ? (appearanceSec?.avatar_url || "") : "",
    home_room_id: hasIdentity ? npc.homeRoomId : null,
    sections
  };
}

export const DEFAULT_CODEX_CATEGORIES: CodexCategory[] = [
  { id: "class_1_1", name: "Kelas 1-1", description: "Siswa-siswi tahun pertama kelas 1-1 (Grade 10)", sort_order: 1, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_1_2", name: "Kelas 1-2", description: "Siswa-siswi tahun pertama kelas 1-2 (Grade 10)", sort_order: 2, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_2_1", name: "Kelas 2-1", description: "Siswa-siswi tahun kedua kelas 2-1 (Grade 11)", sort_order: 3, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_2_2", name: "Kelas 2-2", description: "Siswa-siswi tahun kedua kelas 2-2 (Grade 11)", sort_order: 4, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_3_1", name: "Kelas 3-1", description: "Siswa-siswi tahun ketiga kelas 3-1 (Grade 12 / Senior)", sort_order: 5, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "class_3_2", name: "Kelas 3-2", description: "Siswa-siswi tahun ketiga kelas 3-2 (Grade 12 / Senior)", sort_order: 6, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "faculty", name: "Guru & Staf Sekolah", description: "Pengajar, staf konseling, kepala sekolah, dan tenaga kesehatan", sort_order: 7, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "love_interest", name: "Target Asmara (Love Interest)", description: "Heroine & target asmara terdaftar di Housen Academy", sort_order: 8, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "clubs", name: "Klub Ekstrakurikuler", description: "Tokoh penting dan faksi 16 klub ekskul", sort_order: 9, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "outside_school", name: "Di Luar Sekolah", description: "Keluarga, alumni, pemilik toko, dan rival sekolah lain", sort_order: 10, show_totals: false, default_visibility_mode: "placeholder" },
  { id: "other", name: "Lainnya", description: "Karakter pendukung lainnya", sort_order: 11, show_totals: false, default_visibility_mode: "placeholder" }
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
      return data as CodexCategory[];
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

  const existingSlugs = new Set(remoteList.map((c) => c.slug).filter(Boolean));
  const localRevealsMap = getLocalCanonRevealsMap();

  for (const npc of CANON_SESSION1_NPCS) {
    if (existingSlugs.has(npc.slug)) continue;
    const matchesCategory =
      !categoryId ||
      npc.categoryId === categoryId ||
      (categoryId === "love_interest" && npc.isLoveInterest);
    if (!matchesCategory) continue;

    const revealed = localRevealsMap[npc.slug] ?? ["identity", "appearance"];
    const card = buildCanonCard(npc, revealed);
    if (card) {
      remoteList.push(card);
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
      return data as CodexCharacterDetail;
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

  return null;
}

// ----------------------------------------------------------------------------
// DM APIs (Privileged with Session Token)
// ----------------------------------------------------------------------------

async function ensureCanonNpcsSyncedToDb(sessionToken: string, existingSlugs: Set<string>): Promise<boolean> {
  let anySynced = false;
  const localRevealsMap = getLocalCanonRevealsMap();

  for (const npc of CANON_SESSION1_NPCS) {
    if (existingSlugs.has(npc.slug)) continue;
    try {
      const payload = {
        slug: npc.slug,
        category_id: npc.categoryId,
        sort_order: npc.sortOrder,
        visibility_mode: npc.visibilityMode,
        home_room_id: npc.homeRoomId,
        is_love_interest: npc.isLoveInterest,
        sections: npc.sections.map((s) => ({
          section_key: s.sectionKey,
          tier: s.tier,
          content: s.content,
          locked_hint: s.lockedHint
        }))
      };
      const res = await dmUpsertCharacter(sessionToken, payload);
      if (res.success && res.id) {
        anySynced = true;
        const revealed = localRevealsMap[npc.slug] ?? ["identity", "appearance"];
        for (const secKey of revealed) {
          await supabase.rpc("dm_set_reveal", {
            p_session_token: sessionToken,
            p_character_id: res.id,
            p_section_key: secKey,
            p_revealed: true
          });
        }
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
    const existingSlugs = new Set(list.map((c) => c.slug));

    // Otomatis sinkronkan 7 karakter Canon NPC Sesi 1 ke Supabase jika belum ada di DB
    const synced = await ensureCanonNpcsSyncedToDb(sessionToken, existingSlugs);
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
      list.push({
        id: npc.id,
        slug: npc.slug,
        category_id: npc.categoryId,
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
        revealed_sections: localRevealsMap[npc.slug] ?? ["identity", "appearance"],
        dm_notes: dmNotesSec?.notes || ""
      });
    }

    return list;
  } catch (e: any) {
    console.error("Gagal memanggil dm_list_all:", e);
    throw e;
  }
}

export async function dmGetCharacter(sessionToken: string, characterId: string): Promise<any> {
  const localNpc = getCanonNpcByIdOrSlug(characterId);
  if (localNpc && characterId.startsWith("canon_")) {
    const localRevealsMap = getLocalCanonRevealsMap();
    const revealed = localRevealsMap[localNpc.slug] ?? ["identity", "appearance"];
    return {
      id: localNpc.id,
      slug: localNpc.slug,
      category_id: localNpc.categoryId,
      sort_order: localNpc.sortOrder,
      visibility_mode: localNpc.visibilityMode,
      home_room_id: localNpc.homeRoomId,
      is_love_interest: localNpc.isLoveInterest,
      revealed_sections: revealed,
      sections: localNpc.sections.map((s) => ({
        section_key: s.sectionKey,
        tier: s.tier,
        revealed: revealed.includes(s.sectionKey),
        content: s.content,
        locked_hint: s.lockedHint
      }))
    };
  }

  try {
    const { data, error } = await supabase.rpc("dm_get_character", {
      p_session_token: sessionToken,
      p_character_id: characterId
    });
    if (error) throw error;
    return data;
  } catch (e: any) {
    console.error("Gagal memanggil dm_get_character:", e);
    throw e;
  }
}

export async function dmSetReveal(
  sessionToken: string,
  characterId: string,
  sectionKey: string,
  revealed: boolean
): Promise<boolean> {
  const localNpc = getCanonNpcByIdOrSlug(characterId);
  if (localNpc && characterId.startsWith("canon_")) {
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[localNpc.slug] ?? ["identity", "appearance"]);
    if (revealed) current.add(sectionKey);
    else current.delete(sectionKey);
    map[localNpc.slug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
    return true;
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
  const localNpc = getCanonNpcByIdOrSlug(characterId);
  if (localNpc && characterId.startsWith("canon_")) {
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[localNpc.slug] ?? ["identity", "appearance"]);
    for (const sec of localNpc.sections) {
      if (sec.tier === tier && sec.sectionKey !== "dm_notes") {
        if (revealed) current.add(sec.sectionKey);
        else current.delete(sec.sectionKey);
      }
    }
    map[localNpc.slug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
    return true;
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

export async function dmIntroduce(sessionToken: string, characterId: string): Promise<boolean> {
  const localNpc = getCanonNpcByIdOrSlug(characterId);
  if (localNpc && characterId.startsWith("canon_")) {
    const map = getLocalCanonRevealsMap();
    const current = new Set(map[localNpc.slug] ?? []);
    current.add("identity");
    current.add("appearance");
    map[localNpc.slug] = Array.from(current);
    saveLocalCanonRevealsMap(map);
    return true;
  }

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

export async function dmLockAll(sessionToken: string, characterId?: string): Promise<boolean> {
  if (characterId && characterId.startsWith("canon_")) {
    const localNpc = getCanonNpcByIdOrSlug(characterId);
    if (localNpc) {
      const map = getLocalCanonRevealsMap();
      map[localNpc.slug] = [];
      saveLocalCanonRevealsMap(map);
      return true;
    }
  } else if (!characterId) {
    const map = getLocalCanonRevealsMap();
    for (const npc of CANON_SESSION1_NPCS) {
      map[npc.slug] = [];
    }
    saveLocalCanonRevealsMap(map);
  }

  try {
    const { data, error } = await supabase.rpc("dm_lock_all", {
      p_session_token: sessionToken,
      p_character_id: characterId || null
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
    if (error) throw error;
    return data as any;
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal menyimpan karakter" };
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
  // 1. Pastikan sesi DM aktif
  const isValid = await dmVerifySession(sessionToken);
  if (!isValid) {
    return { success: false, error: "Sesi DM tidak valid atau telah kedaluwarsa." };
  }

  // 2. Coba unggah ke bucket private codex-assets dengan nama file acak (tidak membocorkan nama karakter)
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
        upsert: true
      });

    if (!uploadError) {
      // Buat signed URL dengan TTL 60 menit (3600 detik)
      const { data: signedData, error: signError } = await supabase.storage
        .from("codex-assets")
        .createSignedUrl(filePath, 3600);

      if (!signError && signedData?.signedUrl) {
        return { success: true, url: signedData.signedUrl };
      }
    }
  } catch (e) {
    // Jika bucket belum dikonfigurasi, otomatis gunakan kompresi lokal (Data URL)
  }

  // 3. Fallback: Kompresi gambar lokal menjadi Data URL yang rapi
  try {
    const compressedDataUrl = await compressImageFile(file, 600, 0.82);
    return { success: true, url: compressedDataUrl };
  } catch (e: any) {
    return { success: false, error: e.message || "Gagal memproses file gambar." };
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


