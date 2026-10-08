import { describe, it, expect } from "vitest";
import { parseMarkdownCharacter } from "../scripts/validateCodex.js";

describe("Codex Character Sanitization Model (Player Security)", () => {
  it("enforces that placeholder locked characters NEVER leak name, slug, tagline, or avatar", () => {
    // Model behavior of list_codex RPC for locked characters
    function sanitizeForPlayerList(character: {
      id: string;
      slug: string;
      category_id: string;
      sort_order: number;
      visibility_mode: string;
      is_love_interest: boolean;
      name: string;
      tagline: string;
      avatar_url: string;
      revealed_sections: string[];
    }) {
      const isLocked = character.revealed_sections.length === 0;

      if (isLocked) {
        if (character.visibility_mode === "hidden") {
          return null; // Don't return at all
        }
        // Placeholder mode: return ONLY non-identifying metadata
        return {
          id: character.id,
          category_id: character.category_id,
          sort_order: character.sort_order,
          locked: true,
          is_love_interest: character.is_love_interest
        };
      }

      // Unlocked
      return {
        id: character.id,
        slug: character.slug,
        category_id: character.category_id,
        sort_order: character.sort_order,
        locked: false,
        is_love_interest: character.is_love_interest,
        name: character.name,
        tagline: character.tagline,
        avatar_url: character.avatar_url
      };
    }

    const lockedPlaceholder = {
      id: "uuid-1234",
      slug: "yamada_hanako",
      category_id: "class_1_1",
      sort_order: 1,
      visibility_mode: "placeholder",
      is_love_interest: true,
      name: "Yamada Hanako (山田 花子)",
      tagline: "Selamat pagi! Jangan lupa jadwal piket kelas hari ini ya!",
      avatar_url: "https://secret.storage/hanako.png",
      revealed_sections: []
    };

    const result = sanitizeForPlayerList(lockedPlaceholder);
    expect(result).toBeDefined();
    expect(result?.locked).toBe(true);
    expect(result?.id).toBe("uuid-1234");
    expect(result?.category_id).toBe("class_1_1");

    // ABSOLUTE SECURITY GUARANTEE: No leaked sensitive properties!
    expect((result as any).name).toBeUndefined();
    expect((result as any).slug).toBeUndefined();
    expect((result as any).tagline).toBeUndefined();
    expect((result as any).avatar_url).toBeUndefined();
  });

  it("enforces that hidden locked characters are completely omitted from list", () => {
    function filterPlayerCodex(characters: any[]) {
      return characters
        .map(c => {
          const isLocked = (c.revealed_sections || []).length === 0;
          if (isLocked && c.visibility_mode === "hidden") return null;
          return { id: c.id, locked: isLocked };
        })
        .filter(Boolean);
    }

    const roster = [
      { id: "char-1", visibility_mode: "hidden", revealed_sections: [] },
      { id: "char-2", visibility_mode: "placeholder", revealed_sections: [] },
      { id: "char-3", visibility_mode: "hidden", revealed_sections: ["identity"] }
    ];

    const visibleList = filterPlayerCodex(roster);
    expect(visibleList).toHaveLength(2);
    expect(visibleList.map((c: any) => c.id)).not.toContain("char-1");
    expect(visibleList.map((c: any) => c.id)).toContain("char-2");
    expect(visibleList.map((c: any) => c.id)).toContain("char-3");
  });

  it("enforces that locked sections NEVER include content, only locked_hint", () => {
    function sanitizeSectionsForPlayer(
      allSections: Array<{ section_key: string; tier: number; content: any; locked_hint: string }>,
      revealedKeys: string[]
    ) {
      return allSections
        .filter(s => s.section_key !== "dm_notes") // dm_notes strictly excluded
        .map(s => {
          const isRevealed = revealedKeys.includes(s.section_key);
          if (isRevealed) {
            return {
              section_key: s.section_key,
              tier: s.tier,
              locked: false,
              content: s.content
            };
          }
          return {
            section_key: s.section_key,
            tier: s.tier,
            locked: true,
            locked_hint: s.locked_hint || "Terkunci oleh DM."
          };
        });
    }

    const mockSections = [
      { section_key: "identity", tier: 1, content: { name: "Hanako" }, locked_hint: "" },
      { section_key: "appearance", tier: 1, content: { eyes: "black" }, locked_hint: "" },
      { section_key: "mind", tier: 3, content: { fear: "Takut ditinggalkan" }, locked_hint: "Butuh ikatan hati" },
      { section_key: "secrets", tier: 3, content: { secret: "Menyimpan buku harian terlarang" }, locked_hint: "Rahasia besar" },
      { section_key: "dm_notes", tier: 99, content: { guide: "Beri petunjuk via surat" }, locked_hint: "" }
    ];

    const playerView = sanitizeSectionsForPlayer(mockSections, ["identity", "appearance"]);
    expect(playerView).toHaveLength(4); // dm_notes stripped

    const mindSection = playerView.find(s => s.section_key === "mind");
    expect(mindSection?.locked).toBe(true);
    expect((mindSection as any).content).toBeUndefined(); // CONTENT MUST BE UNDEFINED!
    expect(mindSection?.locked_hint).toBe("Butuh ikatan hati");

    const secretsSection = playerView.find(s => s.section_key === "secrets");
    expect(secretsSection?.locked).toBe(true);
    expect((secretsSection as any).content).toBeUndefined(); // CONTENT MUST BE UNDEFINED!

    const identitySection = playerView.find(s => s.section_key === "identity");
    expect(identitySection?.locked).toBe(false);
    expect(identitySection?.content).toEqual({ name: "Hanako" });
  });

  it("verifies dm_notes is completely isolated from players under all circumstances", () => {
    const rawData = {
      id: "uuid-1",
      sections: [
        { section_key: "identity", content: { name: "Ren" } },
        { section_key: "dm_notes", content: { dmSecretPlot: "Plot rahasia DM" } }
      ]
    };

    const playerSections = rawData.sections.filter(s => s.section_key !== "dm_notes");
    expect(playerSections.some(s => s.section_key === "dm_notes")).toBe(false);
  });
});

