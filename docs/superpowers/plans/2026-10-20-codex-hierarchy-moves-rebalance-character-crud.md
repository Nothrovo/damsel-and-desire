# Kamus Karakter Hierarkis, Rework Action & Moves, dan DM Character Creator/Editor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mengimplementasikan 4 pilar fitur utama Damsel & Desire: (1) Kamus Karakter (Codex) hierarkis multi-folder & multi-tagging (Housen, Touki, Luar Sekolah), (2) Rework mekanik Move Fisik vs Sosial dengan kejelasan efek, trade-off taktis seimbang, serta direct interactive dice rolling dari kotak move, (3) Input karakter / Love Interest baru dari client-side dengan multi-kategori dan upload pasfoto tersinkronisasi ke Supabase (khusus DM), dan (4) Fitur edit profil serta pasfoto karakter/love interest dari client-side tersinkronisasi ke Supabase (khusus DM).

**Architecture:** 
- Frontend SPA murni berbasis TypeScript + Vite dengan komponen modal modular, store reaktif (`characterStore`, `dmAuthStore`), dan rendering anti-slop (tactile Japanese academy aesthetic).
- Database layer menggunakan Supabase PostgreSQL dengan RPC terproteksi (`dm_upsert_character`, `list_codex`, `get_codex_character`), RLS policies, dan Supabase Storage bucket `codex-assets` untuk pasfoto ID.
- Resolusi multi-afiliasi otomatis berbasis kanon (memetakan kelas, ekskul, faksi, dan array multi-kategori) sehingga karakter dapat tampil simultan di berbagai folder tanpa duplikasi database.

**Tech Stack:** TypeScript 5.7, Vite 6.2, Vitest 3.0, Supabase JS SDK v2, PostgreSQL (RPC & Storage), Tailwind/CSS Custom Properties.

---

## Global Constraints
- Konten terkunci dan rahasia plot/NPC Tier 2/Tier 3 tidak boleh bocor ke pemain publik (`list_codex` wajib sanitasi).
- Seluruh mutasi karakter dan upload pasfoto ID di cloud dibatasi hanya untuk sesi Game Master aktif (`dmAuthStore.isDmActive()`).
- Seluruh karakter baru harus kanon permanen (tidak ada karakter fiktif/placeholder sekali pakai).
- Roll dice harus terhubung langsung ke modifier statistik karakter asli (Physique, Looks, Mind, dsb.) dan dadu yang sesuai.
- Desain antarmuka UI wajib bebas dari AI-slop: tidak ada gradien ungu generik, tidak ada floating cards kosong, layout memiliki struktur poster yang kokoh dan tipografi terbaca.

## Review Focus
1. **Multi-tagging Category Resolution**: Karakter dengan multiple affiliations (misal: Choi Dal Dal di Kelas 11-1 DAN Klub Taekwondo DAN Klub Tata Boga) harus muncul di semua sub-kategori terkait tanpa duplikasi ID di grid.
2. **Dice Rolling Parameter Fidelity**: Pengecekan dadu dari move card harus otomatis mem-parsing ability modifier karakter secara akurat (bukan hardcoded 0) dan memilih jenis dadu (d20 untuk check, d4/d6 untuk damage/heal).
3. **DM Authentication Gating on Mutations**: Pemanggilan form pembuatan atau pengeditan karakter harus menolak akses jika sesi DM tidak ada atau expired, memunculkan modal login DM.
4. **Permanent Public URL on ID Portraits**: Upload gambar ke storage `codex-assets` harus menghasilkan URL publik permanen (`getPublicUrl`) dengan fallback kompresi web-safe base64 data URL.
5. **Move Balance & Tactical Trade-offs**: Setiap move fisik dan sosial harus memiliki efek konkret (+/-) yang tidak redundan, menghapus dominasi satu move (misal tendangan vs pukulan).

---

## File Structure & Responsibilities

