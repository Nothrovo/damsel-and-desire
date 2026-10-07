import { supabase } from "./supabase";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import type {
  AbilityCompendium,
  EkskulCompendium,
  ArchetypeCompendium,
  SocialClassCompendium,
  BasicActionCompendium,
  CalendarEventCompendium,
  EquipmentPackCompendium
} from "../types";

let cacheAbilities: AbilityCompendium[] | null = null;
let cacheEkskul: EkskulCompendium[] | null = null;
let cacheArchetypes: ArchetypeCompendium[] | null = null;
let cacheSocialClasses: SocialClassCompendium[] | null = null;
let cacheBasicActions: BasicActionCompendium[] | null = null;
let cacheCalendarEvents: CalendarEventCompendium[] | null = null;
let cacheEquipmentPacks: EquipmentPackCompendium[] | null = null;

export async function getCompendiumAbilities(): Promise<AbilityCompendium[]> {
  if (cacheAbilities) return cacheAbilities;
  try {
    const { data, error } = await supabase
      .from("abilities")
      .select("*, skills(*)")
      .order("id");

    if (!error && data && data.length > 0) {
      cacheAbilities = data as AbilityCompendium[];
      return cacheAbilities;
    }
  } catch (err) {
    console.warn("Koneksi Supabase abilities compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback to static rules
  cacheAbilities = Object.values(FALLBACK_DD_DATA.abilities).map((ab: any) => ({
    id: ab.id,
    name: ab.name,
    short_code: ab.short,
    dnd_equiv: ab.dndEquiv,
    description: ab.desc,
    skills: ab.skills.map((sk: any) => ({
      id: sk.id,
      ability_id: ab.id,
      name: sk.name,
      description: sk.desc
    }))
  }));
  return cacheAbilities;
}

export async function getCompendiumEkskul(): Promise<EkskulCompendium[]> {
  if (cacheEkskul) return cacheEkskul;
  try {
    const { data, error } = await supabase
      .from("ekskul")
      .select("*, subclasses:ekskul_subclasses(*), club_moves:ekskul_moves(*)")
      .order("name");

    if (!error && data && data.length > 0) {
      cacheEkskul = data as EkskulCompendium[];
      return cacheEkskul;
    }
  } catch (err) {
    console.warn("Koneksi Supabase ekskul compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheEkskul = FALLBACK_DD_DATA.ekskul.map((e: any) => ({
    id: e.id,
    name: e.name,
    tagline: e.tagline,
    hit_die: e.hitDie,
    primary_stat: e.primaryStat,
    saving_throws: e.savingThrows,
    perk_description: e.perkDesc,
    subclasses: (e.subclasses || []).map((sc: any) => ({
      id: sc.id,
      ekskul_id: e.id,
      name: sc.name,
      description: sc.desc
    })),
    club_moves: (e.clubMoves || []).map((m: any, idx: number) => ({
      id: `${e.id}_move_${idx + 1}`,
      ekskul_id: e.id,
      name: m.name,
      move_type: m.type,
      cost: m.cost,
      range: m.range,
      check_type: m.check,
      effect: m.effect,
      description: m.desc
    }))
  }));
  return cacheEkskul;
}

export async function getCompendiumArchetypes(): Promise<ArchetypeCompendium[]> {
  if (cacheArchetypes) return cacheArchetypes;
  try {
    const { data, error } = await supabase
      .from("archetypes")
      .select("*, archetype_moves(*)")
      .order("name");

    if (!error && data && data.length > 0) {
      cacheArchetypes = data as ArchetypeCompendium[];
      return cacheArchetypes;
    }
  } catch (err) {
    console.warn("Koneksi Supabase archetypes compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheArchetypes = FALLBACK_DD_DATA.archetypes.map((a: any) => ({
    id: a.id,
    name: a.name,
    tagline: a.tagline,
    stat_bonus: a.statBonus,
    perk_description: a.perkDesc,
    archetype_moves: (a.archetypeMoves || []).map((m: any, idx: number) => ({
      id: `${a.id}_move_${idx + 1}`,
      archetype_id: a.id,
      name: m.name,
      move_type: m.type,
      cost: m.cost,
      range: m.range,
      check_type: m.check,
      effect: m.effect,
      description: m.desc
    }))
  }));
  return cacheArchetypes;
}