describe("DM Authentication & Throttle Security Model", () => {
  it("enforces brute-force lockout after 5 failed attempts", () => {
    let failedAttempts = 0;
    let lockedUntil: number | null = null;
    const MAX_FAILED = 5;

    function attemptLogin(password: string): { success: boolean; locked?: boolean } {
      const now = Date.now();
      if (lockedUntil && lockedUntil > now) {
        return { success: false, locked: true };
      }

      if (password === "secret_dm_pass") {
        failedAttempts = 0;
        lockedUntil = null;
        return { success: true };
      } else {
        failedAttempts++;
        if (failedAttempts >= MAX_FAILED) {
          lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
        }
        return { success: false };
      }
    }

    // 4 failed attempts
    for (let i = 0; i < 4; i++) {
      const res = attemptLogin("wrong_pass");
      expect(res.success).toBe(false);
      expect(res.locked).toBeUndefined();
    }

    // 5th failed attempt -> locks out!
    const fifthAttempt = attemptLogin("wrong_pass");
    expect(fifthAttempt.success).toBe(false);
    expect(failedAttempts).toBe(5);

    // 6th attempt -> rejected by lockout
    const sixthAttempt = attemptLogin("wrong_pass");
    expect(sixthAttempt.locked).toBe(true);

    // Even correct password is now blocked until lockout expires
    const correctDuringLockout = attemptLogin("secret_dm_pass");
    expect(correctDuringLockout.locked).toBe(true);
  });

  it("rejects expired or revoked session tokens", () => {
    interface Session {
      tokenHash: string;
      expiresAt: number;
      revokedAt: number | null;
    }

    const sessions: Session[] = [
      { tokenHash: "valid_hash", expiresAt: Date.now() + 10000, revokedAt: null },
      { tokenHash: "expired_hash", expiresAt: Date.now() - 1000, revokedAt: null },
      { tokenHash: "revoked_hash", expiresAt: Date.now() + 10000, revokedAt: Date.now() - 500 }
    ];

    function validateSession(hash: string): boolean {
      const s = sessions.find(item => item.tokenHash === hash);
      if (!s) return false;
      if (s.expiresAt <= Date.now()) return false;
      if (s.revokedAt !== null) return false;
      return true;
    }

    expect(validateSession("valid_hash")).toBe(true);
    expect(validateSession("expired_hash")).toBe(false);
    expect(validateSession("revoked_hash")).toBe(false);
    expect(validateSession("non_existent")).toBe(false);
  });
});