### Files to Modify:
- `src/types/codex.ts`: Menambahkan tipe data untuk hierarki kategori, subkategori, dan multi-tagging affiliations (`CodexHierarchyNode`, `CodexCategoryGroup`).
- `src/types/index.ts`: Menambahkan field pendukung move fisik vs sosial, dadu damage, trade-off info, dan stat links.
- `src/rules/combatActions.ts`: Rework komprehensif move fisik dan sosial: balancing jab vs kick, grapple, shove, guard, menacing stare, taunt, flirt, support cheer, de-escalate.
- `src/api/codex.ts`: Update resolver hierarki kategori, fungsi multi-kategori karakter, sanitasi, dan sinkronisasi upsert.
- `src/views/CodexCatalogView.ts`: Tampilan kamus hierarkis folder (Housen, Touki, Luar Sekolah) dengan tabs, badge jumlah, dan filter anti-slop.
- `src/views/CodexCategoryView.ts`: Sub-kategori explorer dengan multi-tag filter pills dan kartu karakter ber-badge multi-afiliasi.
- `src/views/CodexDetailView.ts`: Penambahan badge multi-afiliasi, navigasi balik kontekstual, dan tombol quick edit DM.
- `src/views/CharacterSheetView.ts`: Rework tab move (Move Fisik vs Move Sosial), layout kartu move dengan tombol roll langsung (`[🎲 Check: +X]` dan `[💥 Damage: 1d6+X]`).
- `src/components/CodexCharacterEditorModal.ts`: Rework modal pembuat/pengedit karakter menjadi guided multi-step wizard dengan multi-kategori checklist, upload pasfoto ID, vitals, dan heart milestone.
- `src/components/LoveInterestDetailModal.ts`: Menambahkan tombol `✏️ Edit Profil Karakter (DM)` saat mode DM aktif.
- `src/data/fallbackCompendium.ts`: Sinkronisasi definisi basic actions baru agar offline & fallback tetap seimbang.

### Files to Create:
- `src/rules/moveMechanics.ts`: Engine kalkulasi damage, roll modifier link, dan validasi efek move fisik vs sosial.
- `tests/codexHierarchy.test.ts`: Unit test untuk resolusi hierarki multi-kategori dan filtrasi folder karakter.
- `tests/moveBalanceAndRoll.test.ts`: Unit test untuk balancing move, formula dadu, modifier linking, dan efek taktis.

---

## Task Decomposition

### Task 1: Type Definitions & Multi-Category Hierarchy Modeling
**Files:**
- Modify: `src/types/codex.ts`
- Modify: `src/types/index.ts`
- Test: `tests/codexHierarchy.test.ts`

**Interfaces:**
- Produces: `CodexRootGroup`, `CodexSubCategory`, `CodexAffiliationTag`, `MoveCategoryFilter` ("all" | "physical" | "social" | "club" | "subclass" | "archetype").
- Consumes: Existing `CodexCategory`, `CodexCharacterCard`, `CombatActionDefinition`.

