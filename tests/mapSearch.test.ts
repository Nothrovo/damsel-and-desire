import { describe, it, expect } from "vitest";
import { searchSchoolMap } from "../src/map/mapSearch";

describe("Map Search & Autocomplete System", () => {
  it("returns empty array when query is empty or whitespace", () => {
    expect(searchSchoolMap("")).toEqual([]);
    expect(searchSchoolMap("   ")).toEqual([]);
  });

  it("finds room by direct English name", () => {
    const results = searchSchoolMap("Photography Club");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].room.id).toBe("f3_photography_club");
    expect(results[0].floorId).toBe("f3");
  });

  it("finds room by associated Indonesian ekskul name (e.g. KIR / Sains)", () => {
    const results = searchSchoolMap("KIR");
    expect(results.length).toBeGreaterThan(0);
    // Should match Science Club and/or Science Lab
    const matchedIds = results.map(r => r.room.id);
    expect(matchedIds).toContain("f3_science_club");
  });

  it("finds rooms by category label (e.g. Kelas / Classroom)", () => {
    const results = searchSchoolMap("Classroom");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].room.category).toBe("classroom");

    const kelasResults = searchSchoolMap("Ruang Kelas");
    expect(kelasResults.length).toBeGreaterThan(0);
    expect(kelasResults[0].room.category).toBe("classroom");
  });

  it("finds campus zones (e.g. Swimming Pool, Athletic Field)", () => {
    const poolResults = searchSchoolMap("Swimming");
    expect(poolResults.length).toBeGreaterThan(0);
    expect(poolResults[0].room.id).toBe("campus_swimming_pool");
    expect(poolResults[0].floorId).toBe("campus");

    const fieldResults = searchSchoolMap("Athletic");
    expect(fieldResults.length).toBeGreaterThan(0);
    expect(fieldResults[0].room.id).toBe("campus_athletic_field");
  });

  it("finds rooftop access rooms", () => {
    const results = searchSchoolMap("Access");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.floorId === "roof")).toBe(true);
  });
});