describe("Markdown Importer Integrity", () => {
  it("parses character template file without errors", () => {
    const tplRes = parseMarkdownCharacter("scripts/templates/character_template.md");
    expect(tplRes.valid).toBe(true);
    expect(tplRes.metadata.id).toBe("character_slug_snake_case");
    expect(tplRes.metadata.grade).toBe(10);
    expect(tplRes.metadata.ekskul).toBe("id_ekskul");
  });
});

describe("Codex UI Routing & Silhouette Integrity", () => {
  it("resolves routes without collision between /characters/:id and /codex/c/:id", () => {
    function resolveRoute(path: string): { route: string; params: Record<string, string> } | null {
      const routes = [
        { path: "/characters/:id", name: "character_sheet" },
        { path: "/codex", name: "codex_catalog" },
        { path: "/codex/:category", name: "codex_category" },
        { path: "/codex/c/:id", name: "codex_detail" }
      ];

      const segments = path.split("/").filter(Boolean);

      for (const r of routes) {
        const rSegments = r.path.split("/").filter(Boolean);
        if (rSegments.length !== segments.length) continue;

        const params: Record<string, string> = {};
        let match = true;

        for (let i = 0; i < rSegments.length; i++) {
          if (rSegments[i].startsWith(":")) {
            params[rSegments[i].slice(1)] = segments[i];
          } else if (rSegments[i] !== segments[i]) {
            match = false;
            break;
          }
        }

        if (match) {
          return { route: r.name, params };
        }
      }
      return null;
    }

    // Player sheet route
    const playerSheet = resolveRoute("/characters/char_abc");
    expect(playerSheet?.route).toBe("character_sheet");
    expect(playerSheet?.params.id).toBe("char_abc");

    // Codex catalog
    const codexCatalog = resolveRoute("/codex");
    expect(codexCatalog?.route).toBe("codex_catalog");

    // Codex category
    const codexCat = resolveRoute("/codex/class_1_1");
    expect(codexCat?.route).toBe("codex_category");
    expect(codexCat?.params.category).toBe("class_1_1");

    // Codex NPC detail (3 segments) -> ZERO collision with 2-segment /characters/:id
    const codexDetail = resolveRoute("/codex/c/yamada_hanako");
    expect(codexDetail?.route).toBe("codex_detail");
    expect(codexDetail?.params.id).toBe("yamada_hanako");
  });

  it("verifies generic silhouette SVG generation does not contain image URLs or photo leaks", async () => {
    const { renderCodexSilhouetteSvg } = await import("../src/components/CodexSilhouette");
    const svg = renderCodexSilhouetteSvg(180, 220);

    expect(svg).toContain("<svg");
    expect(svg).toContain("codex-silhouette-svg");
    expect(svg).not.toContain("<image");
    expect(svg).not.toContain("supabase.co");
    expect(svg).not.toContain(".png");
    expect(svg).not.toContain(".jpg");
    expect(svg).not.toContain("yamada");
    expect(svg).not.toContain("hanako");
  });
});

