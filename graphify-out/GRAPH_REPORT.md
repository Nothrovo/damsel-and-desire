# Graph Report - Damsel and Desire  (2026-10-18)

## Corpus Check
- 159 files · ~4,031,059 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: (none) 3, .example 1, .css 1)

## Summary
- 1441 nodes · 3567 edges · 106 communities (50 shown, 56 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d107d07f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- DamselDesireApp
- map3DUtils.ts
- syncCanonNpcs.js
- main.ts
- CampaignDetailView.ts
- all_migrations_combined.sql
- types/index.ts
- handbook/index.ts
- 1. TOP 10 ANIME ROMCOM SMA & PLOT POINTS
- BuilderWizardView.ts
- CharacterSheetView.ts
- Toast.ts
- dmRevealHistoryModal
- loveInterests.ts
- 20261008000003_codex_system.sql
- achievementAwardModal
- codexSecurity.test.ts
- progression.ts
- CodexDetailView.ts
- package.json
- PLAN_CAMPAIGN_HARI_3_4_DAN_FAKSI.md
- 20261007000001_initial_schema.sql
- importCodex.js
- EditCharacterModal.ts
- compilerOptions
- dmAuthStore
- 20261007000002_compendium_tables.sql
- characters.ts
- build_charsheet.py
- api/codex.ts
- 20261007000006_game_logic_rpc.sql
- ref_path
- CodexCharacterEditorModal.ts
- buildLoveInterests.js
- compendium.ts
- subclassSelectModal
- 🌸 PANDUAN CAMPAIGN SESI 1 — PEKAN PERTAMA BULAN APRIL: *THE FIRST ENCOUNTER*
- SlideOverDrawer.ts
- quickVitalsPopover
- ItemDetailModal.ts
- 🌟 Fitur Utama (Major Features)
- 🌸 [Nama Lengkap Romaji] ([Kanji])
- CodexCatalogView.ts
- scripts
- dmAuthModal
- 20261008000002_feat_and_achievement_system.sql
- public.get_love_interest_detail
- public.campaign_members
- 20261013000001_living_cost_and_savings_fix.sql
- vite-env.d.ts
- public.subclass_moves
- data.js
- 20261009000001_school_calendar.sql
- vercel.json
- Luna Hernandez (Front-End Specialist)
- Marcus Vance (Back-End & Database Architect)
- vitest
- FeatPickerModal.ts
- Draft Sementara
- Character
- baitoModal
- Contoh Respons
- createCanonExpansionCharacters.py
- ATURAN PEMBUATAN KARAKTER, KONSISTENSI DATABASE & DEMOGRAFI KELAS
- showToast
- AbilityKey
- savingsModal
- backstoryModal
- CodexRealtimeManager

## God Nodes (most connected - your core abstractions)
1. `DamselDesireApp` - 92 edges
2. `showToast()` - 79 edges
3. `Character` - 34 edges
4. `updateCharacterDirect()` - 30 edges
5. `calculateEffectiveStats()` - 26 edges
6. `attachSheetEvents()` - 26 edges
7. `router` - 24 edges
8. `dmAuthStore` - 24 edges
9. `Map2DRenderer` - 23 edges
10. `Map3DRenderer` - 22 edges

## Surprising Connections (you probably didn't know these)
- `createMockCharacter()` --calls--> `ensureGradeFeatGrants()`  [EXTRACTED]
  tests/featProgression.test.ts → src/rules/migration.ts
- `initApp()` --indirect_call--> `renderBuilderWizardView()`  [INFERRED]
  src/main.ts → src/views/BuilderWizardView.ts
- `initApp()` --indirect_call--> `renderCalendarView()`  [INFERRED]
  src/main.ts → src/views/CalendarView.ts
- `initApp()` --indirect_call--> `renderCharacterSheetView()`  [INFERRED]
  src/main.ts → src/views/CharacterSheetView.ts
- `initApp()` --indirect_call--> `renderCodexCatalogView()`  [INFERRED]
  src/main.ts → src/views/CodexCatalogView.ts

## Import Cycles
- None detected.

## Communities (106 total, 56 thin omitted)

### Community 0 - "DamselDesireApp"
Cohesion: 0.05
Nodes (3): app, DamselDesireApp, SUPABASE_CONFIG

### Community 1 - "map3DUtils.ts"
Cohesion: 0.06
Nodes (49): three, Map2DRenderer, Map2DRendererOptions, Map3DRenderer, Map3DRendererOptions, create3DRoomGroup(), createCampusFacilitiesGroup(), createChainLinkFence() (+41 more)

### Community 2 - "syncCanonNpcs.js"
Cohesion: 0.20
Nodes (12): allFiles, buildPayload(), extractH3Subsections(), findSectionsByKeyword(), mapClassRoomToCategory(), payloads, scanDir(), SESSION1_SLUGS (+4 more)

### Community 3 - "main.ts"
Cohesion: 0.07
Nodes (39): getCurrentUser(), getProfile(), getSession(), onAuthStateChange(), signInWithOAuth(), signInWithOtp(), signOut(), updateProfile() (+31 more)

### Community 4 - "CampaignDetailView.ts"
Cohesion: 0.12
Nodes (30): createCampaign(), generateJoinCode(), getCampaign(), getCampaignMembers(), getUserRoleInCampaign(), joinCampaignByCode(), listMyCampaigns(), getCharacterSecret() (+22 more)

### Community 5 - "all_migrations_combined.sql"
Cohesion: 0.07
Nodes (41): idx_archetype_moves_archetype, idx_calendar_progress_char, idx_campaign_members_user, idx_campaigns_join_code, idx_campaigns_owner, idx_character_secrets_campaign, idx_character_secrets_char, idx_characters_campaign (+33 more)

### Community 6 - "types/index.ts"
Cohesion: 0.05
Nodes (76): @supabase/supabase-js, applyAddCustomEvent(), applyDeleteCustomEvent(), applyMarkMonthEvents(), applySaveMonthNote(), applySetCurrentMonth(), applyToggleEventDone(), fetchSchoolCalendarState() (+68 more)

### Community 7 - "handbook/index.ts"
Cohesion: 0.11
Nodes (25): ch0_cover_intro, CHAPTER_10_ROMANCE_SECRETS, CHAPTER_11_DM_APPENDIX, ch1_character_creation, ch2_abilities_skills, CHAPTER_3_ARCHETYPES, CHAPTER_4_EKSKUL, CHAPTER_5_SOCIAL_FINANCES (+17 more)

### Community 8 - "1. TOP 10 ANIME ROMCOM SMA & PLOT POINTS"
Cohesion: 0.05
Nodes (37): 10. Bucchigiri?! / Shonan Junai Gumi, 10. Rascal Does Not Dream of Bunny Girl Senpai, 1. Kaguya-sama: Love Is War (*Kaguya-sama wa Kokurasetai*), 1. Tokyo Revengers, 1. TOP 10 ANIME ROMCOM SMA & PLOT POINTS, 2. TOP 10 ANIME GENG BERANDAL SEKOLAH & PLOT POINTS, 2. Toradora!, 2. Wind Breaker (+29 more)

### Community 9 - "BuilderWizardView.ts"
Cohesion: 0.12
Nodes (37): getArchetypeReworkData(), getSocialClassReworkData(), calculateAbilityModifier(), calculatePointBuyTotal(), calculateProficiencyBonus(), isValidStandardArray(), POINT_BUY_COSTS, rupiahToYen() (+29 more)

### Community 10 - "CharacterSheetView.ts"
Cohesion: 0.11
Nodes (37): getCalendarProgress(), toggleCalendarEvent(), applyVitalChangeRpc(), renderSheetSkeleton(), formatModifier(), AbilityCompendium, BasicActionCompendium, CalendarEventCompendium (+29 more)

### Community 11 - "Toast.ts"
Cohesion: 0.22
Nodes (6): adjustSavingsRpc(), longRestRpc(), shortRestRpc(), VitalType, resetFeatUsage(), characterStore

### Community 13 - "loveInterests.ts"
Cohesion: 0.13
Nodes (17): fetchDynamicLoveInterestDetail(), fetchDynamicLoveInterests(), matchTargetToLoveInterest(), normalizeDbToLoveInterest(), addLoveInterestModal, escapeHtml(), escapeHtml(), loveInterestDetailModal (+9 more)

### Community 14 - "20261008000003_codex_system.sql"
Cohesion: 0.09
Nodes (15): idx_codex_characters_category, idx_codex_characters_slug, idx_codex_dm_sessions_token, idx_codex_reveals_char, idx_codex_sections_char, public.codex_categories, public.codex_character_sections, public.codex_characters (+7 more)

### Community 17 - "progression.ts"
Cohesion: 0.14
Nodes (34): getCachedArchetypes(), getCachedEkskul(), migrateCharacter(), migrateCharacters(), MigrationOptions, normalizeGradeAndLevel(), calculateComposureGainAtLevel(), calculateEffectiveStats() (+26 more)

### Community 18 - "CodexDetailView.ts"
Cohesion: 0.21
Nodes (24): buildCanonCard(), buildCanonDetail(), dmGetCharacter(), dmIntroduce(), dmListAll(), dmLockAll(), dmSetReveal(), dmSetTierReveal() (+16 more)

### Community 19 - "package.json"
Cohesion: 0.12
Nodes (15): dependencies, @supabase/supabase-js, three, @types/three, description, devDependencies, typescript, vite (+7 more)

### Community 20 - "PLAN_CAMPAIGN_HARI_3_4_DAN_FAKSI.md"
Cohesion: 0.09
Nodes (22): 1. RINGKASAN KRISIS & OBJEKTIF UTAMA (THE TICKING CLOCK), 2. PETA KEKUATAN & STRUKTUR TIGA FAKSI, 3. JALAN CERITA HARI 3 (RABU), 4. JALAN CERITA HARI 4 (KAMIS), 5. TABEL STAT & MEKANIK BOS PERTARUNGAN, 6. 🔒 [SPOILER GM/DM ONLY] RAHASIA PLOT & TWIST DI BALIK LAYAR, Bos Lapangan: Kanzawa Ryuuji (金沢 竜二), Bos Tertinggi: Onizuka Gouki ("The Red Ogre") (+14 more)

### Community 21 - "20261007000001_initial_schema.sql"
Cohesion: 0.19
Nodes (18): idx_calendar_progress_char, idx_campaign_members_user, idx_campaigns_join_code, idx_campaigns_owner, idx_character_secrets_campaign, idx_character_secrets_char, idx_characters_campaign, idx_characters_owner (+10 more)

### Community 22 - "importCodex.js"
Cohesion: 0.31
Nodes (7): buildCharacterPayload(), extractH3Subsections(), findSectionsByKeyword(), getObfuscatedAssetPath(), main(), scan(), mapClassRoomToCategory()

### Community 23 - "EditCharacterModal.ts"
Cohesion: 0.19
Nodes (8): ALLOWED_MIME_TYPES, uploadAvatar(), editCharacterModal, escapeAttr(), ArchetypeCompendium, EkskulCompendium, isDmPinValid(), SocialClassCompendium

### Community 24 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, isolatedModules, lib, module, moduleDetection, moduleResolution, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 25 - "dmAuthStore"
Cohesion: 0.19
Nodes (5): dmLogin(), dmLogout(), dmVerifySession(), dmAuthStore, Listener

### Community 26 - "20261007000002_compendium_tables.sql"
Cohesion: 0.19
Nodes (15): idx_archetype_moves_archetype, idx_ekskul_moves_ekskul, idx_ekskul_subclasses_ekskul, idx_skills_ability, public.abilities, public.archetype_moves, public.archetypes, public.basic_actions (+7 more)

### Community 27 - "characters.ts"
Cohesion: 0.42
Nodes (14): createCharacterRpc(), deleteCharacter(), getCharacter(), getLocalRoster(), importLegacyCharacter(), isUuid(), listAllCharacters(), normalizeCharacter() (+6 more)

### Community 28 - "build_charsheet.py"
Cohesion: 0.15
Nodes (3): build_charsheet(), add_p(), format_run()

### Community 29 - "api/codex.ts"
Cohesion: 0.12
Nodes (13): SUPABASE_STORAGE_PORTRAITS_URL, ALL_CANON_NPCS, getCanonNpcBySlug(), CANON_SESSION1_NPCS, CodexCategory, CodexCharacterCard, CodexCharacterDetail, CodexSectionDetail (+5 more)

### Community 30 - "20261007000006_game_logic_rpc.sql"
Cohesion: 0.19
Nodes (5): public.adjust_savings(), public.apply_vital_change(), public.create_character(), public.long_rest(), public.short_rest()

### Community 32 - "CodexCharacterEditorModal.ts"
Cohesion: 0.23
Nodes (5): compressImageFile(), DEFAULT_CODEX_CATEGORIES, dmDeleteCharacter(), dmUploadCharacterImage(), codexCharacterEditorModal

### Community 33 - "buildLoveInterests.js"
Cohesion: 0.36
Nodes (8): buildLoveInterests(), findSection(), mapClassRoomToCategory(), parseDateSpots(), parseGifts(), parseHeartMilestones(), parsePersonalitySection(), scanDir()

### Community 34 - "compendium.ts"
Cohesion: 0.16
Nodes (19): getCompendiumAbilities(), getCompendiumArchetypes(), getCompendiumBasicActions(), getCompendiumCalendarEvents(), getCompendiumEkskul(), getCompendiumSocialClasses(), ALL_REWORKED_ARCHETYPE_IDS, ALL_REWORKED_SOCIAL_CLASS_IDS (+11 more)

### Community 36 - "🌸 PANDUAN CAMPAIGN SESI 1 — PEKAN PERTAMA BULAN APRIL: *THE FIRST ENCOUNTER*"
Cohesion: 0.07
Nodes (29): ⏰ 1. Struktur Ritme Harian (Daily Slot Loop) untuk DM, 👥 2. Roster Lengkap 21 Karakter Canon Sekolah, 🌸 3. HARI 1 (SENIN): Gerbang Sakura & Upacara Akbar (*Nyūgakushiki*), 🏫 4. HARI 2 (SELASA): Homeroom Perdana Chihiro-sensei, Penentuan Meja & Peluit Koridor, 🩺 5. HARI 3 (RABU): Tes Kemampuan Awal, Rahasia Perpustakaan & Uji Fisik Lapangan, ⚔️ 6. HARI 4 (KAMIS): Pekan Demonstrasi Panggung & Perekrutan Klub (*Bukatsu Showcase*), 🍰 7. HARI 5 (JUMAT): Piket Senja, Stempel Ruang OSIS & Pesta Tartlet Penutup, 📈 8. Panduan Pasca-Pekan Pertama: Evaluasi Afeksi & Transisi Akhir Pekan (+21 more)

### Community 37 - "SlideOverDrawer.ts"
Cohesion: 0.27
Nodes (5): DrawerAction, DrawerContent, DrawerStat, escapeHtml(), slideOverDrawer

### Community 39 - "ItemDetailModal.ts"
Cohesion: 0.13
Nodes (9): addItemModal, escapeHtml(), diceRollerModal, escapeHtml(), itemDetailModal, getAllCompendiumItems(), getItemDetails(), MASTER_ITEM_REGISTRY (+1 more)

### Community 40 - "🌟 Fitur Utama (Major Features)"
Cohesion: 0.11
Nodes (18): 1. 💖 Affection Tracker & Dynamic Love Interest System (DM Only), 1. Menjalankan Server Pengembangan Lokal, 2. 🌸 Kamus Karakter & Direktori Sekolah (`/codex`), 2. Membangun Aplikasi Produksi & Offline Handbook, 3. 📅 Kalender Sekolah Interaktif 12 Bulan (`/calendar`), 3. Menjalankan Unit Tests, 4. 📖 Modular Player's Handbook (PHB), 4. Sinkronisasi Data Love Interest & Codex (+10 more)

### Community 41 - "🌸 [Nama Lengkap Romaji] ([Kanji])"
Cohesion: 0.14
Nodes (13): 👑 Catatan Khusus DM (DM Notes - Mode DM Only), Celah Emosional & Kelemahan Batin, Gaya Bicara & Kebiasaan Khas, 👥 Jaringan Relasi (Relationships - Tier 2), Kehidupan di Housen Academy & Klub Ekskul, 🧠 Kepribadian & Sifat (Personality - Tier 2), 📖 Latar Belakang & Kehidupan Klub (Background - Tier 2), Masa Kecil & Keluarga (+5 more)

### Community 42 - "CodexCatalogView.ts"
Cohesion: 0.35
Nodes (9): fetchCodexCategories(), attachDmCodexBarEvents(), renderDmCodexBar(), CATEGORY_ICONS, getCategoryAccentBorder(), getCategoryFooterLabel(), renderCategoriesGrid(), renderCodexCatalogView() (+1 more)

### Community 43 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, build, build:handbook, codex:import, codex:validate, dev, preview, test

### Community 46 - "20261008000002_feat_and_achievement_system.sql"
Cohesion: 0.70
Nodes (4): idx_compendium_feats_category, idx_compendium_feats_subcategory, public.compendium_achievements, public.compendium_feats

### Community 88 - "Luna Hernandez (Front-End Specialist)"
Cohesion: 0.20
Nodes (9): 🤝 Batasan Kerja & Kolaborasi dengan Tim Backend, 🎨 Brand Identity, Tema & Estetika Visual, Format Laporan Setiap Selesai Tugas, Luna Hernandez (Front-End Specialist), 🎭 Persona & Gaya Komunikasi, 🛠️ Stack Teknologi (Damsel & Desire), 📋 Standar Kode & Protokol Laporan Akhir, Standar Koding (+1 more)

### Community 89 - "Marcus Vance (Back-End & Database Architect)"
Cohesion: 0.20
Nodes (9): 🔒 Aturan Keamanan & Akses Data (CRITICAL & STRICT), 🤝 Batasan Kerja & Kolaborasi dengan Luna (Front-End), Format Laporan Setiap Selesai Tugas, Marcus Vance (Back-End & Database Architect), 🎭 Persona & Gaya Komunikasi, 📜 Protokol Konsistensi Kanon & Database (Housen Academy), 🛠️ Stack Teknologi Backend & Arsitektur Data, 📋 Standar Kode & Protokol Laporan Akhir (+1 more)

### Community 90 - "vitest"
Cohesion: 0.36
Nodes (6): vitest, getCompendiumEquipmentPacks(), ALL_ACHIEVEMENTS, FALLBACK_DD_DATA, ALL_FEATS, AchievementCompendium

### Community 91 - "FeatPickerModal.ts"
Cohesion: 0.17
Nodes (13): featPickerModal, FeatPickerOptions, checkFeatEligibility(), getAvailableFeats(), grantFeat(), LevelUpChoices, retrainFeat(), takeFeat() (+5 more)

### Community 92 - "Draft Sementara"
Cohesion: 0.25
Nodes (7): Archtype (Ras), Brainstorms, Draft Sementara, Ekskul (Class), Notes, Social Class (Background), Stat

### Community 93 - "Character"
Cohesion: 0.22
Nodes (9): levelUpWizardModal, MigrationResult, canLevelUp(), getLevelLabel(), getSemesterForLevel(), levelUp(), Character, CharacterChangeLogEntry (+1 more)

### Community 96 - "Contoh Respons"
Cohesion: 0.29
Nodes (6): /ask — Direct & To-The-Point Answering Mode, Contoh 1: Perintah Terminal, Contoh 2: Pertanyaan Konseptual, Contoh 3: Solusi Error, Contoh Respons, Prinsip Utama

### Community 98 - "createCanonExpansionCharacters.py"
Cohesion: 0.48
Nodes (3): generate_markdown(), generate_prompt_md(), main()

### Community 99 - "ATURAN PEMBUATAN KARAKTER, KONSISTENSI DATABASE & DEMOGRAFI KELAS"
Cohesion: 0.40
Nodes (4): 1. PANTANGAN KARAKTER FIKTIF SEKALI PAKAI (ANTI-DISPOSABLE CHARACTERS), 2. PROTOKOL PENAMBAHAN KARAKTER BARU (MANDATORY REGISTRATION), 3. STRUKTUR & DEMOGRAFI KELAS, ATURAN PEMBUATAN KARAKTER, KONSISTENSI DATABASE & DEMOGRAFI KELAS

### Community 100 - "showToast"
Cohesion: 0.17
Nodes (15): dmBatchIntroduce(), dmBatchLockAll(), dmBatchSetTier(), showToast(), codexRealtime, CodexRealtimePayload, CodexRevealListener, createSakuraPetals() (+7 more)

### Community 102 - "AbilityKey"
Cohesion: 0.50
Nodes (4): EffectiveCharacterStats, AbilityKey, CharacterAbilities, BuilderDraft

## Knowledge Gaps
- **2 isolated node(s):** `@types/three`, `typescript`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 428 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **56 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `showToast()` connect `showToast` to `main.ts`, `CampaignDetailView.ts`, `types/index.ts`, `BuilderWizardView.ts`, `CharacterSheetView.ts`, `Toast.ts`, `dmRevealHistoryModal`, `loveInterests.ts`, `achievementAwardModal`, `CodexDetailView.ts`, `EditCharacterModal.ts`, `api/codex.ts`, `CodexCharacterEditorModal.ts`, `compendium.ts`, `subclassSelectModal`, `quickVitalsPopover`, `ItemDetailModal.ts`, `CodexCatalogView.ts`, `dmAuthModal`, `vitest`, `FeatPickerModal.ts`, `Character`, `baitoModal`, `savingsModal`, `backstoryModal`?**
  _High betweenness centrality (0.047) - this node is a cross-community bridge._
- **What connects `@types/three`, `typescript` to the rest of the system?**
  _2 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `DamselDesireApp` be split into smaller, more focused modules?**
  _Cohesion score 0.05442329227323628 - nodes in this community are weakly interconnected._
- **Why does `vitest` connect `vitest` to `map3DUtils.ts`, `compendium.ts`, `rlsPolicies.test.ts`, `types/index.ts`, `handbook/index.ts`, `ItemDetailModal.ts`, `BuilderWizardView.ts`, `Toast.ts`, `loveInterests.ts`, `codexSecurity.test.ts`, `progression.ts`, `package.json`, `EditCharacterModal.ts`, `FeatPickerModal.ts`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Should `map3DUtils.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05659583420997265 - nodes in this community are weakly interconnected._
- **Should `main.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06826923076923076 - nodes in this community are weakly interconnected._
- **Should `CampaignDetailView.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12010796221322537 - nodes in this community are weakly interconnected._