- [ ] **Step 1: Write the failing test for hierarchy resolution and multi-category tagging**
  - Verify that a character with `class_room: "11-1"` and `club: "taekwondo"` resolves to both `housen_classes/class_2_1` and `housen_clubs/taekwondo`.
  - Verify that Touki students resolve to `touki` group and classes.
  - Verify that faculty members resolve to `faculty`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test tests/codexHierarchy.test.ts`
  Expected: FAIL (types/functions not yet exported).

- [ ] **Step 3: Implement hierarchy types and resolver functions in `src/types/codex.ts` and `src/api/codex.ts`**
  - Define root groups: `housen`, `touki`, `outside_other`.
  - Define sub-categories under Housen (Kelas, Klub & Organisasi, Faculty, Alumni).
  - Define sub-categories under Touki (Kelas, Klub & Organisasi, Alumni).
  - Implement `resolveCharacterAffiliations(character): string[]`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `npm test tests/codexHierarchy.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/types/codex.ts src/types/index.ts src/api/codex.ts tests/codexHierarchy.test.ts
  git commit -m "feat(codex): add hierarchical category taxonomy and multi-affiliation resolver"
  ```

---

### Task 2: Action & Move Rebalancing, Move Fisik vs Sosial, and Direct Dice Roller Linking
**Files:**
- Create: `src/rules/moveMechanics.ts`
- Modify: `src/rules/combatActions.ts`
- Modify: `src/data/fallbackCompendium.ts`
- Test: `tests/moveBalanceAndRoll.test.ts`
- Modify: `tests/combatActions.test.ts`

**Interfaces:**
- Produces: `STANDARD_PHYSICAL_MOVES`, `STANDARD_SOCIAL_MOVES`, `resolveMoveRollParameters(move, character)`, `ALL_BALANCED_BASIC_MOVES`.
- Consumes: `Character`, `CombatActionDefinition`.

- [ ] **Step 1: Write tests for move balancing, pros/cons, and roll parameter linking**
  - Test that every move has non-empty `pros`, `cons`, and `clearEffect`.
  - Test that Quick Jab has +1 to-hit bonus and Disrupt effect.
  - Test that Heavy Kick has d6 damage, Knockback effect, but -1 AC penalty on heavy miss.
  - Test that `resolveMoveRollParameters` correctly extracts `d20` + character stat modifier for check, and exact damage die (e.g. `1d4`, `1d6`) + modifier for damage.
  - Test that social moves (Intimidate, Taunt, Flirt, Support, De-escalate) have defined checks and composure effects.

- [ ] **Step 2: Run test to verify it fails**
  Run: `npm test tests/moveBalanceAndRoll.test.ts`
  Expected: FAIL.

- [ ] **Step 3: Implement balanced move definitions and mechanics in `src/rules/combatActions.ts` and `src/rules/moveMechanics.ts`**
  - Update `STANDARD_COMBAT_ACTIONS` to include physical moves and social moves with explicit tactical trade-offs.
  - Synchronize fallback definitions in `src/data/fallbackCompendium.ts`.
  - Implement helper `resolveMoveRollParameters(move, charStats)` returning die type, modifier, damage die, and roll label.

- [ ] **Step 4: Run tests to verify all pass**
  Run: `npm test tests/moveBalanceAndRoll.test.ts tests/combatActions.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/rules/combatActions.ts src/rules/moveMechanics.ts src/data/fallbackCompendium.ts tests/moveBalanceAndRoll.test.ts
  git commit -m "feat(rules): rebalance physical and social moves with tactical trade-offs and roll params"
  ```

---

### Task 3: Character Sheet Move Card Direct Rolling & Filter Tabs (Fisik vs Sosial)
**Files:**
- Modify: `src/views/CharacterSheetView.ts`
- Test: `tests/combatActions.test.ts`

**Interfaces:**
- Consumes: `STANDARD_PHYSICAL_MOVES`, `STANDARD_SOCIAL_MOVES`, `resolveMoveRollParameters`, `diceRollerModal`.

- [ ] **Step 1: Update moves filter bar in `CharacterSheetView.ts`**
  - Add primary category tabs:
    - `ALL` (Semua Aksi)
    - 🥋 `MOVE FISIK` (`basic_combat` / `physical`)
    - 💬 `MOVE SOSIAL` (`basic_social` / `social`)
    - 🏆 `EKSKUL / KLUB` (`club_move`)
    - 🎓 `SUBCLASS` (`subclass_move`)
    - ✨ `ARCHETYPE` (`archetype_move`)
  - Sub-filters: Action, Bonus Action, Reaction.

- [ ] **Step 2: Render direct roll buttons on each move card**
  - Add `[🎲 Check: +X]` button on the card linking to character modifier and triggering `diceRollerModal.show("d20", mod, label)`.
  - Add `[💥 Damage/Efek: YdZ+X]` button on the card triggering `diceRollerModal.show(die, mod, damageLabel)`.
  - Include tactical `+` (pros) and `-` (drawback) micro-badges so players understand strategic implications at a glance.

- [ ] **Step 3: Wire event handlers to prevent event bubbling when clicking roll buttons**
  - Clicking roll button rolls dice immediately; clicking card body opens the full detail drawer.

- [ ] **Step 4: Run tests & verify manual rendering test**
  Run: `npm test`
  Expected: All 19 files PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/views/CharacterSheetView.ts
  git commit -m "feat(ui): add physical vs social move filters and direct roll buttons on move cards"
  ```

---

### Task 4: Hierarchical Kamus Karakter (Codex) UI Overhaul
**Files:**
- Modify: `src/views/CodexCatalogView.ts`
- Modify: `src/views/CodexCategoryView.ts`
- Modify: `src/views/CodexDetailView.ts`
- Modify: `src/api/codex.ts`

**Interfaces:**
- Consumes: Hierarchy data from Task 1, `dmAuthStore`, `router`.

- [ ] **Step 1: Overhaul `CodexCatalogView.ts` to display Root Folders & Sub-Folders**
  - Structure into 3 major folder cards/panels:
    1. 🌸 **Housen Academy** (Sub-folders: Kelas 10-1 s/d 12-2, Klub & Organisasi, Faculty, Alumni)
    2. 👹 **SMA Kejuruan Touki** (Sub-folders: Kelas Touki, Geng & Aliansi Pelabuhan, Alumni)
    3. 🌆 **Luar Sekolah & Lainnya** (Warga Kota, Tempat Kerja Baito, Tokoh Luar)
  - Include live character count badge on each folder/sub-folder.

- [ ] **Step 2: Enhance `CodexCategoryView.ts` to support multi-tag browsing**
  - When opening a subfolder (e.g. `Klub Tata Boga`), query all characters having that affiliation.
  - Character cards display multiple affiliation chips (e.g., `11-1` + `🍳 Tata Boga` + `♥ Heroine`).
  - Add quick sub-category selector inside the category header for seamless hopping between classes and clubs.