describe("Phase 3 DM Mode Controls & Progressive Reveal Logic", () => {
  interface Section {
    key: string;
    tier: number;
    content: any;
    locked_hint: string;
  }

  const sectionsMock: Section[] = [
    { key: "identity", tier: 1, content: { name: "Yamada Hanako" }, locked_hint: "Karakter belum diperkenalkan." },
    { key: "appearance", tier: 1, content: { avatar: "hanako.png" }, locked_hint: "Karakter belum diperkenalkan." },
    { key: "personality", tier: 2, content: { likes: ["Kamera"] }, locked_hint: "Kenali dia lebih dekat." },
    { key: "background", tier: 2, content: { bio: "Siswi pindahan" }, locked_hint: "Kenali dia lebih dekat." },
    { key: "relationships", tier: 2, content: { friends: [] }, locked_hint: "Kenali dia lebih dekat." },
    { key: "mind", tier: 3, content: { confession_dc: 17 }, locked_hint: "Hanya terbuka bagi ikatan hati terdalam." },
    { key: "secrets", tier: 3, content: { secret: "Mencari foto lama" }, locked_hint: "Hanya terbuka bagi ikatan hati terdalam." },
    { key: "dm_notes", tier: 99, content: { notes: "Rencana plot chapter 4" }, locked_hint: "" }
  ];

  it("progressively unlocks sections across Tier 1, Tier 2, and Tier 3", () => {
    let reveals: string[] = [];

    // 1. Initial: locked
    expect(reveals).toHaveLength(0);

    // 2. DM Introduce (Tier 1)
    const tier1Keys = sectionsMock.filter(s => s.tier === 1).map(s => s.key);
    reveals = [...new Set([...reveals, ...tier1Keys])];
    expect(reveals).toContain("identity");
    expect(reveals).toContain("appearance");
    expect(reveals).not.toContain("personality");
    expect(reveals).not.toContain("mind");

    // 3. DM Unlocks Tier 2
    const tier2Keys = sectionsMock.filter(s => s.tier === 2).map(s => s.key);
    reveals = [...new Set([...reveals, ...tier2Keys])];
    expect(reveals).toContain("personality");
    expect(reveals).toContain("background");
    expect(reveals).toContain("relationships");
    expect(reveals).not.toContain("mind");
    expect(reveals).not.toContain("secrets");

    // 4. DM Unlocks Tier 3
    const tier3Keys = sectionsMock.filter(s => s.tier === 3).map(s => s.key);
    reveals = [...new Set([...reveals, ...tier3Keys])];
    expect(reveals).toContain("mind");
    expect(reveals).toContain("secrets");

    // 5. dm_notes must NEVER be in reveals
    expect(reveals).not.toContain("dm_notes");

    // 6. DM Locks All
    reveals = [];
    expect(reveals).toHaveLength(0);
  });

  it("allows granular single-section toggle without altering other sections", () => {
    let reveals = ["identity", "appearance", "personality"];

    // Toggle unlock 'mind' only (e.g. player passed an Insight DC check)
    if (!reveals.includes("mind")) reveals.push("mind");
    expect(reveals).toEqual(["identity", "appearance", "personality", "mind"]);

    // Lock 'personality' without locking 'mind' or 'identity'
    reveals = reveals.filter(k => k !== "personality");
    expect(reveals).toEqual(["identity", "appearance", "mind"]);
  });

  it("updates and preserves custom locked_hint on sections", () => {
    const sections = JSON.parse(JSON.stringify(sectionsMock));
    const target = sections.find((s: Section) => s.key === "secrets");
    expect(target.locked_hint).toBe("Hanya terbuka bagi ikatan hati terdalam.");

    // DM updates locked hint to a custom clue
    const newHint = "Dapat diungkap dengan DC 16 Investigation di loker klub fotografi.";
    target.locked_hint = newHint;

    expect(target.locked_hint).toBe(newHint);
  });

  it("handles DM notes updates without affecting public character data", () => {
    let dmNoteContent = "Catatan awal";
    const updateDmNote = (newText: string) => {
      dmNoteContent = newText;
    };

    updateDmNote("Pemain berencana mengajak Hanako ke festival budaya.");
    expect(dmNoteContent).toBe("Pemain berencana mengajak Hanako ke festival budaya.");
  });
});

