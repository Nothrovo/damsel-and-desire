import { supabase } from "./supabase";
import type { Character, CharacterSecret, CalendarProgress } from "../types";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import { migrateCharacter, migrateCharacterToV3, ensureGradeFeatGrants } from "../rules/migration";
import { calculateMaxHp, calculateMaxComposure } from "../rules/progression";

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

function isUuid(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id || "");
}

function normalizeCharacter(item: any): Character {
  const char = migrateCharacterToV3(item).character;
  if (typeof item?.version === "number") {
    char.version = item.version;
  }
  return char;
}

function toDbCharacterInsert(char: Character): Record<string, any> {
  return {
    owner_id: isUuid(char.owner_id) ? char.owner_id : null,
    campaign_id: char.campaign_id && isUuid(char.campaign_id) ? char.campaign_id : null,
    name: char.name,
    ekskul_id: char.ekskul_id,
    subclass_id: char.subclass_id || null,
    social_class_id: char.social_class_id,
    archetype_id: char.archetype_id,
    level: Math.max(1, Math.min(6, char.level || 1)),
    grade: char.grade || (char.level <= 2 ? 10 : char.level <= 4 ? 11 : 12),
    schema_version: char.schemaVersion || 3,
    changelog: char.changelog || [],
    avatar_path: char.avatar_path || "",
    abilities: char.abilities,
    proficient_skills: char.proficient_skills || [],
    proficient_saves: char.proficient_saves || [],
    feats: char.feats || [],
    feat_grants: char.featGrants || char.feat_grants || ensureGradeFeatGrants(char.grade || 10, []),
    achievements: char.achievements || [],
    feat_usage: char.featUsage || char.feat_usage || {},
    vitals: char.vitals,
    finances: char.finances,
    inventory: char.inventory,
    backstory_fields: char.backstory_fields,
    version: char.version || 1
  };
}

function sanitizeDbUpdates(updates: Partial<Character>): Record<string, any> {
  const clean: Record<string, any> = {};
  const allowedColumns = new Set([
    "owner_id",
    "campaign_id",
    "name",
    "ekskul_id",
    "subclass_id",
    "social_class_id",
    "archetype_id",
    "level",
    "grade",
    "schema_version",
    "changelog",
    "avatar_path",
    "abilities",
    "proficient_skills",
    "proficient_saves",
    "feats",
    "feat_grants",
    "achievements",
    "feat_usage",
    "vitals",
    "finances",
    "inventory",
    "backstory_fields",
    "version",
    "updated_at"
  ]);

  const raw = updates as Record<string, any>;
  if (raw.featGrants !== undefined && raw.feat_grants === undefined) {
    clean.feat_grants = raw.featGrants;
  }
  if (raw.featUsage !== undefined && raw.feat_usage === undefined) {
    clean.feat_usage = raw.featUsage;
  }
  if (raw.schemaVersion !== undefined && raw.schema_version === undefined) {
    clean.schema_version = raw.schemaVersion;
  }

  for (const [k, v] of Object.entries(raw)) {
    if (allowedColumns.has(k) && v !== undefined) {
      clean[k] = v;
    }
  }
  return clean;
}

export async function listAllCharacters(): Promise<Character[]> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("updated_at", { ascending: false });

    if (!error && data) {
      const remote = (data || []).map((c: any) => normalizeCharacter(c));
      const local = getLocalRoster();

      // Auto-sync any local-only characters (e.g. created while offline or before RLS open access)
      const remoteNames = new Set(remote.map(r => (r.name || "").trim().toLowerCase()));
      const remoteIds = new Set(remote.map(r => r.id));
      let localSynced = false;

      for (const localChar of local) {
        const normName = (localChar.name || "").trim().toLowerCase();
        const isLocalOnlyId = !isUuid(localChar.id);

        if (isLocalOnlyId && normName && !remoteNames.has(normName)) {
          try {
            const { data: inserted, error: insertErr } = await supabase
              .from("characters")
              .insert(toDbCharacterInsert(localChar))
              .select("*")
              .single();

            if (!insertErr && inserted) {
              const syncedChar = normalizeCharacter(inserted);
              remote.unshift(syncedChar);
              remoteNames.add(normName);
              remoteIds.add(syncedChar.id);
              localSynced = true;
            }
          } catch (syncErr) {
            console.warn("Gagal sinkronisasi karakter lokal ke Supabase:", syncErr);
          }
        }
      }

      // Keep any truly unsynced local-only characters if upload failed, otherwise mirror remote
      const remainingUnsynced = local.filter(
        l => !isUuid(l.id) && !remoteNames.has((l.name || "").trim().toLowerCase())
      );
      const merged = [...remote, ...remainingUnsynced];
      saveLocalRoster(merged);
      return merged;
    }
  } catch (e) {
    console.warn("Gagal mengambil karakter dari Supabase, beralih ke cache lokal:", e);
  }

  // Fallback to local storage
  return getLocalRoster();
}

export const listMyCharacters = listAllCharacters;

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
  if (isUuid(id)) {
    try {
      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        const normalized = normalizeCharacter(data);
        const roster = getLocalRoster();
        const idx = roster.findIndex(c => c.id === id);
        if (idx >= 0) {
          roster[idx] = normalized;
        } else {
          roster.unshift(normalized);
        }
        saveLocalRoster(roster);
        return normalized;
      }
    } catch (e) {
      console.warn("Gagal mengambil karakter dari cloud:", e);
    }
  }

  // Fallback to local storage (and sync if local ID)
  const localList = getLocalRoster();
  const found = localList.find(c => c.id === id);
  if (found && !isUuid(found.id)) {
    try {
      const { data: existing } = await supabase
        .from("characters")
        .select("*")
        .ilike("name", found.name.trim())
        .limit(1)
        .maybeSingle();

      if (existing) {
        return normalizeCharacter(existing);
      }

      const { data: inserted, error: insertErr } = await supabase
        .from("characters")
        .insert(toDbCharacterInsert(found))
        .select("*")
        .single();

      if (!insertErr && inserted) {
        const synced = normalizeCharacter(inserted);
        const updatedRoster = localList.map(c => (c.id === id ? synced : c));
        saveLocalRoster(updatedRoster);
        return synced;
      }
    } catch (e) {
      // ignore and return local
    }
  }
  return found || null;
}

