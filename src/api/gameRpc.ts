import { supabase } from "./supabase";
import { characterStore } from "../store/characterStore";
import type { RollLogEntry } from "../types";
import { resetFeatUsage, calculateEffectiveStats } from "../rules/progression";

export async function shortRestRpc(characterId: string, currentVersion: number) {
  let char = characterStore.currentCharacter;
  try {
    const { data, error } = await supabase.rpc("short_rest", {
      p_character_id: characterId,
      p_client_version: currentVersion
    });
    if (!error && data) {
      if (char) {
        char = resetFeatUsage(char, "short_rest");
        char.vitals = data.vitals || char.vitals;
        characterStore.setCurrentCharacter(char);
      }
      return { ...data, featUsage: char?.featUsage };
    }
  } catch (e) {
    console.warn("RPC short_rest gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  if (!char) throw new Error("Karakter tidak ditemukan.");

  const dieFaces = char.ekskul_id === "kendo" || char.ekskul_id === "martial_arts" ? 10 : 8;
  const roll = Math.floor(Math.random() * dieFaces) + 1;
  const effective = calculateEffectiveStats(char);
  const modPhy = effective.modifiers.physique;
  const heal = Math.max(1, roll + modPhy);

  const newHp = Math.min(char.vitals.physicalHpMax, char.vitals.physicalHpCurrent + heal);
  const newComp = Math.min(char.vitals.composureMax, char.vitals.composureCurrent + heal);
  const spent = char.vitals.restDiceSpent + 1;

  char.vitals.physicalHpCurrent = newHp;
  char.vitals.composureCurrent = newComp;
  char.vitals.restDiceSpent = spent;

  char = resetFeatUsage(char, "short_rest");
  characterStore.setCurrentCharacter(char);

  return {
    characterId,
    dieRolled: `d${dieFaces}`,
    rollResult: roll,
    modPhysique: modPhy,
    healTotal: heal,
    vitals: char.vitals,
    featUsage: char.featUsage,
    newVersion: currentVersion + 1
  };
}

export async function longRestRpc(characterId: string, currentVersion: number) {
  let char = characterStore.currentCharacter;
  try {
    const { data, error } = await supabase.rpc("long_rest", {
      p_character_id: characterId,
      p_client_version: currentVersion
    });
    if (!error && data) {
      if (char) {
        char = resetFeatUsage(char, "long_rest");
        const effective = calculateEffectiveStats(char);
        const hasGymBro = (char.feats || []).some(f => f.featId === "gym_bro");
        if (hasGymBro) {
          const currentTemp = char.vitals.physicalHpTemp || 0;
          char.vitals.physicalHpTemp = Math.max(currentTemp, effective.proficiencyBonus);
        }
        const hasEarlyBird = (char.feats || []).some(f => f.featId === "early_bird");
        if (hasEarlyBird) {
          const currentTempComp = char.vitals.composureTemp || 0;
          char.vitals.composureTemp = Math.max(currentTempComp, effective.proficiencyBonus);
        }
        char.vitals = data.vitals || char.vitals;
        char.finances = data.finances || char.finances;
        characterStore.setCurrentCharacter(char);
      }
      return { ...data, featUsage: char?.featUsage };
    }
  } catch (e) {
    console.warn("RPC long_rest gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  if (!char) throw new Error("Karakter tidak ditemukan.");

  char.vitals.physicalHpCurrent = char.vitals.physicalHpMax;
  char.vitals.composureCurrent = char.vitals.composureMax;
  char.vitals.restDiceSpent = 0;

  char = resetFeatUsage(char, "long_rest");

  const effective = calculateEffectiveStats(char);
  const hasGymBro = (char.feats || []).some(f => f.featId === "gym_bro");
  if (hasGymBro) {
    const currentTemp = char.vitals.physicalHpTemp || 0;
    char.vitals.physicalHpTemp = Math.max(currentTemp, effective.proficiencyBonus);
  }
  const hasEarlyBird = (char.feats || []).some(f => f.featId === "early_bird");
  if (hasEarlyBird) {
    const currentTempComp = char.vitals.composureTemp || 0;
    char.vitals.composureTemp = Math.max(currentTempComp, effective.proficiencyBonus);
  }

  // Hustler feat: +50% uang saku harian
  const hasHustler = (char.feats || []).some(f => f.featId === "hustler");
  const baseDaily = char.finances.dailyMoneyAmount || 0;
  const daily = hasHustler ? Math.floor(baseDaily * 1.5) : baseDaily;
  const wage = char.finances.jobWageAmount || 0;
  char.finances.savingsAmount += daily + wage;

  characterStore.setCurrentCharacter(char);

  return {
    characterId,
    vitals: char.vitals,
    finances: char.finances,
    featUsage: char.featUsage,
    depositDaily: daily,
    depositWage: wage,
    totalAdded: daily + wage,
    newVersion: currentVersion + 1
  };
}

export async function adjustSavingsRpc(
  characterId: string,
  deltaRupiah: number,
  currentVersion: number,
  note: string = ""
) {
  try {
    const { data, error } = await supabase.rpc("adjust_savings", {
      p_character_id: characterId,
      p_delta_rupiah: deltaRupiah,
      p_client_version: currentVersion,
      p_note: note
    });
    if (!error && data) return data;
  } catch (e) {
    console.warn("RPC adjust_savings gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  const char = characterStore.currentCharacter;
  if (!char) throw new Error("Karakter tidak ditemukan.");

  const deltaYen = Math.floor(deltaRupiah / 100);
  const newSavings = Math.max(0, char.finances.savingsAmount + deltaYen);
  char.finances.savingsAmount = newSavings;

  return {
    characterId,
    deltaYen,
    deltaRupiah,
    newSavingsAmount: newSavings,
    note,
    newVersion: currentVersion + 1
  };
}

export async function applyVitalChangeRpc(
  characterId: string,
  type: 'phys' | 'composure',
  delta: number,
  currentVersion: number
) {
  try {
    const { data, error } = await supabase.rpc("apply_vital_change", {
      p_character_id: characterId,
      p_type: type,
      p_delta: delta,
      p_client_version: currentVersion
    });
    if (!error && data) return data;
  } catch (e) {
    console.warn("RPC apply_vital_change gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  const char = characterStore.currentCharacter;
  if (!char) throw new Error("Karakter tidak ditemukan.");

  if (type === "phys") {
    char.vitals.physicalHpCurrent = Math.max(0, Math.min(char.vitals.physicalHpMax, char.vitals.physicalHpCurrent + delta));
  } else {
    char.vitals.composureCurrent = Math.max(0, Math.min(char.vitals.composureMax, char.vitals.composureCurrent + delta));
  }

  return {
    characterId,
    type,
    delta,
    newVitals: char.vitals,
    newVersion: currentVersion + 1
  };
}

export async function rollDiceRpc(
  campaignId: string,
  characterId: string | null,
  dice: string,
  mode: 'normal' | 'advantage' | 'disadvantage' = 'normal',
  label: string = "",
  modifier: number = 0
): Promise<RollLogEntry> {
  try {
    const { data, error } = await supabase.rpc("roll_dice", {
      p_campaign_id: campaignId,
      p_character_id: characterId,
      p_dice: dice,
      p_mode: mode,
      p_label: label,
      p_modifier: modifier
    });
    if (!error && data) return data;
  } catch (e) {
    console.warn("RPC roll_dice gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  const faces = parseInt(dice.replace("d", "")) || 20;
  const r1 = Math.floor(Math.random() * faces) + 1;
  let res = r1;
  let r2 = null;

  if (mode === "advantage") {
    r2 = Math.floor(Math.random() * faces) + 1;
    res = Math.max(r1, r2);
  } else if (mode === "disadvantage") {
    r2 = Math.floor(Math.random() * faces) + 1;
    res = Math.min(r1, r2);
  }

  const total = res + modifier;

  return {
    id: `local_log_${Date.now()}`,
    campaign_id: campaignId,
    character_id: characterId,
    user_id: "local_user",
    dice,
    result: res,
    modifiers: { modifier, firstRoll: r1, secondRoll: r2 },
    total,
    mode,
    label,
    created_at: new Date().toISOString()
  };
}

export async function getRollLogs(campaignId: string, limit: number = 50): Promise<RollLogEntry[]> {
  try {
    const { data, error } = await supabase
      .from("roll_log")
      .select("*, user_profile:profiles(*)")
      .eq("campaign_id", campaignId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data) return data as RollLogEntry[];
  } catch (e) {
    // fallback
  }
  return [];
}
