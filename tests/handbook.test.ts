import { describe, it, expect } from "vitest";
import {
  HANDBOOK_CHAPTERS,
  getHandbookChapterById,
  searchHandbook,
  compileFullHandbookHtml
} from "../src/data/handbook";

describe("Player's Handbook (PHB) Modular Architecture", () => {
  it("should contain all 12 official modular chapters (Chapters 0 to 11)", () => {
    expect(HANDBOOK_CHAPTERS).toHaveLength(12);

    const numbers = HANDBOOK_CHAPTERS.map(ch => ch.number);
    expect(numbers).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    HANDBOOK_CHAPTERS.forEach(ch => {
      expect(ch.id).toBeDefined();
      expect(ch.title).toBeTruthy();
      expect(ch.summary).toBeTruthy();
      expect(ch.sections.length).toBeGreaterThan(0);
    });
  });

  it("should retrieve chapters by ID correctly", () => {
    const ch0 = getHandbookChapterById("chapter-0-intro");
    expect(ch0).toBeDefined();
    expect(ch0?.title).toContain("Selamat Datang");

    const ch3 = getHandbookChapterById("chapter-3-archetypes");
    expect(ch3).toBeDefined();
    expect(ch3?.title).toContain("Arketipe Murid");

    const ch4 = getHandbookChapterById("chapter-4-ekskul");
    expect(ch4).toBeDefined();
    expect(ch4?.title).toContain("Klub Ekstrakurikuler");
  });

  it("should verify Chapter 3 contains all 8 archetypes and their moves", () => {
    const ch3 = getHandbookChapterById("chapter-3-archetypes")!;
    expect(ch3.sections.length).toBe(9); // 1 overview + 8 archetypes

    const archetypeIds = ch3.sections.slice(1).map(s => s.id);
    expect(archetypeIds).toContain("delinquent");
    expect(archetypeIds).toContain("jock");
    expect(archetypeIds).toContain("nerd");
    expect(archetypeIds).toContain("class_clown");
    expect(archetypeIds).toContain("emo");
    expect(archetypeIds).toContain("weeb");
    expect(archetypeIds).toContain("popular_kids");
    expect(archetypeIds).toContain("normies");

    // Total 24 archetype moves across all 8 archetypes (3 moves each)
    const totalMoves = ch3.sections.reduce((acc, s) => acc + (s.statBlocks?.length || 0), 0);
    expect(totalMoves).toBe(24);
  });

  it("should verify Chapter 4 contains all 16 clubs and 48 club moves", () => {
    const ch4 = getHandbookChapterById("chapter-4-ekskul")!;
    expect(ch4.sections.length).toBe(17); // 1 overview + 16 clubs

    // Legacy clubs regression check
    const legacyClubIds = [
      "club-student-council", "club-kendo", "club-martial-arts", "club-sports",
      "club-drama", "club-kir-osn", "club-pramuka", "club-pecinta-alam",
      "club-penyiaran", "club-literatur", "club-band", "club-painting"
    ];
    legacyClubIds.forEach(id => {
      expect(ch4.sections.some(s => s.id === id)).toBe(true);
    });

    // New clubs check
    const newClubIds = ["club-photography", "club-cooking", "club-occult", "club-gaming"];
    newClubIds.forEach(id => {
      expect(ch4.sections.some(s => s.id === id)).toBe(true);
    });

    const totalClubMoves = ch4.sections.reduce((acc, s) => acc + (s.statBlocks?.length || 0), 0);
    expect(totalClubMoves).toBe(48);
  });

  it("should verify Chapter 7 contains Dual Vitals and Salting rules", () => {
    const ch7 = getHandbookChapterById("chapter-7-dual-vitals")!;
    const content = ch7.sections.map(s => s.contentHtml).join(" ");
    expect(content).toContain("Physical Armor Class");
    expect(content).toContain("Social Armor Class");
    expect(content).toContain("Composure");
    expect(content).toContain("Salting");
    expect(content).toContain("Social Meltdown");
    expect(content).toContain("Death Saves");
    expect(content).toContain("Meltdown Saves");
  });

  it("should verify Chapter 10 covers Heart Tokens and Confession mechanics", () => {
    const ch10 = getHandbookChapterById("chapter-10-romance-secrets")!;
    const content = ch10.sections.map(s => s.contentHtml).join(" ");
    expect(content).toContain("Heart Token");
    expect(content).toContain("Confession Event");
    expect(content).toContain("6969");
  });

  it("should support real-time search across chapters and sections", () => {
    const searchDelinquent = searchHandbook("Delinquent");
    expect(searchDelinquent.length).toBeGreaterThan(0);
    expect(searchDelinquent.some(s => s.chapter.id === "chapter-3-archetypes")).toBe(true);

    const searchKendo = searchHandbook("Kendo");
    expect(searchKendo.length).toBeGreaterThan(0);

    const searchSalting = searchHandbook("Salting");
    expect(searchSalting.length).toBeGreaterThan(0);

    const emptyResults = searchHandbook("xyznonexistentword999");
    expect(emptyResults).toHaveLength(0);
  });

  it("should compile complete handbook into authentic D&D 5e HTML with drop caps and stat blocks", () => {
    const html = compileFullHandbookHtml();
    expect(html).toContain('class="phb-document"');
    expect(html).toContain('class="phb-drop-cap"');
    expect(html).toContain('class="phb-stat-card"');
    expect(html).toContain('phb-callout');
    expect(html).toContain('class="phb-table"');
    expect(html.length).toBeGreaterThan(50000); // Rich, full-length content
  });
});