export async function createCharacterRpc(payload: any): Promise<Character> {
  try {
    const { data, error } = await supabase.rpc("create_character", {
      p_payload: payload
    });

    if (!error && data) {
      const created = normalizeCharacter(data);
      const roster = getLocalRoster().filter(c => c.id !== created.id);
      roster.unshift(created);
      saveLocalRoster(roster);
      return created;
    }
    if (error) console.warn("RPC create_character info:", error.message);
  } catch (e) {
    console.warn("Gagal mengeksekusi RPC create_character di cloud, mencoba insert langsung:", e);
  }

  // Build normalized character structure
  const eks = FALLBACK_DD_DATA.ekskul.find((e: any) => e.id === payload.ekskulId);
  const soc = FALLBACK_DD_DATA.socialClasses.find((s: any) => s.id === payload.socialClassId);

  const hitDie = eks?.hitDie || "d8";
  const charLevel = payload.level || (payload.grade === 2 ? 2 : 1);
  const charGrade = charLevel <= 2 ? 10 : charLevel <= 4 ? 11 : 12;
  const isDelinquent = payload.archetypeId === "delinquent";
  const phyScore = payload.baseAbilities?.physique || 10;
  const mndScore = payload.baseAbilities?.mind || 10;

  const baseHp = calculateMaxHp(charLevel, hitDie, phyScore, isDelinquent);
  const baseComp = calculateMaxComposure(charLevel, mndScore);

  const defaultItems = FALLBACK_DD_DATA.equipmentPacks?.student || [];
  const socialItems = soc?.equipment || [];
  const clubItems = (FALLBACK_DD_DATA.equipmentPacks?.clubs as any)?.[payload.ekskulId] || [];
  const allItems = [...defaultItems, ...socialItems, ...clubItems];

  const localChar: Character = {
    id: `char_${Date.now()}`,
    owner_id: payload.ownerId || "public",
    campaign_id: payload.campaignId || null,
    name: payload.name,
    ekskul_id: payload.ekskulId,
    subclass_id: payload.subclassId || null,
    social_class_id: payload.socialClassId,
    archetype_id: payload.archetypeId,
    level: charLevel,
    grade: charGrade,
    schemaVersion: 3,
    changelog: [],
    avatar_path: payload.avatar,
    abilities: payload.baseAbilities,
    proficient_skills: payload.proficientSkills || [],
    proficient_saves: payload.proficientSaves || [],
    feats: payload.feats || [],
    featGrants: payload.featGrants || ensureGradeFeatGrants(charGrade, []),
    feat_grants: payload.featGrants || ensureGradeFeatGrants(charGrade, []),
    achievements: payload.achievements || [],
    featUsage: payload.featUsage || {},
    feat_usage: payload.featUsage || {},
    vitals: {
      physicalHpCurrent: baseHp,
      physicalHpMax: baseHp,
      physicalHpTemp: 0,
      composureCurrent: baseComp,
      composureMax: baseComp,
      composureTemp: 0,
      restDiceTotal: charGrade === 10 ? 1 : charGrade === 11 ? 2 : 3,
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

  // Fallback 1: Direct table insert to Supabase before falling back to offline localStorage
  try {
    const { data: inserted, error: insertError } = await supabase
      .from("characters")
      .insert(toDbCharacterInsert(localChar))
      .select("*")
      .single();

    if (!insertError && inserted) {
      const created = normalizeCharacter(inserted);
      const roster = getLocalRoster().filter(c => c.id !== created.id);
      roster.unshift(created);
      saveLocalRoster(roster);
      return created;
    }
  } catch (e) {
    console.warn("Direct insert ke Supabase gagal, menyimpan ke localStorage:", e);
  }

  // Fallback 2: Offline localStorage
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
  const cleanUpdates = sanitizeDbUpdates(updates);
  const nextVersion = (expectedVersion || 1) + 1;

  if (isUuid(id)) {
    try {
      const { data, error } = await supabase
        .from("characters")
        .update({
          ...cleanUpdates,
          version: nextVersion,
          updated_at: new Date().toISOString()
        })
        .eq("id", id)
        .select("*")
        .single();

      if (!error && data) {
        const updated = normalizeCharacter(data);
        const roster = getLocalRoster();
        const idx = roster.findIndex(c => c.id === id);
        if (idx >= 0) {
          roster[idx] = updated;
        } else {
          roster.unshift(updated);
        }
        saveLocalRoster(roster);
        return updated;
      }
    } catch (e) {
      console.warn("Gagal update cloud, mengupdate cache lokal.");
    }
  }

  // Local update fallback
  const roster = getLocalRoster();
  const idx = roster.findIndex(c => c.id === id);
  if (idx >= 0) {
    roster[idx] = normalizeCharacter({
      ...roster[idx],
      ...updates,
      version: nextVersion,
      updated_at: new Date().toISOString()
    });
    saveLocalRoster(roster);
    return roster[idx];
  }

  throw new Error("Karakter tidak ditemukan.");
}

export async function deleteCharacter(id: string): Promise<void> {
  if (isUuid(id)) {
    try {
      await supabase.from("characters").delete().eq("id", id);
    } catch (e) {
      console.warn("Gagal delete cloud:", e);
    }
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
