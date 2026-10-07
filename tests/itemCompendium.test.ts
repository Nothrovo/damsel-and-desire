import { describe, it, expect } from "vitest";
import { getItemDetails, MASTER_ITEM_REGISTRY } from "../src/data/itemCompendium";

describe("Item Compendium & Registry", () => {
  it("contains complete preset items in master registry", () => {
    const keys = Object.keys(MASTER_ITEM_REGISTRY);
    expect(keys.length).toBeGreaterThan(80);
  });

  it("retrieves standard student items with valid mechanics and flavor text", () => {
    const item = getItemDetails("Buku Pelajaran & Buku Tulis Catatan");
    expect(item.name).toBe("Buku Pelajaran & Buku Tulis Catatan");
    expect(item.category).toBe("student");
    expect(item.rarity).toBe("Common");
    expect(item.mechanic).toContain("Intelligent");
    expect(item.flavorText.length).toBeGreaterThan(10);
    expect(item.rollCheck).toBeDefined();
    expect(item.rollCheck?.stat).toBe("intelligent");
  });

  it("retrieves social class items (Rich, Middle Poor, Poor, Orphanage)", () => {
    const richItem = getItemDetails("Smartphone Flagship Terbaru");
    expect(richItem.rarity).toBe("Rare");
    expect(richItem.origin).toContain("Rich");
    expect(richItem.mechanic).toContain("Intelligent");

    const poorItem = getItemDetails("Sepatu Kets Usang");
    expect(poorItem.rarity).toBe("Common");
    expect(poorItem.origin).toContain("Poor");
    expect(poorItem.rollCheck?.stat).toBe("physique");

    const orphanItem = getItemDetails("Foto Polaroid Lama");
    expect(orphanItem.rarity).toBe("Uncommon");
    expect(orphanItem.origin).toContain("Orphanage");
  });

  it("retrieves club / ekskul specific items", () => {
    const scienceItem = getItemDetails("Buku Catatan Eksperimen");
    expect(scienceItem.rarity).toBe("Uncommon");
    expect(scienceItem.origin).toContain("Sains");
    expect(scienceItem.rollCheck?.stat).toBe("intelligent");

    const kendoItem = getItemDetails("Shinai Bambu Latihan");
    expect(kendoItem.rarity).toBe("Uncommon");
    expect(kendoItem.origin).toContain("Kendo");
  });

  it("retrieves archetype specific items", () => {
    const delinquentItem = getItemDetails("Jaket Bomber Modifikasi Keren");
    expect(delinquentItem.origin).toContain("Delinquent");
    expect(delinquentItem.rollCheck?.stat).toBe("looks");

    const nerdItem = getItemDetails("Kalkulator Saintifik Canggih");
    expect(nerdItem.origin).toContain("Nerd");
    expect(nerdItem.actionType).toBe("bonus_action");
  });

  it("supports case-insensitive and substring lookups", () => {
    const ciItem = getItemDetails("kacamata pelindung lab");
    expect(ciItem.name).toBe("Kacamata Pelindung Lab");
    expect(ciItem.origin).toContain("Sains");

    const subItem = getItemDetails("Lipbalm");
    expect(subItem.name).toBe("Lipbalm / Lip Tint Mewah");
    expect(subItem.origin).toContain("Popular Kids");
  });

  it("generates intelligent procedural fallback for custom player items", () => {
    const customTool = getItemDetails("Kunci Inggris Karatan");
    expect(customTool.name).toBe("Kunci Inggris Karatan");
    expect(customTool.category).toBe("custom");
    expect(customTool.rarity).toBe("Uncommon");
    expect(customTool.mechanic).toContain("Dungeon Master");

    const customKeepsake = getItemDetails("Omamori Keberuntungan dari Ibu");
    expect(customKeepsake.name).toBe("Omamori Keberuntungan dari Ibu");
    expect(customKeepsake.category).toBe("keepsake");
    expect(customKeepsake.rarity).toBe("Special Keepsake");
    expect(customKeepsake.mechanic).toContain("Advantage");
  });
});
