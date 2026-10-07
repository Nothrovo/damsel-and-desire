import { describe, it, expect } from "vitest";
import { getItemDetails, getAllCompendiumItems, MASTER_ITEM_REGISTRY } from "../src/data/itemCompendium";
import type { ItemDefinition } from "../src/types";

describe("Item Compendium & Registry", () => {
  it("contains complete preset items in master registry", () => {
    const keys = Object.keys(MASTER_ITEM_REGISTRY);
    expect(keys.length).toBeGreaterThan(80);
  });

  it("getAllCompendiumItems returns full array of preset definitions", () => {
    const all = getAllCompendiumItems();
    expect(all.length).toBe(Object.keys(MASTER_ITEM_REGISTRY).length);
    expect(all.some(i => i.name === "Buku Pelajaran & Buku Tulis Catatan")).toBe(true);
    expect(all.some(i => i.name === "Smartphone Flagship Terbaru")).toBe(true);
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

    // New club items
    const photoItem = getItemDetails("Kamera Digital Lensa Telefoto");
    expect(photoItem.origin).toContain("Photography");
    expect(photoItem.rollCheck?.stat).toBe("mind");

    const cookItem = getItemDetails("Kotak Bento Bertingkat Cantik");
    expect(cookItem.origin).toContain("Cooking");

    const tarotItem = getItemDetails("Set Kartu Tarot Antik");
    expect(tarotItem.origin).toContain("Occult");

    const gameItem = getItemDetails("Konsol Game Portabel & Charger");
    expect(gameItem.origin).toContain("Gaming");
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

  it("prioritizes custom item registry created by player", () => {
    const customRegistry: Record<string, ItemDefinition> = {
      "Kunci Loker Karatan": {
        name: "Kunci Loker Karatan",
        category: "custom",
        origin: "Lantai 3 Gedung Lama",
        rarity: "Rare",
        flavorText: "Kunci kuningan berkarat dengan gantungan pita merah misterius.",
        mechanic: "Membuka loker nomor 44 di gedung lama. Memberikan +2 pada check Intelligent (Investigation).",
        actionType: "utility",
        rollCheck: { stat: "intelligent", label: "Check Investigation Loker" }
      }
    };

    const lookedUp = getItemDetails("Kunci Loker Karatan", customRegistry);
    expect(lookedUp.rarity).toBe("Rare");
    expect(lookedUp.origin).toBe("Lantai 3 Gedung Lama");
    expect(lookedUp.mechanic).toContain("loker nomor 44");
    expect(lookedUp.rollCheck?.label).toBe("Check Investigation Loker");
  });

  it("generates intelligent procedural fallback for custom player items without explicit definition", () => {
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
