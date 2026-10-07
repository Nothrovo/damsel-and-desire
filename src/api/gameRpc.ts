import { supabase } from "./supabase";
import type { RollLogEntry } from "../types";

export async function shortRestRpc(characterId: string, currentVersion: number) {
  const { data, error } = await supabase.rpc("short_rest", {
    p_character_id: characterId,
    p_client_version: currentVersion
  });
  if (error) throw error;
  return data;
}

export async function longRestRpc(characterId: string, currentVersion: number) {
  const { data, error } = await supabase.rpc("long_rest", {
    p_character_id: characterId,
    p_client_version: currentVersion
  });
  if (error) throw error;
  return data;
}

export async function adjustSavingsRpc(
  characterId: string,
  deltaRupiah: number,
  currentVersion: number,
  note: string = ""
) {
  const { data, error } = await supabase.rpc("adjust_savings", {
    p_character_id: characterId,
    p_delta_rupiah: deltaRupiah,
    p_client_version: currentVersion,
    p_note: note
  });
  if (error) throw error;
  return data;
}

export async function applyVitalChangeRpc(
  characterId: string,
  type: 'phys' | 'composure',
  delta: number,
  currentVersion: number
) {
  const { data, error } = await supabase.rpc("apply_vital_change", {
    p_character_id: characterId,
    p_type: type,
    p_delta: delta,
    p_client_version: currentVersion
  });
  if (error) throw error;
  return data;
}

export async function rollDiceRpc(
  campaignId: string,
  characterId: string | null,
  dice: string,
  mode: 'normal' | 'advantage' | 'disadvantage' = 'normal',
  label: string = "",
  modifier: number = 0
): Promise<RollLogEntry> {
  const { data, error } = await supabase.rpc("roll_dice", {
    p_campaign_id: campaignId,
    p_character_id: characterId,
    p_dice: dice,
    p_mode: mode,
    p_label: label,
    p_modifier: modifier
  });
  if (error) throw error;
  return data;
}

export async function getRollLogs(campaignId: string, limit: number = 50): Promise<RollLogEntry[]> {
  const { data, error } = await supabase
    .from("roll_log")
    .select("*, user_profile:profiles(*)")
    .eq("campaign_id", campaignId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as RollLogEntry[];
}
