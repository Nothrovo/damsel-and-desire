import { supabase } from "./supabase";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import type {
  AbilityCompendium,
  EkskulCompendium,
  ArchetypeCompendium,
  SocialClassCompendium,
  BasicActionCompendium,
  CalendarEventCompendium,
  EquipmentPackCompendium,
  FeatDefinition,
  AchievementCompendium
} from "../types";

let cacheAbilities: AbilityCompendium[] | null = null;
let cacheEkskul: EkskulCompendium[] | null = null;
let cacheArchetypes: ArchetypeCompendium[] | null = null;
let cacheSocialClasses: SocialClassCompendium[] | null = null;
let cacheBasicActions: BasicActionCompendium[] | null = null;
let cacheCalendarEvents: CalendarEventCompendium[] | null = null;
let cacheEquipmentPacks: EquipmentPackCompendium[] | null = null;
let cacheFeats: FeatDefinition[] | null = null;
let cacheAchievements: AchievementCompendium[] | null = null;

export function getCachedEkskul(): EkskulCompendium[] | null {
  return cacheEkskul;
}

export function getCachedArchetypes(): ArchetypeCompendium[] | null {
  return cacheArchetypes;
}

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

  const fallbackList: EkskulCompendium[] = FALLBACK_DD_DATA.ekskul.map((e: any) => ({
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
      tagline: sc.tagline,
      identity_desc: sc.identityDesc || sc.identity_desc,
      description: sc.desc || sc.description,
      subclass_moves: (sc.subclassMoves || sc.subclass_moves || []).map((sm: any) => ({
        id: sm.id,
        subclass_id: sc.id,
        name: sm.name,
        tier: sm.tier,
        unlock_grade: sm.unlockGrade || sm.unlock_grade || (sm.tier === "G12" ? 12 : 11),
        move_type: sm.type || sm.move_type,
        cost: sm.cost,
        range: sm.range,
        check_type: sm.check || sm.check_type,
        effect: sm.effect,
        description: sm.desc || sm.description
      }))
    })),
    club_moves: (e.clubMoves || []).map((m: any, idx: number) => ({
      id: m.id || `${e.id}_move_${idx + 1}`,
      ekskul_id: e.id,
      name: m.name,
      move_type: m.type || m.move_type,
      cost: m.cost,
      range: m.range,
      check_type: m.check || m.check_type,
      effect: m.effect,
      description: m.desc || m.description,
      order: m.order || (idx + 1),
      unlock_grade: m.unlockGrade || m.unlock_grade || (idx === 0 ? 10 : idx === 1 ? 11 : 12)
    }))
  }));

  try {
    const { data, error } = await supabase
      .from("ekskul")
      .select("*, subclasses:ekskul_subclasses(*, subclass_moves(*)), club_moves:ekskul_moves(*)")
      .order("name");

    if (!error && data && data.length > 0) {
      const mergedList: EkskulCompendium[] = (data as any[]).map(e => {
        const fallback = fallbackList.find((fe) => fe.id === e.id);
        const moves = (e.club_moves && e.club_moves.length > 0)
          ? e.club_moves.map((m: any, idx: number) => ({
              ...m,
              order: m.order || (idx + 1),
              unlock_grade: m.unlock_grade || (idx === 0 ? 10 : idx === 1 ? 11 : 12)
            }))
          : (fallback?.club_moves || []);

        const subclasses = (e.subclasses && e.subclasses.length > 0)
          ? e.subclasses.map((sc: any) => {
              const fbSc = fallback?.subclasses?.find((fsc) => fsc.id === sc.id);
              return {
                ...sc,
                tagline: sc.tagline || fbSc?.tagline,
                identity_desc: sc.identity_desc || fbSc?.identity_desc,
                subclass_moves: (sc.subclass_moves && sc.subclass_moves.length > 0)
                  ? sc.subclass_moves
                  : (fbSc?.subclass_moves || [])
              };
            })
          : (fallback?.subclasses || []);

        return {
          ...e,
          subclasses,
          club_moves: moves
        };
      });

      // Merge missing ekskuls from fallback (e.g. photography, cooking, occult, gaming)
      const existingIds = new Set(mergedList.map(e => e.id));
      for (const fe of fallbackList) {
        if (!existingIds.has(fe.id)) {
          mergedList.push(fe);
        }
      }
      mergedList.sort((a, b) => a.name.localeCompare(b.name));
      cacheEkskul = mergedList;
      return cacheEkskul;
    }
  } catch (err) {
    console.warn("Koneksi Supabase ekskul compendium gagal, beralih ke fallback lokal.");
  }

  // Fallback
  cacheEkskul = fallbackList;
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
      cacheArchetypes = (data as any[]).map(a => {
        const fallback = FALLBACK_DD_DATA.archetypes.find((fa: any) => fa.id === a.id);
        const moves = (a.archetype_moves && a.archetype_moves.length > 0)
          ? a.archetype_moves
          : (fallback?.archetypeMoves || []).map((m: any, idx: number) => ({
              id: `${a.id}_move_${idx + 1}`,
              archetype_id: a.id,
              name: m.name,
              move_type: m.type,
              cost: m.cost,
              range: m.range,
              check_type: m.check,
              effect: m.effect,
              description: m.desc
            }));
        return {
          ...a,
          archetype_moves: moves
        };
      }) as ArchetypeCompendium[];
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

  try {
    const { data, error } = await supabase
      .from("equipment_packs")
      .select("*")
      .order("id");

    if (!error && data && data.length > 0) {
      const dbPacks = data as EquipmentPackCompendium[];
      const existingIds = new Set(dbPacks.map(p => p.id));
      for (const fp of packs) {
        if (!existingIds.has(fp.id)) {
          dbPacks.push(fp);
        }
      }
      cacheEquipmentPacks = dbPacks;
      return cacheEquipmentPacks;
    }
  } catch (err) {
    console.warn("Koneksi Supabase equipment packs compendium gagal, beralih ke fallback lokal.");
  }

  cacheEquipmentPacks = packs;
  return cacheEquipmentPacks;
}

export async function getCompendiumFeats(): Promise<FeatDefinition[]> {
  if (cacheFeats) return cacheFeats;
  try {
    const { data, error } = await supabase
      .from("compendium_feats")
      .select("*")
      .order("category")
      .order("name");

    if (!error && data && data.length > 0) {
      cacheFeats = data as FeatDefinition[];
      return cacheFeats;
    }
  } catch (err) {
    console.warn("Koneksi Supabase feats compendium gagal, beralih ke fallback lokal.");
  }

  cacheFeats = (FALLBACK_DD_DATA as any).feats || [];
  return cacheFeats || [];
}

export async function getCompendiumAchievements(): Promise<AchievementCompendium[]> {
  if (cacheAchievements) return cacheAchievements;
  try {
    const { data, error } = await supabase
      .from("compendium_achievements")
      .select("*")
      .order("name");

    if (!error && data && data.length > 0) {
      cacheAchievements = data as AchievementCompendium[];
      return cacheAchievements;
    }
  } catch (err) {
    console.warn("Koneksi Supabase achievements compendium gagal, beralih ke fallback lokal.");
  }

  cacheAchievements = (FALLBACK_DD_DATA as any).achievements || [];
  return cacheAchievements || [];
}