export async function getCompendiumSocialClasses(): Promise<SocialClassCompendium[]> {
  if (cacheSocialClasses) return cacheSocialClasses;
  try {
    const { data, error } = await supabase
      .from("social_classes")
      .select("*")
      .order("daily_amount", { ascending: false });

    if (!error && data && data.length > 0) {
      cacheSocialClasses = data as SocialClassCompendium[];
      return cacheSocialClasses;
    }
  } catch (err) {
    console.warn("Koneksi Supabase social classes compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheSocialClasses = FALLBACK_DD_DATA.socialClasses.map((s: any) => ({
    id: s.id,
    name: s.name,
    tier: s.id,
    daily_allowance: s.allowance,
    initial_savings: s.savings,
    daily_amount: s.allowanceAmount,
    savings_amount: s.savingsAmount,
    description: s.perkDesc || s.tagline,
    starter_items: s.equipment || []
  }));
  return cacheSocialClasses;
}

export async function getCompendiumBasicActions(): Promise<BasicActionCompendium[]> {
  if (cacheBasicActions) return cacheBasicActions;
  try {
    const { data, error } = await supabase
      .from("basic_actions")
      .select("*")
      .order("id");

    if (!error && data && data.length > 0) {
      cacheBasicActions = data as BasicActionCompendium[];
      return cacheBasicActions;
    }
  } catch (err) {
    console.warn("Koneksi Supabase basic actions compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheBasicActions = FALLBACK_DD_DATA.basicActions.map((ba: any, idx: number) => ({
    id: `action_${idx + 1}`,
    name: ba.name,
    category: ba.category,
    cost: ba.cost,
    check_type: ba.check,
    effect: ba.effect,
    description: ba.desc
  }));
  return cacheBasicActions;
}

export async function getCompendiumCalendarEvents(): Promise<CalendarEventCompendium[]> {
  if (cacheCalendarEvents) return cacheCalendarEvents;
  try {
    const { data, error } = await supabase
      .from("calendar_events")
      .select("*")
      .order("id");

    if (!error && data && data.length > 0) {
      cacheCalendarEvents = data as CalendarEventCompendium[];
      return cacheCalendarEvents;
    }
  } catch (err) {
    console.warn("Koneksi Supabase calendar events compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheCalendarEvents = FALLBACK_DD_DATA.calendarEvents.map((ce: any) => ({
    id: ce.id,
    term: ce.term,
    name: ce.name,
    event_type: ce.type,
    description: ce.desc
  }));
  return cacheCalendarEvents;
}

export async function getCompendiumEquipmentPacks(): Promise<EquipmentPackCompendium[]> {
  if (cacheEquipmentPacks) return cacheEquipmentPacks;
  try {
    const { data, error } = await supabase
      .from("equipment_packs")
      .select("*")
      .order("id");

    if (!error && data && data.length > 0) {
      cacheEquipmentPacks = data as EquipmentPackCompendium[];
      return cacheEquipmentPacks;
    }
  } catch (err) {
    console.warn("Koneksi Supabase equipment packs compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  const packs: EquipmentPackCompendium[] = [];
  if (FALLBACK_DD_DATA.equipmentPacks) {
    if (FALLBACK_DD_DATA.equipmentPacks.student) {
      packs.push({
        id: "student",
        name: "Tas Sekolah Standar",
        category: "default",
        items: FALLBACK_DD_DATA.equipmentPacks.student
      });
    }
    if (FALLBACK_DD_DATA.equipmentPacks.clubs) {
      for (const [k, items] of Object.entries(FALLBACK_DD_DATA.equipmentPacks.clubs)) {
        packs.push({
          id: `club_${k}`,
          name: `Perlengkapan Klub: ${k}`,
          category: "club",
          items: items as string[]
        });
      }
    }
    if (FALLBACK_DD_DATA.equipmentPacks.archetypes) {
      for (const [k, items] of Object.entries(FALLBACK_DD_DATA.equipmentPacks.archetypes)) {
        packs.push({
          id: `archetype_${k}`,
          name: `Perlengkapan Arketip: ${k}`,
          category: "archetype",
          items: items as string[]
        });
      }
    }
  }
  cacheEquipmentPacks = packs;
  return cacheEquipmentPacks;
}
