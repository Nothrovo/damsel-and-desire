import { describe, it, expect } from "vitest";
import {
  CODEX_HIERARCHY,
  resolveCharacterAffiliations,
  isCharacterInSubcategory,
  getAllSubcategories
} from "../src/api/codex";

describe("Codex Hierarchical Taxonomy & Multi-Category Resolution", () => {
  it("defines the 3 official root groups (Housen, Touki, Luar Sekolah)", () => {
    expect(CODEX_HIERARCHY).toBeDefined();
    expect(CODEX_HIERARCHY.length).toBe(3);

    const rootIds = CODEX_HIERARCHY.map((g) => g.id);
    expect(rootIds).toContain("housen");
    expect(rootIds).toContain("touki");
    expect(rootIds).toContain("outside_other");
  });

  it("defines subcategories under Housen Academy (Kelas, Klub & Organisasi, Faculty, Alumni)", () => {
    const housen = CODEX_HIERARCHY.find((g) => g.id === "housen");
    expect(housen).toBeDefined();
    const subIds = housen!.subcategories.map((s) => s.id);

    // Classes
    expect(subIds).toContain("class_1_1");
    expect(subIds).toContain("class_1_2");
    expect(subIds).toContain("class_2_1");
    expect(subIds).toContain("class_2_2");
    expect(subIds).toContain("class_3_1");
    expect(subIds).toContain("class_3_2");

    // Clubs & Orgs
    expect(subIds).toContain("osis");
    expect(subIds).toContain("kokuhou");
    expect(subIds).toContain("clubs");

    // Faculty & Alumni
    expect(subIds).toContain("faculty");
    expect(subIds).toContain("housen_alumni");
  });

  it("defines subcategories under Touki (Kelas, Klub & Organisasi, Alumni)", () => {
    const touki = CODEX_HIERARCHY.find((g) => g.id === "touki");
    expect(touki).toBeDefined();
    const subIds = touki!.subcategories.map((s) => s.id);

    expect(subIds).toContain("touki_classes");
    expect(subIds).toContain("touki_clubs_orgs");
    expect(subIds).toContain("touki_alumni");
  });

  it("resolves multi-affiliation for a Housen student who belongs to both a classroom and an ekskul/club", () => {
    // Example: Choi Dal Dal - Class 11-1 and Cooking/Taekwondo club
    const dalDal = {
      slug: "choi_dal_dal",
      class_room: "11-1",
      club: "cooking",
      role: "Siswa Housen Academy",
      category_id: "class_2_1",
      categories: ["class_2_1", "clubs"]
    };

    const affiliations = resolveCharacterAffiliations(dalDal);
    expect(affiliations).toContain("class_2_1");
    expect(affiliations).toContain("clubs");
    expect(affiliations).toContain("housen");

    expect(isCharacterInSubcategory(dalDal, "class_2_1")).toBe(true);
    expect(isCharacterInSubcategory(dalDal, "clubs")).toBe(true);
    expect(isCharacterInSubcategory(dalDal, "class_1_1")).toBe(false);
  });

  it("resolves multi-affiliation for OSIS and Kokuhou members in Housen", () => {
    // Sendou Airi - Class 11-1 and Ketua OSIS
    const airi = {
      slug: "sendou_airi",
      class_room: "11-1",
      club: "osis",
      role: "Ketua OSIS Housen Academy",
      category_id: "osis"
    };

    const airiAffiliations = resolveCharacterAffiliations(airi);
    expect(airiAffiliations).toContain("osis");
    expect(airiAffiliations).toContain("class_2_1");
    expect(isCharacterInSubcategory(airi, "osis")).toBe(true);
    expect(isCharacterInSubcategory(airi, "class_2_1")).toBe(true);

    // Kanzaki Takeru - Class 12-1 and Kokuhou
    const takeru = {
      slug: "kanzaki_takeru",
      class_room: "12-1",
      club: "kokuhou",
      role: "Pemimpin Kokuhou",
      category_id: "kokuhou"
    };

    const takeruAffiliations = resolveCharacterAffiliations(takeru);
    expect(takeruAffiliations).toContain("kokuhou");
    expect(takeruAffiliations).toContain("class_3_1");
    expect(isCharacterInSubcategory(takeru, "kokuhou")).toBe(true);
    expect(isCharacterInSubcategory(takeru, "class_3_1")).toBe(true);
  });

  it("resolves faculty members to faculty subcategory and Housen root group", () => {
    const vogel = {
      slug: "heinrich_vogel",
      class_room: "UKS / Ruang Medis",
      club: "none",
      role: "Dokter UKS & Konselor",
      category_id: "faculty"
    };

    const affiliations = resolveCharacterAffiliations(vogel);
    expect(affiliations).toContain("faculty");
    expect(isCharacterInSubcategory(vogel, "faculty")).toBe(true);
    expect(isCharacterInSubcategory(vogel, "class_1_1")).toBe(false);
  });

  it("resolves Touki students to Touki group and Touki subcategories", () => {
    const bando = {
      slug: "mawatari_bando",
      class_room: "Kelas 11",
      club: "touki_gang",
      role: "Geng Touki",
      category_id: "touki"
    };

    const affiliations = resolveCharacterAffiliations(bando);
    expect(affiliations).toContain("touki");
    expect(affiliations).toContain("touki_clubs_orgs");
    expect(affiliations).toContain("touki_classes");
    expect(isCharacterInSubcategory(bando, "touki_clubs_orgs")).toBe(true);
    expect(isCharacterInSubcategory(bando, "class_1_1")).toBe(false);
  });

  it("returns all subcategories with parent associations", () => {
    const allSubs = getAllSubcategories();
    expect(allSubs.length).toBeGreaterThanOrEqual(13);
    for (const sub of allSubs) {
      expect(sub.id).toBeTruthy();
      expect(sub.name).toBeTruthy();
      expect(sub.parentGroupId).toBeTruthy();
    }
  });
});