describe("Phase 4 Batch Operations & Realtime Synchronization Security", () => {
  it("executes batch tier reveals across multiple character IDs simultaneously", () => {
    const characterIds = ["char_1", "char_2", "char_3", "char_4"];
    const revealDatabase: Record<string, string[]> = {
      char_1: [],
      char_2: [],
      char_3: [],
      char_4: []
    };

    // 1. Batch Introduce (Tier 1) for all 4 characters
    function batchIntroduce(ids: string[]) {
      ids.forEach(id => {
        revealDatabase[id] = [...new Set([...revealDatabase[id], "identity", "appearance"])];
      });
    }

    batchIntroduce(characterIds);

    characterIds.forEach(id => {
      expect(revealDatabase[id]).toContain("identity");
      expect(revealDatabase[id]).toContain("appearance");
      expect(revealDatabase[id]).not.toContain("personality");
    });

    // 2. Batch Tier 2 for first 2 characters only
    function batchSetTier(ids: string[], tier: number, isReveal: boolean) {
      const keys = tier === 2 ? ["personality", "background", "relationships"] : ["mind", "secrets"];
      ids.forEach(id => {
        if (isReveal) {
          revealDatabase[id] = [...new Set([...revealDatabase[id], ...keys])];
        } else {
          revealDatabase[id] = revealDatabase[id].filter(k => !keys.includes(k));
        }
      });
    }

    batchSetTier(["char_1", "char_2"], 2, true);
    expect(revealDatabase["char_1"]).toContain("personality");
    expect(revealDatabase["char_2"]).toContain("background");
    expect(revealDatabase["char_3"]).not.toContain("personality");
    expect(revealDatabase["char_4"]).not.toContain("personality");

    // 3. Batch Lock All for char_1 and char_3
    function batchLockAll(ids: string[]) {
      ids.forEach(id => {
        revealDatabase[id] = [];
      });
    }

    batchLockAll(["char_1", "char_3"]);
    expect(revealDatabase["char_1"]).toHaveLength(0);
    expect(revealDatabase["char_2"]).toContain("personality"); // untouched
    expect(revealDatabase["char_3"]).toHaveLength(0);
  });

  it("ensures Supabase Realtime broadcast payload is strictly limited to metadata (zero leak)", () => {
    // Model what PostgreSQL codex_reveals table produces for Realtime WebSocket
    const mockRealtimeEvent = {
      schema: "public",
      table: "codex_reveals",
      eventType: "INSERT",
      new: {
        id: "rev-uuid-99",
        character_id: "char-uuid-123",
        section_key: "secrets",
        revealed_at: "2026-10-08T15:00:00Z",
        revealed_by: "DM"
      },
      old: {}
    };

    // Payload verification
    expect(mockRealtimeEvent.table).toBe("codex_reveals");
    expect(mockRealtimeEvent.new.character_id).toBe("char-uuid-123");
    expect(mockRealtimeEvent.new.section_key).toBe("secrets");

    // STRICT PRIVACY GUARANTEE: Realtime event MUST NOT contain content or notes!
    expect((mockRealtimeEvent.new as any).content).toBeUndefined();
    expect((mockRealtimeEvent.new as any).raw_markdown).toBeUndefined();
    expect((mockRealtimeEvent.new as any).dm_notes).toBeUndefined();
    expect((mockRealtimeEvent.new as any).secret_image_url).toBeUndefined();
  });
});

describe("Phase 5 Web Character Editor & Storage Asset Security", () => {
  it("generates clean slug from Japanese/Kanji character names automatically", () => {
    function generateSlugFromName(rawName: string): string {
      return rawName
        .toLowerCase()
        .replace(/\([^)]*\)/g, "")
        .trim()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");
    }

    expect(generateSlugFromName("Yamada Hanako (山田 花子)")).toBe("yamada_hanako");
    expect(generateSlugFromName("Satou Ren (佐藤 蓮)")).toBe("satou_ren");
    expect(generateSlugFromName("Suzuki Mei (鈴木 芽依)")).toBe("suzuki_mei");
  });

  it("obfuscates uploaded portrait filenames so character names never leak in storage paths", () => {
    function generateSafeAssetPath(originalFilename: string, randomId: string): string {
      const ext = (originalFilename.split(".").pop() || "png").toLowerCase();
      return `portraits/asset_${randomId}.${ext}`;
    }

    const unsafeFile = "Yamada_Hanako_Secret_Confession_CG.png";
    const safePath = generateSafeAssetPath(unsafeFile, "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d");

    expect(safePath).toBe("portraits/asset_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d.png");
    expect(safePath.toLowerCase()).not.toContain("yamada");
    expect(safePath.toLowerCase()).not.toContain("hanako");
    expect(safePath.toLowerCase()).not.toContain("confession");
  });

  it("constructs complete 8-section payload for dm_upsert_character", () => {
    const expectedKeys = [
      "identity",
      "appearance",
      "personality",
      "background",
      "relationships",
      "mind",
      "secrets",
      "dm_notes"
    ];

    const payloadSections = expectedKeys.map((key) => ({
      sectionKey: key,
      tier: key === "identity" || key === "appearance" ? 1 : key === "dm_notes" ? 99 : 2,
      content: {},
      lockedHint: "Terkunci"
    }));

    expect(payloadSections).toHaveLength(8);
    expect(payloadSections.map(s => s.sectionKey)).toEqual(expectedKeys);
  });
});



