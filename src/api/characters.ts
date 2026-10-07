import { supabase } from "./supabase";
import type { Character, CharacterSecret, CalendarProgress } from "../types";

export async function listMyCharacters(): Promise<Character[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return [];

  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("owner_id", user.user.id)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Character[];
}

export async function listCampaignCharacters(campaignId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from("characters")
    .select("*, owner_profile:profiles(*)")
    .eq("campaign_id", campaignId)
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data || []) as Character[];
}

export async function getCharacter(id: string): Promise<Character | null> {
  const { data, error } = await supabase
    .from("characters")
    .select("*, owner_profile:profiles(*)")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Gagal mengambil karakter:", error);
    return null;
  }
  return data as Character;
}

export async function createCharacterRpc(payload: any): Promise<Character> {
  const { data, error } = await supabase.rpc("create_character", {
    p_payload: payload
  });

  if (error) throw error;
  return data as Character;
}

export async function updateCharacterDirect(
  id: string,
  updates: Partial<Character>,
  expectedVersion: number
): Promise<Character> {
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

  if (error) {
    if (error.code === "PGRST116") {
      throw new Error("ERR_CONCURRENCY_CONFLICT: Versi data karakter telah berubah di perangkat lain.");
    }
    throw error;
  }
  return data as Character;
}

export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase
    .from("characters")
    .delete()
    .eq("id", id);

  if (error) throw error;
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

  if (error) {
    // If user is not DM, RLS returns nothing or error
    return null;
  }
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
  const { data, error } = await supabase
    .from("calendar_progress")
    .select("event_id, done")
    .eq("character_id", characterId)
    .eq("done", true);

  if (error) return [];
  return (data || []).map((row: any) => row.event_id);
}

export async function toggleCalendarEvent(characterId: string, eventId: string, done: boolean): Promise<void> {
  const { error } = await supabase
    .from("calendar_progress")
    .upsert({
      character_id: characterId,
      event_id: eventId,
      done,
      completed_at: done ? new Date().toISOString() : null
    });

  if (error) throw error;
}

// ----------------------------------------------------------------------------
// Legacy Data Migration RPC
// ----------------------------------------------------------------------------
export async function importLegacyCharacter(payload: any, campaignId?: string): Promise<string> {
  const { data, error } = await supabase.rpc("import_legacy_character", {
    p_payload: payload,
    p_campaign_id: campaignId || null
  });

  if (error) throw error;
  return data as string;
}