- [ ] **Step 3: Update `CodexDetailView.ts` with multi-affiliation tags**
  - Render all active category tags at the top; clicking any tag routes directly back to that category.

- [ ] **Step 4: Run tests to ensure navigation and security integrity**
  Run: `npm test tests/codexSecurity.test.ts tests/codexHierarchy.test.ts`
  Expected: PASS.

- [ ] **Step 5: Commit**
  ```bash
  git add src/views/CodexCatalogView.ts src/views/CodexCategoryView.ts src/views/CodexDetailView.ts src/api/codex.ts
  git commit -m "feat(codex): implement folder-based hierarchical catalog and multi-category views"
  ```

---

### Task 5: DM Character & Love Interest Creator / Editor Wizard with Supabase Sync
**Files:**
- Modify: `src/components/CodexCharacterEditorModal.ts`
- Modify: `src/components/LoveInterestDetailModal.ts`
- Modify: `src/api/codex.ts`
- Modify: `src/api/loveInterests.ts`

**Interfaces:**
- Consumes: `dmAuthStore`, `dmUpsertCharacter`, `dmUploadCharacterImage`, `showToast`.

- [ ] **Step 1: Rebuild `CodexCharacterEditorModal.ts` with multi-category checklist and guided sections**
  - Section 1: **Identitas & Afiliasi**:
    - Multi-category checkboxes: School (Housen/Touki/Luar), Classroom selection, Multiple Clubs/Organizations (OSIS, Kokuhou, Cooking, Occult, Gaming, dll.).
    - Personal info: Name, Furigana, Nicknames, Tagline, Gender, Age, Birthday, Zodiac, MBTI, Archetype.
    - Love Interest toggle: If checked, marks as canon heroine.
  - Section 2: **Pasfoto ID & Penampilan**:
    - ID photo file upload with live preview and permanent storage upload via `dmUploadCharacterImage`.
    - Detailed appearance markdown field.
  - Section 3: **Statistik & Vitals**:
    - Physique, Intelligent, Looks, Mind, Talent, Luck + auto-calculated modifiers.
    - HP Fisik Max & Composure Max.
  - Section 4: **Kepribadian & Romansa (Love Interest)**:
    - Dere pattern, Flaws, Likes, Dislikes, Gift preferences (Favorite, Normal, Disliked).
    - Confession DC, Base Heart Level (1-10), Heart milestones.
  - Section 5: **Rahasia & Catatan DM**:
    - Tier 3 Secrets, Deepest Thoughts, Catatan Eksklusif DM.

- [ ] **Step 2: Add DM access gate**
  - If user is not authenticated as DM, refuse opening and show `dmAuthModal`.

- [ ] **Step 3: Connect Edit button in `LoveInterestDetailModal.ts`**
  - When DM is active, display `✏️ Edit Profil Karakter (DM)` button in the header/footer of `LoveInterestDetailModal`.
  - Clicking it loads character into `CodexCharacterEditorModal.openForEdit(char, onSaved)`.

- [ ] **Step 4: Ensure cloud persistence and local cache update**
  - Ensure `dmUpsertCharacter` writes all affiliations and sections to Supabase.
  - Upon save, dynamically update `cachedDynamicLoveInterests` and refresh UI without reload.

- [ ] **Step 5: Run full test suite & codex validation**
  Run: `npm test && npm run codex:validate`
  Expected: All tests PASS.

- [ ] **Step 6: Commit**
  ```bash
  git add src/components/CodexCharacterEditorModal.ts src/components/LoveInterestDetailModal.ts src/api/codex.ts src/api/loveInterests.ts
  git commit -m "feat(dm): implement multi-category character creator and editor wizard with Supabase sync"
  ```

---

### Task 6: Verification, End-to-End Build & Validation
**Files:**
- All modified files
- Verification script / tests

- [ ] **Step 1: Run complete test suite**
  Run: `npm test`
  Expected: 100% tests PASS.

- [ ] **Step 2: Run Codex validation tool**
  Run: `npm run codex:validate`
  Expected: 48/48 canon character dossiers valid.

- [ ] **Step 3: Run full TypeScript compilation and production build**
  Run: `npm run build`
  Expected: Clean build without errors in `dist/`.

- [ ] **Step 4: Commit**
  ```bash
  git add -A
  git commit -m "chore: verify end-to-end build and test suite for codex hierarchy and moves rework"
  ```
