import { supabase } from "./supabase";
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
  const { data, error } = await supabase
    .from("abilities")
    .select("*, skills(*)")
    .order("id");

  if (error || !data) {
    console.warn("Gagal memuat abilities compendium:", error);
    return [];
  }
  cacheAbilities = data as AbilityCompendium[];
  return cacheAbilities;
}

export async function getCompendiumEkskul(): Promise<EkskulCompendium[]> {
  if (cacheEkskul) return cacheEkskul;
  const { data, error } = await supabase
    .from("ekskul")
    .select("*, subclasses:ekskul_subclasses(*), club_moves:ekskul_moves(*)")
    .order("name");

  if (error || !data) {
    console.warn("Gagal memuat ekskul compendium:", error);
    return [];
  }
  cacheEkskul = data as EkskulCompendium[];
  return cacheEkskul;
}

export async function getCompendiumArchetypes(): Promise<ArchetypeCompendium[]> {
  if (cacheArchetypes) return cacheArchetypes;
  const { data, error } = await supabase
    .from("archetypes")
    .select("*, archetype_moves(*)")
    .order("name");

  if (error || !data) {
    console.warn("Gagal memuat archetypes compendium:", error);
    return [];
  }
  cacheArchetypes = data as ArchetypeCompendium[];
  return cacheArchetypes;
}

export async function getCompendiumSocialClasses(): Promise<SocialClassCompendium[]> {
  if (cacheSocialClasses) return cacheSocialClasses;
  const { data, error } = await supabase
    .from("social_classes")
    .select("*")
    .order("daily_amount", { ascending: false });

  if (error || !data) {
    console.warn("Gagal memuat social classes compendium:", error);
    return [];
  }
  cacheSocialClasses = data as SocialClassCompendium[];
  return cacheSocialClasses;
}

export async function getCompendiumBasicActions(): Promise<BasicActionCompendium[]> {
  if (cacheBasicActions) return cacheBasicActions;
  const { data, error } = await supabase
    .from("basic_actions")
    .select("*")
    .order("id");

  if (error || !data) {
    console.warn("Gagal memuat basic actions compendium:", error);
    return [];
  }
  cacheBasicActions = data as BasicActionCompendium[];
  return cacheBasicActions;
}

export async function getCompendiumCalendarEvents(): Promise<CalendarEventCompendium[]> {
  if (cacheCalendarEvents) return cacheCalendarEvents;
  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("id");

  if (error || !data) {
    console.warn("Gagal memuat calendar events compendium:", error);
    return [];
  }
  cacheCalendarEvents = data as CalendarEventCompendium[];
  return cacheCalendarEvents;
}

export async function getCompendiumEquipmentPacks(): Promise<EquipmentPackCompendium[]> {
  if (cacheEquipmentPacks) return cacheEquipmentPacks;
  const { data, error } = await supabase
    .from("equipment_packs")
    .select("*")
    .order("id");

  if (error || !data) {
    console.warn("Gagal memuat equipment packs compendium:", error);
    return [];
  }
  cacheEquipmentPacks = data as EquipmentPackCompendium[];
  return cacheEquipmentPacks;
}
