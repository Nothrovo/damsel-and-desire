import { supabase } from "./supabase";
import type { Character, CharacterSecret, CalendarProgress } from "../types";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";

const LOCAL_STORAGE_KEY = "damsel_and_desire_roster_v1";

function getLocalRoster(): Character[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item: any) => normalizeCharacter(item));
  } catch (e) {
    return [];
  }
}

function saveLocalRoster(roster: Character[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roster));
  } catch (e) {
    console.warn("Gagal menyimpan ke localStorage:", e);
  }
}

function normalizeCharacter(item: any): Character {
  return {
    id: item.id || `char_${Date.now()}`,
    owner_id: item.owner_id || "local_user",
    campaign_id: item.campaign_id || null,
    name: item.name || "Karakter Tanpa Nama",
    ekskul_id: item.ekskul_id || item.ekskulId || "kendo",
    subclass_id: item.subclass_id || item.subclassId || null,
    social_class_id: item.social_class_id || item.socialClassId || "medium",
    archetype_id: item.archetype_id || item.archetypeId || "delinquent",
    level: item.level || item.grade || 1,
    avatar_path: item.avatar_path || item.avatar || "",
    abilities: item.abilities || item.baseAbilities || {
      physique: 10, intelligent: 10, looks: 10, mind: 10, talent: 10, luck: 10
    },
    proficient_skills: item.proficient_skills || item.proficientSkills || [],
    proficient_saves: item.proficient_saves || item.proficientSaves || [],
    vitals: item.vitals || {
      physicalHpCurrent: item.physicalHpCurrent ?? 10,
      physicalHpMax: item.physicalHpMax ?? 10,
      physicalHpTemp: item.physicalHpTemp ?? 0,
      composureCurrent: item.composureCurrent ?? 10,
      composureMax: item.composureMax ?? 10,
      composureTemp: item.composureTemp ?? 0,
      restDiceTotal: item.restDiceTotal ?? 1,
      restDiceSpent: item.restDiceSpent ?? 0,
      heartInspiration: item.heartInspiration ?? false
    },
    finances: item.finances || {
      dailyMoneyAmount: item.dailyMoneyAmount ?? 1000,
      savingsAmount: item.savingsAmount ?? 15000,
      job: item.job || "-",
      jobWageAmount: item.jobWageAmount ?? 0
    },
    inventory: item.inventory || {
      bagItems: item.bagItems || [],
      keepsakes: item.keepsakes || ["Jimat Omamori Cinta (Kuil)"]
    },
    backstory_fields: item.backstory_fields || {
      personality: item.personality || "",
      ideals: item.ideals || "",
      bonds: item.bonds || "",
      flaws: item.flaws || "",
      backstory: item.backstory || ""
    },
    version: item.version || 1,
    created_at: item.created_at || new Date().toISOString(),
    updated_at: item.updated_at || new Date().toISOString()
  };
}

export async function listMyCharacters(): Promise<Character[]> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (user?.user) {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("owner_id", user.user.id)
        .order("updated_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return (data || []).map((c: any) => normalizeCharacter(c));
      }
    }
  } catch (e) {
    console.warn("Gagal mengambil karakter dari Supabase, beralih ke cache lokal:", e);
  }

  // Fallback to local storage
  return getLocalRoster();
}

export async function listCampaignCharacters(campaignId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from("characters")
    .select("*, owner_profile:profiles(*)")
    .eq("campaign_id", campaignId)
    .order("updated_at", { ascending: false });

  if (error) return [];
  return (data || []).map((c: any) => normalizeCharacter(c));
}

export async function getCharacter(id: string): Promise<Character | null> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*, owner_profile:profiles(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return normalizeCharacter(data);
    }
  } catch (e) {
    console.warn("Gagal mengambil karakter dari cloud:", e);
  }

  // Fallback to local storage
  const localList = getLocalRoster();
  const found = localList.find(c => c.id === id);
  return found || null;
}

