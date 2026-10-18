import { supabase } from "./supabase";
import { characterStore } from "../store/characterStore";
import type { RollLogEntry, LongRestRpcResult, AdjustSavingsRpcResult } from "../types";
import { resetFeatUsage, calculateEffectiveStats } from "../rules/progression";

export async function shortRestRpc(characterId: string, currentVersion: number) {
  let char = characterStore.currentCharacter;
  try {
    let { data, error } = await supabase.rpc("short_rest", {
      p_character_id: characterId,
      p_client_version: currentVersion
    });

    if (error && (error.message.includes("ERR_CONCURRENCY_CONFLICT") || error.message.includes("Versi data karakter"))) {
      const { data: latest } = await supabase.from("characters").select("version").eq("id", characterId).single();
      if (latest && typeof latest.version === "number") {
        const retry = await supabase.rpc("short_rest", {
          p_character_id: characterId,
          p_client_version: latest.version
        });
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }
    }

    if (!error && data) {
      if (char) {
        char = resetFeatUsage(char, "short_rest");
        char.vitals = data.vitals || char.vitals;
        if (data.newVersion) {
          char.version = data.newVersion;
        }
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

export async function longRestRpc(
  characterId: string,
  currentVersion: number
): Promise<LongRestRpcResult> {
  let char = characterStore.currentCharacter;
  try {
    let { data, error } = await supabase.rpc("long_rest", {
      p_character_id: characterId,
      p_client_version: currentVersion
    });

    if (error && (error.message.includes("ERR_CONCURRENCY_CONFLICT") || error.message.includes("Versi data karakter"))) {
      const { data: latest } = await supabase.from("characters").select("version").eq("id", characterId).single();
      if (latest && typeof latest.version === "number") {
        const retry = await supabase.rpc("long_rest", {
          p_character_id: characterId,
          p_client_version: latest.version
        });
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }
    }

    if (error) {
      if (error.message && (error.message.includes("ERR_") || error.message.includes("Versi"))) {
        throw new Error(error.message);
      }
      console.warn("RPC long_rest error di cloud:", error.message);
    } else if (data) {
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

        // Jika fungsi Cloud belum memotong biaya hidup (data.livingCost undefined), potong ¥300 secara lokal
        if (data.livingCost === undefined) {
          const livingCost = 300;
          char.finances.savingsAmount = Math.max(0, (char.finances.savingsAmount || 0) - livingCost);
        }

        if (data.newVersion) {
          char.version = data.newVersion;
        }

        characterStore.setCurrentCharacter(char);
      }
      return {
        ...data,
        livingCost: data.livingCost ?? 300,
        netFinancialChange: data.netFinancialChange ?? ((data.totalAdded ?? (char?.finances?.dailyMoneyAmount || 0)) - 300),
        totalAdded: data.totalAdded ?? 0,
        featUsage: char?.featUsage
      };
    }
  } catch (e: any) {
    if (e.message && (e.message.includes("ERR_") || e.message.includes("Versi"))) {
      throw e;
    }
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
  const livingCost = 300; // Biaya hidup sehari-hari SMA Housen (300 Yen)
  const netChange = daily + wage - livingCost;
  char.finances.savingsAmount = Math.max(0, (char.finances.savingsAmount || 0) + netChange);

  characterStore.setCurrentCharacter(char);

  return {
    characterId,
    vitals: char.vitals,
    finances: char.finances,
    featUsage: char.featUsage,
    depositDaily: daily,
    depositWage: wage,
    livingCost,
    netFinancialChange: netChange,
    totalAdded: netChange,
    newVersion: currentVersion + 1
  };
}

export async function adjustSavingsRpc(
  characterId: string,
  deltaRupiah: number,
  currentVersion: number,
  note: string = "",
  deltaYen?: number
): Promise<AdjustSavingsRpcResult> {
  const computedDeltaYen = deltaYen !== undefined ? deltaYen : Math.trunc(deltaRupiah / 100);

  try {
    const params: any = {
      p_character_id: characterId,
      p_delta_rupiah: deltaRupiah !== 0 ? deltaRupiah : computedDeltaYen * 100,
      p_client_version: currentVersion,
      p_note: note
    };
    if (deltaYen !== undefined) {
      params.p_delta_yen = deltaYen;
    }
    let { data, error } = await supabase.rpc("adjust_savings", params);

    // Jika cloud tidak mengenali signature 5-parameter (p_delta_yen), coba retry dengan signature standar 4-parameter
    if (error && (error.message.includes("schema cache") || error.message.includes("Could not find the function")) && params.p_delta_yen !== undefined) {
      const fallbackParams = { ...params };
      delete fallbackParams.p_delta_yen;
      const retry = await supabase.rpc("adjust_savings", fallbackParams);
      if (!retry.error && retry.data) {
        data = retry.data;
        error = null;
      }
    }

    if (error && (error.message.includes("ERR_CONCURRENCY_CONFLICT") || error.message.includes("Versi data karakter"))) {
      const { data: latest } = await supabase.from("characters").select("version").eq("id", characterId).single();
      if (latest && typeof latest.version === "number") {
        params.p_client_version = latest.version;
        let retry = await supabase.rpc("adjust_savings", params);
        if (retry.error && (retry.error.message.includes("schema cache") || retry.error.message.includes("Could not find the function")) && params.p_delta_yen !== undefined) {
          const fallbackParams = { ...params };
          delete fallbackParams.p_delta_yen;
          retry = await supabase.rpc("adjust_savings", fallbackParams);
        }
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }
    }

    if (error) {
      if (error.message && (error.message.includes("ERR_") || error.message.includes("saldo") || error.message.includes("Versi"))) {
        throw new Error(error.message);
      }
      console.warn("RPC adjust_savings error di cloud:", error.message);
    } else if (data) {
      const char = characterStore.currentCharacter;
      if (char) {
        if (data.finances) {
          char.finances = data.finances;
        } else if (data.newSavingsAmount !== undefined) {
          char.finances.savingsAmount = data.newSavingsAmount;
        }
        if (data.newVersion) {
          char.version = data.newVersion;
        }
        characterStore.setCurrentCharacter(char);
      }
      return {
        ...data,
        deltaYen: data.deltaYen ?? computedDeltaYen,
        deltaRupiah: data.deltaRupiah ?? deltaRupiah,
        finances: data.finances || char?.finances
      };
    }
  } catch (e: any) {
    if (e.message && (e.message.includes("ERR_") || e.message.includes("saldo") || e.message.includes("Versi"))) {
      throw e;
    }
    console.warn("RPC adjust_savings gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  const char = characterStore.currentCharacter;
  if (!char) throw new Error("Karakter tidak ditemukan.");

  const currentSavings = char.finances.savingsAmount || 0;
  const newSavings = currentSavings + computedDeltaYen;
  if (newSavings < 0) {
    throw new Error(`ERR_INSUFFICIENT_FUNDS: Saldo tabungan tidak mencukupi untuk transaksi ini (Saldo: ¥${currentSavings.toLocaleString()}, Transaksi: ¥${computedDeltaYen.toLocaleString()}).`);
  }
  char.finances.savingsAmount = newSavings;

  return {
    characterId,
    deltaYen: computedDeltaYen,
    deltaRupiah,
    newSavingsAmount: newSavings,
    finances: char.finances,
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
    let { data, error } = await supabase.rpc("apply_vital_change", {
      p_character_id: characterId,
      p_type: type,
      p_delta: delta,
      p_client_version: currentVersion
    });

    if (error && (error.message.includes("ERR_CONCURRENCY_CONFLICT") || error.message.includes("Versi data karakter"))) {
      const { data: latest } = await supabase.from("characters").select("version").eq("id", characterId).single();
      if (latest && typeof latest.version === "number") {
        const retry = await supabase.rpc("apply_vital_change", {
          p_character_id: characterId,
          p_type: type,
          p_delta: delta,
          p_client_version: latest.version
        });
        if (!retry.error && retry.data) {
          data = retry.data;
          error = null;
        }
      }
    }

    if (!error && data) return data;
  } catch (e) {
    console.warn("RPC apply_vital_change gagal di cloud, fallback lokal:", e);
  }

  // Local fallback
  const char = characterStore.currentCharacter;
  if (!char) throw new Error("Karakter tidak ditemukan.");

  return {
    characterId,
    type,
    delta,
    newVitals: char.vitals,
    newVersion: (char.version || currentVersion) + 1
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