export async function createCharacterRpc(payload: any): Promise<Character> {
  const { data: user } = await supabase.auth.getUser();

  if (user?.user) {
    try {
      const { data, error } = await supabase.rpc("create_character", {
        p_payload: payload
      });

      if (!error && data) {
        return normalizeCharacter(data);
      }
      console.warn("RPC create_character error:", error?.message);
    } catch (e) {
      console.warn("Gagal mengeksekusi RPC create_character di cloud, beralih ke local:", e);
    }
  }

  // Offline / Fallback local character creation
  const eks = FALLBACK_DD_DATA.ekskul.find((e: any) => e.id === payload.ekskulId);
  const soc = FALLBACK_DD_DATA.socialClasses.find((s: any) => s.id === payload.socialClassId);

  const hitDie = eks?.hitDie || "d8";
  const modPhy = Math.floor(((payload.baseAbilities?.physique || 10) - 10) / 2);
  const modMnd = Math.floor(((payload.baseAbilities?.mind || 10) - 10) / 2);

  const baseHp = Math.max(1, (hitDie === "d10" ? 10 : hitDie === "d8" ? 8 : 6) + modPhy);
  const baseComp = Math.max(1, 10 + modMnd);

  const defaultItems = FALLBACK_DD_DATA.equipmentPacks?.student || [];
  const socialItems = soc?.equipment || [];
  const clubItems = (FALLBACK_DD_DATA.equipmentPacks?.clubs as any)?.[payload.ekskulId] || [];
  const allItems = [...defaultItems, ...socialItems, ...clubItems];

  const localChar: Character = {
    id: `char_${Date.now()}`,
    owner_id: user?.user?.id || "local_user",
    campaign_id: payload.campaignId || null,
    name: payload.name,
    ekskul_id: payload.ekskulId,
    subclass_id: payload.subclassId || null,
    social_class_id: payload.socialClassId,
    archetype_id: payload.archetypeId,
    level: payload.grade || 1,
    avatar_path: payload.avatar,
    abilities: payload.baseAbilities,
    proficient_skills: payload.proficientSkills || [],
    proficient_saves: payload.proficientSaves || [],
    vitals: {
      physicalHpCurrent: baseHp,
      physicalHpMax: baseHp,
      physicalHpTemp: 0,
      composureCurrent: baseComp,
      composureMax: baseComp,
      composureTemp: 0,
      restDiceTotal: payload.grade || 1,
      restDiceSpent: 0,
      heartInspiration: false
    },
    finances: {
      dailyMoneyAmount: soc?.allowanceAmount || 1000,
      savingsAmount: soc?.savingsAmount || 15000,
      job: payload.job || "-",
      jobWageAmount: payload.jobWageAmount || 0
    },
    inventory: {
      bagItems: allItems,
      keepsakes: payload.keepsakes || ["Jimat Omamori Cinta (Kuil)"]
    },
    backstory_fields: {
      personality: payload.personality || "",
      ideals: payload.ideals || "",
      bonds: payload.bonds || "",
      flaws: payload.flaws || "",
      backstory: payload.backstory || ""
    },
    version: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const roster = getLocalRoster();
  roster.unshift(localChar);
  saveLocalRoster(roster);

  return localChar;
}

export async function updateCharacterDirect(
  id: string,
  updates: Partial<Character>,
  expectedVersion: number
): Promise<Character> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .update({
        ...updates,
        version: expectedVersion + 1,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("version", expectedVersion)
      .select()
      .single();

    if (!error && data) {
      return normalizeCharacter(data);
    }
  } catch (e) {
    console.warn("Gagal update cloud, mengupdate cache lokal.");
  }

  // Local update fallback
  const roster = getLocalRoster();
  const idx = roster.findIndex(c => c.id === id);
  if (idx >= 0) {
    roster[idx] = {
      ...roster[idx],
      ...updates,
      version: expectedVersion + 1,
      updated_at: new Date().toISOString()
    };
    saveLocalRoster(roster);
    return roster[idx];
  }

  throw new Error("Karakter tidak ditemukan.");
}

export async function deleteCharacter(id: string): Promise<void> {
  try {
    await supabase.from("characters").delete().eq("id", id);
  } catch (e) {
    console.warn("Gagal delete cloud:", e);
  }

  const roster = getLocalRoster().filter(c => c.id !== id);
  saveLocalRoster(roster);
}

// ----------------------------------------------------------------------------
// DM Only: Secrets & Affection Tracker
// ----------------------------------------------------------------------------
export async function getCharacterSecret(characterId: string): Promise<CharacterSecret | null> {
  const { data, error } = await supabase
    .from("character_secrets")
    .select("*")
    .eq("character_id", characterId)
    .single();

  if (error) return null;
  return data as CharacterSecret;
}

export async function updateCharacterSecret(
  characterId: string,
  campaignId: string,
  targets: any[],
  dmNotes: string = ""
): Promise<CharacterSecret> {
  const { data, error } = await supabase
    .from("character_secrets")
    .upsert({
      character_id: characterId,
      campaign_id: campaignId,
      targets,
      dm_notes: dmNotes,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data as CharacterSecret;
}

// ----------------------------------------------------------------------------
// Calendar Progress Tracker
// ----------------------------------------------------------------------------
export async function getCalendarProgress(characterId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from("calendar_progress")
      .select("event_id, done")
      .eq("character_id", characterId)
      .eq("done", true);

    if (!error && data) {
      return data.map((row: any) => row.event_id);
    }
  } catch (e) {
    // fallback
  }
  return [];
}

export async function toggleCalendarEvent(characterId: string, eventId: string, done: boolean): Promise<void> {
  try {
    await supabase
      .from("calendar_progress")
      .upsert({
        character_id: characterId,
        event_id: eventId,
        done,
        completed_at: done ? new Date().toISOString() : null
      });
  } catch (e) {
    console.warn("Gagal sinkron kalender:", e);
  }
}

// ----------------------------------------------------------------------------
// Legacy Data Migration RPC
// ----------------------------------------------------------------------------
export async function importLegacyCharacter(payload: any, campaignId?: string): Promise<string> {
  try {
    const { data, error } = await supabase.rpc("import_legacy_character", {
      p_payload: payload,
      p_campaign_id: campaignId || null
    });

    if (!error && data) return data as string;
  } catch (e) {
    console.warn("Gagal RPC import_legacy_character, menyimpan lokal.");
  }

  // Fallback to local
  const char = normalizeCharacter(payload);
  const roster = getLocalRoster();
  roster.unshift(char);
  saveLocalRoster(roster);
  return char.id;
}
