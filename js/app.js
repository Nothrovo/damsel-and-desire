/**
 * DAMSEL & DESIRE - Application State & Interactive Logic
 * Client-Side Character Builder & Interactive Sheet
 * v1.1 — Strict Standard Array, Point Buy Enforcement, Skill Limit 4,
 *         Equipment Packs, Long Rest Finance, Calendar Checkbox, DM PIN Auth
 */

const DM_PIN = "157017";

const SUPABASE_CONFIG = {
  url: "https://oavkhnjigdqacvqfkzpf.supabase.co",
  anonKey: "sb_publishable_M_ZCTbtu0UYlfiAyLON_2Q_jYWHAiPI"
};

class DamselDesireApp {
  constructor() {
    this.storageKey = "damsel_and_desire_roster_v1";
    this.roster = this.loadRoster();
    this.currentCharacter = null;
    this.builderDraft = null;
    this.builderStep = 1;
    this.abilityMethod = "standard"; // 'standard' | 'pointbuy'
    this.dmModeUnlocked = false;
    this.diceHistory = [];

    // Supabase Cloud & Room State
    this.supabase = null;
    this.currentRoom = localStorage.getItem("dd_current_room") || null;
    this.realtimeChannel = null;

    if (this.roster.length === 0) {
      this.seedSampleCharacter();
    }
  }

  init() {
    this.initSupabase();
    this.renderRoster();
    this.setupEventListeners();
    this.handleRoute();
  }

  setupEventListeners() {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.getElementById("diceModal").style.display = "none";
        document.getElementById("avatarModal").style.display = "none";
      }
    });
    window.addEventListener("hashchange", () => this.handleRoute());
  }

  handleRoute() {
    const hash = window.location.hash;
    if (hash === "#builder") {
      if (!this.builderDraft) this.startNewCharacter();
      else this.showView("builder");
    } else if (hash === "#sheet" || hash.startsWith("#sheet=")) {
      const charId = hash.includes("=") ? hash.split("=")[1] : (this.roster[0]?.id || "char_sample_01");
      this.openCharacterSheet(charId);
    } else {
      this.showView("landing");
    }
  }

  // =========================================================================
  // STORAGE & DATA PERSISTENCE
  // =========================================================================
  loadRoster() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveRoster() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.roster));
    } catch (e) {
      this.showToast("Gagal menyimpan ke penyimpanan lokal.");
    }
  }

  seedSampleCharacter() {
    const sample = {
      id: "char_sample_01",
      name: "Hououin Kyouma",
      grade: 3, // Kelas 11
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Okabe",
      ekskulId: "kir_osn",
      socialClassId: "medium",
      archetypeId: "emo",
      baseAbilities: { physique: 8, intelligent: 15, looks: 10, mind: 14, talent: 13, luck: 12 },
      proficientSkills: ["academic", "street", "emotional", "awareness"],
      proficientSaves: ["intelligent", "mind"],
      physicalHpCurrent: 8, physicalHpMax: 8, physicalHpTemp: 0,
      composureCurrent: 12, composureMax: 12, composureTemp: 0,
      restDiceTotal: 3, restDiceSpent: 0,
      heartInspiration: true,
      dailyMoney: "¥1,000 / Rp 100,000", dailyMoneyAmount: 1000,
      savings: "¥15,000 / Rp 1,500,000", savingsAmount: 15000,
      job: "Baito Toko Elektronik Akihabara", jobWageAmount: 500,
      bagItems: ["Buku Pelajaran & Buku Tulis Catatan", "Kotak Pensil & Penghapus Lengkap", "Smartphone & Earphone Kabel", "Kartu Pelajar Sekolah", "Payung Lipat Jaga-Jaga Hujan", "Buku Catatan Eksperimen", "Set Tabung Reaksi Kecil", "Kacamata Pelindung Lab", "Earphone Noise-Cancelling", "Buku Harian Terkunci", "Gelang Karet Hitam Beberapa"],
      keepsakes: ["Jimat Omamori Cinta (Kuil)"],
      calendarChecked: [],
      personality: "Berbicara dramatis dengan sebutan 'Hououin Kyouma' diri sendiri. Cenderung introvert tapi memiliki ikatan kuat dengan orang-orang yang dipercaya.",
      ideals: "Membuktikan teori waktu terkonvergensi dan menyelamatkan semua orang yang berarti tanpa harus mengorbankan masa depan.",
      bonds: "Janji untuk melindungi Mayuri dan teman-teman lab dari segala bahaya yang datang.",
      flaws: "Terlalu obsesi dengan teori-teori sendiri sampai sering lupa makan dan tidur. Tidak mau mengakui kelemahan di depan orang lain.",
      targets: [{ name: "Makise Kurisu", status: "Rival Akademis", affection: 7, secret: "Sebenarnya sangat mengagumi kedalaman penelitiannya. Deg-degan tiap kali berdebat soal teori ilmiah." }]
    };
    this.roster.push(sample);
    this.saveRoster();
  }

  // =========================================================================
  // NAVIGATION & VIEW SWITCHING
  // =========================================================================
  showView(viewName) {
    document.querySelectorAll(".view-section").forEach(el => el.classList.remove("active"));
    if (viewName === "landing") { document.getElementById("viewLanding").classList.add("active"); this.renderRoster(); }
    else if (viewName === "builder") document.getElementById("viewBuilder").classList.add("active");
    else if (viewName === "sheet") document.getElementById("viewSheet").classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 250); }, 3000);
  }

  // =========================================================================
  // VIEW 1: ROSTER FUNCTIONS
  // =========================================================================
  renderRoster() {
    const grid = document.getElementById("rosterGrid");
    const empty = document.getElementById("rosterEmptyState");
    const countBadge = document.getElementById("rosterCountBadge");
    const query = (document.getElementById("searchRosterInput")?.value || "").toLowerCase().trim();
    grid.innerHTML = "";
    const filtered = this.roster.filter(char => {
      if (!query) return true;
      const eks = DD_DATA.ekskul.find(e => e.id === char.ekskulId)?.name || "";
      const arc = DD_DATA.archetypes.find(a => a.id === char.archetypeId)?.name || "";
      return char.name.toLowerCase().includes(query) || eks.toLowerCase().includes(query) || arc.toLowerCase().includes(query);
    });
    countBadge.textContent = `${this.roster.length} Karakter`;
    if (filtered.length === 0) { empty.style.display = "block"; return; }
    empty.style.display = "none";
    filtered.forEach(char => {
      const eks = DD_DATA.ekskul.find(e => e.id === char.ekskulId);
      const arc = DD_DATA.archetypes.find(a => a.id === char.archetypeId);
      const soc = DD_DATA.socialClasses.find(s => s.id === char.socialClassId);
      const card = document.createElement("div");
      card.className = "char-card";
      card.innerHTML = `
        <div class="char-card-banner"><img class="char-card-avatar" src="${char.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=' + char.id}" alt="${char.name}"></div>
        <div class="char-card-body">
          <h3 class="char-card-name">${this.escapeHtml(char.name)}</h3>
          <div class="char-card-meta">
            <span class="meta-tag tag-species">${arc ? arc.name.split(' ')[0] : 'Archetype'}</span>
            <span class="meta-tag tag-class">${eks ? eks.name.split(' ')[0] : 'Ekskul'}</span>
            <span class="meta-tag tag-bg">${soc ? soc.name.split(' ')[0] : 'Social'}</span>
            <span class="meta-tag tag-level">Kelas ${char.grade === 1 ? '10' : char.grade === 2 ? '10 (Sm.2)' : char.grade === 3 ? '11' : char.grade === 4 ? '11 (Sm.2)' : '12'}</span>
          </div>
          <div class="char-card-vitals">
            <div class="card-vital-item"><span>PHYSICAL HP</span><span style="color:#60a5fa">${char.physicalHpCurrent} / ${char.physicalHpMax}</span></div>
            <div class="card-vital-item"><span>COMPOSURE</span><span style="color:#f43f5e">${char.composureCurrent} / ${char.composureMax}</span></div>
          </div>
          <div class="char-card-actions">
            <button class="btn btn-primary btn-sm" style="flex:1" onclick="app.openCharacterSheet('${char.id}')">Buka Sheet</button>
            <button class="btn btn-secondary btn-sm" onclick="app.editCharacterInBuilder('${char.id}')" title="Edit Karakter">✏️</button>
            <button class="btn btn-secondary btn-sm" onclick="app.duplicateCharacter('${char.id}')" title="Duplikasi">📑</button>
            <button class="btn btn-secondary btn-sm" onclick="app.deleteCharacter('${char.id}')" title="Hapus Karakter" style="color:#ef4444">🗑️</button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  duplicateCharacter(charId) {
    const original = this.roster.find(c => c.id === charId);
    if (!original) return;
    const copy = JSON.parse(JSON.stringify(original));
    copy.id = "char_" + Date.now();
    copy.name = original.name + " (Copy)";
    this.roster.push(copy);
    this.saveRoster();
    if (this.supabase) {
      this.saveCharacterToCloud(copy);
    }
    this.renderRoster();
    this.showToast(`Karakter ${copy.name} berhasil diduplikasi.`);
  }

  async deleteCharacter(charId) {
    const char = this.roster.find(c => c.id === charId);
    if (!char) return;
    if (confirm(`Yakin ingin menghapus karakter "${char.name}"?`)) {
      this.roster = this.roster.filter(c => c.id !== charId);
      this.saveRoster();
      if (this.supabase) {
        await this.deleteCharacterFromCloud(charId);
      }
      this.renderRoster();
      this.showToast(`Karakter "${char.name}" dihapus.`);
    }
  }

  // =========================================================================
  // VIEW 2: CHARACTER BUILDER (WIZARD)
  // =========================================================================
  startNewCharacter() {
    this.builderDraft = {
      id: "char_" + Date.now(),
      name: "", grade: 1,
      avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=" + Math.random().toString(36).substring(7),
      ekskulId: "kendo", socialClassId: "medium", archetypeId: "delinquent",
      baseAbilities: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
      standardArrayAssigned: { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 },
      proficientSkills: ["power", "agility"],
      proficientSaves: ["physique", "mind"],
      dailyMoney: "¥1,000 / Rp 100,000", dailyMoneyAmount: 1000,
      savings: "¥15,000 / Rp 1,500,000", savingsAmount: 15000,
      job: "Pernah Bekerja Paruh Waktu Musiman", jobWageAmount: 0,
      bagItems: [],
      keepsakes: ["Jimat Omamori Cinta (Kuil)"],
      calendarChecked: [],
      personality: "", ideals: "", bonds: "", flaws: "",
      targets: []
    };
    this.builderStep = 1;
    this.abilityMethod = "standard";
    this.renderBuilderForm();
    this.showView("builder");
  }

  editCharacterInBuilder(charId) {
    const char = this.roster.find(c => c.id === charId);
    if (!char) return;
    this.builderDraft = JSON.parse(JSON.stringify(char));
    if (!this.builderDraft.standardArrayAssigned) {
      this.builderDraft.standardArrayAssigned = { ...this.builderDraft.baseAbilities };
    }
    this.builderStep = 1;
    this.abilityMethod = "standard";
    this.renderBuilderForm();
    this.showView("builder");
  }

  editCurrentInBuilder() {
    if (this.currentCharacter) this.editCharacterInBuilder(this.currentCharacter.id);
  }

  renderBuilderForm() {
    const draft = this.builderDraft;
    document.getElementById("builderNameInput").value = draft.name || "";
    document.getElementById("builderGradeSelect").value = draft.grade || 1;
    document.getElementById("builderAvatarImg").src = draft.avatar;
    this.renderStep1Ekskul();
    this.renderStep2Social();
    this.renderStep3Archetype();
    this.renderStep4Abilities();
    this.renderStep5Packs();
    this.renderStep6Identity();
    this.goToBuilderStep(this.builderStep);
  }

  goToBuilderStep(step) {
    this.builderStep = step;
    for (let i = 1; i <= 6; i++) {
      const content = document.getElementById(`stepContent${i}`);
      if (content) content.style.display = (i === step) ? "block" : "none";
    }
    document.querySelectorAll(".wizard-step-btn").forEach(btn => {
      btn.classList.toggle("active", parseInt(btn.dataset.step) === step);
    });
    const prevBtn = document.getElementById("btnWizardPrev");
    const nextBtn = document.getElementById("btnWizardNext");
    const finishBtn = document.getElementById("btnWizardFinish");
    prevBtn.style.display = step > 1 ? "inline-flex" : "none";
    nextBtn.style.display = step < 6 ? "inline-flex" : "none";
    finishBtn.style.display = step === 6 ? "inline-flex" : "none";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  nextBuilderStep() {
    if (this.builderStep < 6) { this.syncBuilderInputs(); this.goToBuilderStep(this.builderStep + 1); }
    if (this.builderStep === 5) this.renderStep5Packs();
  }

  prevBuilderStep() {
    if (this.builderStep > 1) { this.syncBuilderInputs(); this.goToBuilderStep(this.builderStep - 1); }
  }

  syncBuilderInputs() {
    this.builderDraft.name = document.getElementById("builderNameInput").value.trim();
    this.builderDraft.grade = parseInt(document.getElementById("builderGradeSelect").value) || 1;
  }

  updateBuilderPreview() { this.syncBuilderInputs(); }

  // STEP 1: EKSKUL
  renderStep1Ekskul() {
    const grid = document.getElementById("ekskulSelectionGrid");
    grid.innerHTML = "";
    DD_DATA.ekskul.forEach(item => {
      const isSelected = this.builderDraft.ekskulId === item.id;
      const card = document.createElement("div");
      card.className = `select-card ${isSelected ? 'selected' : ''}`;
      card.onclick = () => {
        this.builderDraft.ekskulId = item.id;
        this.builderDraft.proficientSaves = [...item.savingThrows];
        this.renderStep1Ekskul();
        this.renderStep4Abilities();
        this.renderStep5Packs();
      };
      const subclassStr = item.subclasses ? item.subclasses.map(s => s.name).join(", ") : "";
      card.innerHTML = `
        <div class="select-card-head">
          <span class="select-card-title">${item.name}</span>
          <span class="select-card-badge">HD: ${item.hitDie}</span>
        </div>
        <div class="select-card-tagline">"${item.tagline}"</div>
        <p class="select-card-desc">${item.perkDesc}</p>
        <div class="select-card-perks">
          <strong>3 Club Moves:</strong> ${item.clubMoves.map(m => m.name.split('(')[0].trim()).join(", ")}
        </div>
        ${subclassStr ? `<div class="select-card-perks" style="color:#fde68a"><strong>Fokus Ekskul:</strong> ${subclassStr}</div>` : ''}
      `;
      grid.appendChild(card);
    });
  }

  // STEP 2: SOCIAL CLASS
  renderStep2Social() {
    const grid = document.getElementById("socialClassSelectionGrid");
    grid.innerHTML = "";
    DD_DATA.socialClasses.forEach(item => {
      const isSelected = this.builderDraft.socialClassId === item.id;
      const card = document.createElement("div");
      card.className = `select-card ${isSelected ? 'selected' : ''}`;
      card.onclick = () => {
        this.builderDraft.socialClassId = item.id;
        this.builderDraft.dailyMoney = item.allowance;
        this.builderDraft.dailyMoneyAmount = item.allowanceAmount;
        this.builderDraft.savings = item.savings;
        this.builderDraft.savingsAmount = item.savingsAmount;
        this.builderDraft.job = item.job;
        this.builderDraft.jobWageAmount = item.jobWage;
        document.getElementById("builderMoneyDaily").value = item.allowance;
        document.getElementById("builderMoneySavings").value = item.savings;
        document.getElementById("builderMoneyJob").value = item.job;
        this.renderStep2Social();
      };
      card.innerHTML = `
        <div class="select-card-head">
          <span class="select-card-title">${item.name}</span>
          <span class="select-card-badge">${item.allowance.split('/')[0]}</span>
        </div>
        <div class="select-card-tagline">"${item.tagline}"</div>
        <p class="select-card-desc">${item.perkDesc}</p>
        <div class="select-card-perks">
          <strong>Uang Saku:</strong> ${item.allowance} | <strong>Baito:</strong> ${item.job}
        </div>
      `;
      grid.appendChild(card);
    });
  }

  // STEP 3: ARCHETYPE
  renderStep3Archetype() {
    const grid = document.getElementById("archetypeSelectionGrid");
    grid.innerHTML = "";
    DD_DATA.archetypes.forEach(item => {
      const isSelected = this.builderDraft.archetypeId === item.id;
      const card = document.createElement("div");
      card.className = `select-card ${isSelected ? 'selected' : ''}`;
      card.onclick = () => {
        this.builderDraft.archetypeId = item.id;
        this.renderStep3Archetype();
        this.renderStep4Abilities();
        this.renderStep5Packs();
      };
      const bonusStr = Object.entries(item.statBonus).map(([k, v]) => `+${v} ${k.substring(0, 3).toUpperCase()}`).join(", ");
      const movesStr = item.archetypeMoves ? item.archetypeMoves.map(m => m.name.split('(')[0].trim()).join(", ") : "";
      card.innerHTML = `
        <div class="select-card-head">
          <span class="select-card-title">${item.name}</span>
          <span class="select-card-badge" style="color:#60a5fa">${bonusStr}</span>
        </div>
        <div class="select-card-tagline">"${item.tagline}"</div>
        <p class="select-card-desc">${item.perks.map(p => `• <strong>${p.name}:</strong> ${p.desc}`).join("<br>")}</p>
        ${movesStr ? `<div class="select-card-perks" style="color:#fda4af"><strong>3 Archetype Moves:</strong> ${movesStr}</div>` : ''}
      `;
      grid.appendChild(card);
    });
  }

  // STEP 4: ABILITIES & SKILLS
  setAbilityMethod(method) {
    this.abilityMethod = method;
    // Reset stats to defaults when switching methods to prevent carryover bug
    if (method === "standard") {
      this.builderDraft.baseAbilities = { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 };
      this.builderDraft.standardArrayAssigned = { physique: 15, intelligent: 14, looks: 13, mind: 12, talent: 10, luck: 8 };
    } else if (method === "pointbuy") {
      this.builderDraft.baseAbilities = { physique: 8, intelligent: 8, looks: 8, mind: 8, talent: 8, luck: 8 };
    }
    document.querySelectorAll(".btn-toggle").forEach(btn => btn.classList.remove("active"));
    if (method === "standard") document.getElementById("btnMethodStandard").classList.add("active");
    if (method === "pointbuy") document.getElementById("btnMethodPointBuy").classList.add("active");
    const wrap = document.getElementById("pointBuyRemainingWrap");
    wrap.style.display = method === "pointbuy" ? "block" : "none";
    this.renderStep4Abilities();
  }

  getPointBuyCost(score) {
    // Standard D&D 5e point buy cost table for scores 8-15
    const costs = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
    return costs[score] ?? 0;
  }

  getTotalPointsSpent() {
    return Object.values(this.builderDraft.baseAbilities)
      .reduce((sum, v) => sum + this.getPointBuyCost(Math.max(8, Math.min(15, v))), 0);
  }

  renderStep4Abilities() {
    const grid = document.getElementById("statCalcGrid");
    const arc = DD_DATA.archetypes.find(a => a.id === this.builderDraft.archetypeId);
    grid.innerHTML = "";

    const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
    const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
    const POINT_BUY_BUDGET = 27;

    const pointsSpent = this.getTotalPointsSpent();
    const pointsLeft = POINT_BUY_BUDGET - pointsSpent;

    if (this.abilityMethod === "pointbuy") {
      const el = document.getElementById("pointBuyRemaining");
      if (el) {
        el.textContent = pointsLeft;
        el.style.color = pointsLeft <= 0 ? "#ef4444" : (pointsLeft <= 5 ? "#f59e0b" : "#10b981");
      }
    }

    statKeys.forEach(statKey => {
      const baseVal = this.builderDraft.baseAbilities[statKey] || 8;
      const bonus = (arc && arc.statBonus[statKey]) ? arc.statBonus[statKey] : 0;
      const totalVal = baseVal + bonus;
      const mod = Math.floor((totalVal - 10) / 2);
      const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
      const statDef = DD_DATA.abilities[statKey];

      const card = document.createElement("div");
      card.className = "stat-calc-card";

      let inputHtml = "";
      if (this.abilityMethod === "standard") {
        // Standard Array — each value can only be used once
        const usedValues = Object.entries(this.builderDraft.baseAbilities)
          .filter(([k]) => k !== statKey)
          .map(([, v]) => v);

        inputHtml = `<select class="stat-calc-input" onchange="app.updateStandardStat('${statKey}', this.value)">`;
        STANDARD_ARRAY.forEach(val => {
          const isUsedElsewhere = usedValues.includes(val);
          const isCurrentValue = val === baseVal;
          // Allow selection of current value; disable values already used by other stats
          inputHtml += `<option value="${val}" ${isCurrentValue ? 'selected' : ''} ${(isUsedElsewhere && !isCurrentValue) ? 'disabled style="color:#888"' : ''}>${val}${isUsedElsewhere && !isCurrentValue ? ' ✗' : ''}</option>`;
        });
        inputHtml += `</select>`;
      } else {
        // Point Buy — clamped 8-15, disable + if can't afford or at max
        const cost = this.getPointBuyCost(baseVal);
        const nextCost = this.getPointBuyCost(Math.min(15, baseVal + 1));
        const canUp = baseVal < 15 && (pointsLeft >= (nextCost - cost));
        const canDown = baseVal > 8;
        inputHtml = `
          <div class="pointbuy-control">
            <button class="btn-stepper ${!canDown ? 'disabled' : ''}" onclick="app.adjustPointBuyStat('${statKey}', -1)" ${!canDown ? 'disabled' : ''}>−</button>
            <span class="pointbuy-val">${baseVal}</span>
            <button class="btn-stepper ${!canUp ? 'disabled' : ''}" onclick="app.adjustPointBuyStat('${statKey}', +1)" ${!canUp ? 'disabled' : ''}>+</button>
          </div>
          <div style="font-size:0.7rem;color:var(--text-muted);text-align:center;margin-top:0.2rem;">Biaya: ${cost} poin</div>
        `;
      }

      card.innerHTML = `
        <div class="stat-calc-title">${statDef.name}</div>
        <div class="stat-calc-dnd">${statDef.dndEquiv}</div>
        <div class="stat-calc-input-wrap">${inputHtml}</div>
        <div class="stat-calc-summary">
          <span>Bonus: <strong>+${bonus}</strong></span>
          <span>Total: <strong>${totalVal}</strong></span>
          <span class="stat-calc-mod">${modStr}</span>
        </div>
      `;
      grid.appendChild(card);
    });

    this.renderSubskillsPicker();
  }

  updateStandardStat(statKey, val) {
    const intVal = parseInt(val) || 8;
    const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];
    // Swap: find which stat currently has this value and swap it with current stat's value
    const oldVal = this.builderDraft.baseAbilities[statKey];
    if (intVal === oldVal) return;
    const swapKey = Object.keys(this.builderDraft.baseAbilities).find(k => k !== statKey && this.builderDraft.baseAbilities[k] === intVal);
    if (swapKey) {
      this.builderDraft.baseAbilities[swapKey] = oldVal;
    }
    this.builderDraft.baseAbilities[statKey] = intVal;
    this.renderStep4Abilities();
  }

  adjustPointBuyStat(statKey, delta) {
    const POINT_BUY_BUDGET = 27;
    const cur = this.builderDraft.baseAbilities[statKey];
    const next = cur + delta;
    if (next < 8 || next > 15) return;
    const curCost = this.getPointBuyCost(cur);
    const nextCost = this.getPointBuyCost(next);
    const pointsLeft = POINT_BUY_BUDGET - this.getTotalPointsSpent();
    if (delta > 0 && pointsLeft < (nextCost - curCost)) return; // Not enough points
    this.builderDraft.baseAbilities[statKey] = next;
    this.renderStep4Abilities();
  }

  renderSubskillsPicker() {
    const grid = document.getElementById("subskillsPickerGrid");
    grid.innerHTML = "";
    const SKILL_LIMIT = 4;
    const selectedCount = this.builderDraft.proficientSkills.length;

    // Update badge
    const badge = document.getElementById("skillLimitBadge");
    if (badge) {
      badge.textContent = `${selectedCount} / ${SKILL_LIMIT} dipilih`;
      badge.style.background = selectedCount >= SKILL_LIMIT ? "var(--rose-dark)" : "var(--navy-accent)";
    }

    const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
    statKeys.forEach(statKey => {
      const statDef = DD_DATA.abilities[statKey];
      statDef.skills.forEach(sk => {
        const isProf = this.builderDraft.proficientSkills.includes(sk.id);
        const isDisabled = !isProf && selectedCount >= SKILL_LIMIT;
        const item = document.createElement("div");
        item.className = `subskill-pick-item ${isProf ? 'proficient' : ''} ${isDisabled ? 'skill-disabled' : ''}`;
        if (!isDisabled) {
          item.onclick = () => {
            if (this.builderDraft.proficientSkills.includes(sk.id)) {
              this.builderDraft.proficientSkills = this.builderDraft.proficientSkills.filter(id => id !== sk.id);
            } else if (this.builderDraft.proficientSkills.length < SKILL_LIMIT) {
              this.builderDraft.proficientSkills.push(sk.id);
            }
            this.renderSubskillsPicker();
          };
        }
        item.innerHTML = `
          <input type="checkbox" ${isProf ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} style="pointer-events:none">
          <div class="subskill-info">
            <span class="subskill-name">${sk.name}</span>
            <span class="subskill-stat-label">${statDef.name} — ${sk.desc}</span>
          </div>
        `;
        grid.appendChild(item);
      });
    });
  }

  // STEP 5: EQUIPMENT PACKS (auto 3-layer)
  renderStep5Packs() {
    const preview = document.getElementById("step5PacksPreview");
    if (!preview) return;
    const eksId = this.builderDraft.ekskulId || "kendo";
    const arcId = this.builderDraft.archetypeId || "delinquent";
    const packs = DD_DATA.equipmentPacks;
    const studentPack = packs.student || [];
    const clubPack = packs.clubs[eksId] || [];
    const arcPack = packs.archetypes[arcId] || [];

    const eksName = DD_DATA.ekskul.find(e => e.id === eksId)?.name || eksId;
    const arcName = DD_DATA.archetypes.find(a => a.id === arcId)?.name || arcId;

    preview.innerHTML = `
      <div class="card p-4" style="border-left: 3px solid var(--teal-accent);">
        <h3 class="card-title" style="color:var(--teal-accent);">📚 Paket Murid Biasa</h3>
        <ul style="list-style:none;margin:0;padding:0;">
          ${studentPack.map(i => `<li style="padding:0.2rem 0;font-size:0.88rem;">• ${this.escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>
      <div class="card p-4" style="border-left: 3px solid var(--amber-gold);">
        <h3 class="card-title" style="color:var(--amber-gold);">⚔️ Paket Ekskul: ${this.escapeHtml(eksName.split('(')[0].trim())}</h3>
        <ul style="list-style:none;margin:0;padding:0;">
          ${clubPack.map(i => `<li style="padding:0.2rem 0;font-size:0.88rem;">• ${this.escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>
      <div class="card p-4" style="border-left: 3px solid var(--rose-primary);">
        <h3 class="card-title" style="color:var(--rose-primary);">🌸 Paket Archetype: ${this.escapeHtml(arcName.split('(')[0].trim())}</h3>
        <ul style="list-style:none;margin:0;padding:0;">
          ${arcPack.map(i => `<li style="padding:0.2rem 0;font-size:0.88rem;">• ${this.escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>
    `;

    // Populate financial from social class
    const soc = DD_DATA.socialClasses.find(s => s.id === this.builderDraft.socialClassId);
    if (soc) {
      document.getElementById("builderMoneyDaily").value = soc.allowance;
      document.getElementById("builderMoneySavings").value = soc.savings;
      document.getElementById("builderMoneyJob").value = soc.job;
    }
  }

  // STEP 6: IDENTITY
  renderStep6Identity() {
    document.getElementById("builderPersonality").value = this.builderDraft.personality || "";
    document.getElementById("builderIdeals").value = this.builderDraft.ideals || "";
    document.getElementById("builderBonds").value = this.builderDraft.bonds || "";
    document.getElementById("builderFlaws").value = this.builderDraft.flaws || "";
    const elBackstory = document.getElementById("builderBackstory");
    if (elBackstory) elBackstory.value = this.builderDraft.backstory || "";
  }

  finishBuilder() {
    this.syncBuilderInputs();

    // Financial
    this.builderDraft.dailyMoney = document.getElementById("builderMoneyDaily").value;
    this.builderDraft.savings = document.getElementById("builderMoneySavings").value;
    this.builderDraft.job = document.getElementById("builderMoneyJob").value;

    // Parse savings amount for Long Rest calculation
    const soc = DD_DATA.socialClasses.find(s => s.id === this.builderDraft.socialClassId);
    if (soc) {
      this.builderDraft.dailyMoneyAmount = soc.allowanceAmount;
      this.builderDraft.savingsAmount = soc.savingsAmount;
      this.builderDraft.jobWageAmount = soc.jobWage;
    }

    // Equipment from 3 packs + chosen keepsake
    const eksId = this.builderDraft.ekskulId;
    const arcId = this.builderDraft.archetypeId;
    const packs = DD_DATA.equipmentPacks;
    this.builderDraft.bagItems = [
      ...(packs.student || []),
      ...(packs.clubs[eksId] || []),
      ...(packs.archetypes[arcId] || [])
    ];
    const chosenKeepsake = document.querySelector("#keepsakeDefaultsList input[name='keepsake']:checked");
    this.builderDraft.keepsakes = chosenKeepsake ? [chosenKeepsake.value] : ["Jimat Omamori Cinta (Kuil)"];

    // Identity
    this.builderDraft.personality = document.getElementById("builderPersonality").value;
    this.builderDraft.ideals = document.getElementById("builderIdeals").value;
    this.builderDraft.bonds = document.getElementById("builderBonds").value;
    this.builderDraft.flaws = document.getElementById("builderFlaws").value;
    const elBackstory = document.getElementById("builderBackstory");
    this.builderDraft.backstory = elBackstory ? elBackstory.value.trim() : (this.builderDraft.backstory || "");

    if (!this.builderDraft.name) this.builderDraft.name = "Murid Baru (Tanpa Nama)";

    // Calculate HP & Composure
    const arc = DD_DATA.archetypes.find(a => a.id === this.builderDraft.archetypeId);
    const eks = DD_DATA.ekskul.find(e => e.id === this.builderDraft.ekskulId);
    const phyBonus = (arc && arc.statBonus.physique) || 0;
    const mndBonus = (arc && arc.statBonus.mind) || 0;
    const lokBonus = (arc && arc.statBonus.looks) || 0;
    const totalPhy = this.builderDraft.baseAbilities.physique + phyBonus;
    const totalMnd = this.builderDraft.baseAbilities.mind + mndBonus;
    const totalLok = this.builderDraft.baseAbilities.looks + lokBonus;
    const modPhy = Math.floor((totalPhy - 10) / 2);
    const modMnd = Math.floor((totalMnd - 10) / 2);
    const modLok = Math.floor((totalLok - 10) / 2);
    const hitDieBase = eks ? (eks.hitDie === "d10" ? 10 : eks.hitDie === "d8" ? 8 : 6) : 8;
    this.builderDraft.physicalHpMax = Math.max(6, hitDieBase + modPhy);
    this.builderDraft.physicalHpCurrent = this.builderDraft.physicalHpMax;
    this.builderDraft.physicalHpTemp = 0;
    this.builderDraft.composureMax = Math.max(6, 10 + modMnd + Math.max(0, modLok));
    this.builderDraft.composureCurrent = this.builderDraft.composureMax;
    this.builderDraft.composureTemp = 0;
    this.builderDraft.restDiceTotal = this.builderDraft.grade || 1;
    this.builderDraft.restDiceSpent = 0;
    this.builderDraft.heartInspiration = true;
    if (!this.builderDraft.calendarChecked) this.builderDraft.calendarChecked = [];
    if (!this.builderDraft.targets) this.builderDraft.targets = [];

    const existingIndex = this.roster.findIndex(c => c.id === this.builderDraft.id);
    if (existingIndex >= 0) this.roster[existingIndex] = this.builderDraft;
    else this.roster.unshift(this.builderDraft);
    this.saveRoster();

    if (this.supabase) {
      this.saveCharacterToCloud(this.builderDraft);
    }

    this.showToast(`Karakter ${this.builderDraft.name} berhasil disimpan!`);
    this.openCharacterSheet(this.builderDraft.id);
  }

  // =========================================================================
  // VIEW 3: INTERACTIVE CHARACTER SHEET
  // =========================================================================
  openCharacterSheet(charId) {
    const char = this.roster.find(c => c.id === charId);
    if (!char) return;
    this.currentCharacter = char;
    this.dmModeUnlocked = false; // Always reset DM lock when opening a sheet
    this.renderCharacterSheet();
    this.showView("sheet");
  }

  renderCharacterSheet() {
    const char = this.currentCharacter;
    const arc = DD_DATA.archetypes.find(a => a.id === char.archetypeId);
    const eks = DD_DATA.ekskul.find(e => e.id === char.ekskulId);
    const soc = DD_DATA.socialClasses.find(s => s.id === char.socialClassId);

    // Identity Bar
    document.getElementById("sheetCharName").textContent = char.name;
    document.getElementById("sheetAvatarImg").src = char.avatar || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + char.id;
    document.getElementById("sheetArchetypeBadge").textContent = arc ? arc.name : "Archetype";
    document.getElementById("sheetEkskulBadge").textContent = eks ? eks.name : "Ekskul";
    document.getElementById("sheetSocialBadge").textContent = soc ? soc.name : "Social Class";
    document.getElementById("sheetGradeBadge").textContent = `Kelas ${char.grade === 1 ? '10 (Lvl 1)' : char.grade === 2 ? '10 (Lvl 2)' : char.grade === 3 ? '11 (Lvl 3)' : char.grade === 4 ? '11 (Lvl 4)' : '12 (Lvl 5)'}`;

    const profBonus = char.grade >= 5 ? 3 : 2;
    document.getElementById("sheetProfBonus").textContent = `+${profBonus}`;

    const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
    const mods = {}, totals = {};

    statKeys.forEach(statKey => {
      const base = char.baseAbilities[statKey] || 10;
      const bonus = (arc && arc.statBonus[statKey]) || 0;
      const total = base + bonus;
      const mod = Math.floor((total - 10) / 2);
      totals[statKey] = total;
      mods[statKey] = mod;
      const cap = statKey.charAt(0).toUpperCase() + statKey.slice(1);
      const elMod = document.getElementById(`sheetMod${cap}`);
      const elScore = document.getElementById(`sheetScore${cap}`);
      if (elMod) elMod.textContent = mod >= 0 ? `+${mod}` : `${mod}`;
      if (elScore) elScore.textContent = total;
    });

    // Physical Vitals
    const physAC = 10 + mods.agility !== undefined ? 10 + (Math.floor(((char.baseAbilities.physique + ((arc && arc.statBonus.physique) || 0)) - 10) / 2)) : 10;
    // Note: D&D Beyond style uses full stat card mods, physique mod doubles for initiative
    document.getElementById("sheetPhysAC").textContent = 10 + mods.physique;
    document.getElementById("sheetInitiative").textContent = mods.physique >= 0 ? `+${mods.physique}` : `${mods.physique}`;
    document.getElementById("sheetSpeed").textContent = (arc && arc.id === "jock") ? "35 ft" : "30 ft";
    document.getElementById("sheetPhysHpCurrent").textContent = char.physicalHpCurrent;
    document.getElementById("sheetPhysHpMax").textContent = char.physicalHpMax;
    const physPercent = Math.max(0, Math.min(100, Math.round((char.physicalHpCurrent / char.physicalHpMax) * 100)));
    document.getElementById("sheetPhysHpBar").style.width = `${physPercent}%`;

    // Mental Vitals
    const socialAC = 10 + mods.mind + Math.max(0, mods.looks);
    document.getElementById("sheetSocialAC").textContent = socialAC;
    document.getElementById("sheetRestDice").textContent = eks ? `1${eks.hitDie}` : "1d8";
    document.getElementById("sheetRestDiceUsed").textContent = `${char.restDiceTotal - char.restDiceSpent}/${char.restDiceTotal}`;
    document.getElementById("sheetComposureCurrent").textContent = char.composureCurrent;
    document.getElementById("sheetComposureMax").textContent = char.composureMax;
    const compPercent = Math.max(0, Math.min(100, Math.round((char.composureCurrent / char.composureMax) * 100)));
    document.getElementById("sheetComposureBar").style.width = `${compPercent}%`;

    // Heart Inspiration
    document.getElementById("sheetHeartToken").parentElement.classList.toggle("active", !!char.heartInspiration);

    // Saving Throws
    const savesList = document.getElementById("sheetSavesList");
    savesList.innerHTML = "";
    statKeys.forEach(statKey => {
      const isProf = (char.proficientSaves || []).includes(statKey);
      const totalSave = mods[statKey] + (isProf ? profBonus : 0);
      const saveSign = totalSave >= 0 ? `+${totalSave}` : `${totalSave}`;
      const statDef = DD_DATA.abilities[statKey];
      const row = document.createElement("div");
      row.className = "save-item";
      row.onclick = () => this.rollDice(20, totalSave, `${statDef.name} Saving Throw`);
      row.innerHTML = `
        <div class="save-left">
          <span class="prof-dot ${isProf ? 'filled' : ''}"></span>
          <span class="save-name">${statDef.name} Save</span>
        </div>
        <span class="save-bonus">${saveSign}</span>
      `;
      savesList.appendChild(row);
    });

    // Passive Senses (from stat modifiers)
    document.getElementById("sheetPassivePerception").textContent = 10 + mods.mind + ((char.proficientSkills || []).includes("awareness") ? profBonus : 0);
    document.getElementById("sheetPassiveInsight").textContent = 10 + mods.intelligent + ((char.proficientSkills || []).includes("people") ? profBonus : 0);
    document.getElementById("sheetPassiveInvestigation").textContent = 10 + mods.intelligent + ((char.proficientSkills || []).includes("academic") ? profBonus : 0);

    // Proficiency & Languages (display uniform + club tools)
    document.getElementById("sheetProfUniform").textContent = char.profUniform || ("Seragam Sekolah Standar" + (arc ? ` (${arc.name.split(' ')[0]} Style)` : ""));
    document.getElementById("sheetProfClubTools").textContent = char.profClubTools || (eks ? eks.name : "Sesuai ekskul terdaftar");
    const elLang = document.getElementById("sheetProfLanguages");
    if (elLang) elLang.textContent = char.profLanguages || "Bahasa Jepang Standar, Slang Remaja Tokyo, Bahasa Inggris Pelajaran";

    // 18 Sub-Skills Table
    const skillsTable = document.getElementById("sheetSkillsTable");
    skillsTable.innerHTML = "";
    statKeys.forEach(statKey => {
      const statDef = DD_DATA.abilities[statKey];
      statDef.skills.forEach(sk => {
        const isProf = (char.proficientSkills || []).includes(sk.id);
        const skillTotal = mods[statKey] + (isProf ? profBonus : 0);
        const skillSign = skillTotal >= 0 ? `+${skillTotal}` : `${skillTotal}`;
        const row = document.createElement("div");
        row.className = "skill-row";
        row.onclick = () => this.rollDice(20, skillTotal, `Check ${sk.name} (${statDef.name})`);
        row.innerHTML = `
          <div class="skill-row-left">
            <span class="prof-dot ${isProf ? 'filled' : ''}"></span>
            <span class="skill-stat-tag">${statDef.short}</span>
            <span class="skill-name-txt">${sk.name}</span>
          </div>
          <span class="skill-bonus-num">${skillSign}</span>
        `;
        skillsTable.appendChild(row);
      });
    });

    // Tab 1: Actions & Moves
    this.renderSheetMoves("all");

    // Tab 2: Inventory
    document.getElementById("sheetDisplayMoneyDaily").textContent = char.dailyMoney || "-";
    document.getElementById("sheetDisplayMoneySavings").textContent = char.savings || "-";
    document.getElementById("sheetDisplayMoneyJob").textContent = char.job || "-";

    const bagList = document.getElementById("sheetBagList");
    bagList.innerHTML = (char.bagItems || []).map((item, idx) => `
      <li>
        <span>• ${this.escapeHtml(item)}</span>
        <button class="btn btn-xs btn-secondary" onclick="app.removeInventoryItem('bag', ${idx})">&times;</button>
      </li>
    `).join("");

    const keepList = document.getElementById("sheetKeepsakeList");
    keepList.innerHTML = (char.keepsakes || []).map((item, idx) => `
      <li>
        <span style="color:#fbcfe8">♥ ${this.escapeHtml(item)}</span>
        <button class="btn btn-xs btn-secondary" onclick="app.removeInventoryItem('keepsake', ${idx})">&times;</button>
      </li>
    `).join("");

    // Tab 3: Features & Traits
    const featList = document.getElementById("sheetFeaturesList");
    let featHtml = "";
    if (arc) {
      featHtml += `<div class="card p-3 mb-3"><h4 style="color:#60a5fa;margin-bottom:0.4rem;">Fitur Archetype: ${arc.name}</h4>${arc.perks.map(p => `<p class="text-sm mb-1">• <strong>${p.name}:</strong> ${p.desc}</p>`).join("")}</div>`;
    }
    if (eks) {
      featHtml += `<div class="card p-3 mb-3"><h4 style="color:#fda4af;margin-bottom:0.4rem;">Fasilitas & Hak Ekskul: ${eks.name}</h4><p class="text-sm">${eks.perkDesc}</p>`;
      if (eks.subclasses && eks.subclasses.length) {
        featHtml += `<div style="margin-top:0.5rem;"><strong style="color:#fde68a;">Fokus Spesialisasi Tersedia:</strong> ${eks.subclasses.map(s => `<span style="font-size:0.8rem;background:var(--bg-surface);padding:0.15rem 0.4rem;border-radius:4px;margin-right:0.3rem;">${s.name}</span>`).join("")}</div>`;
      }
      featHtml += `</div>`;
    }
    if (soc) {
      featHtml += `<div class="card p-3 mb-3"><h4 style="color:#fde68a;margin-bottom:0.4rem;">Status Finansial: ${soc.name}</h4><p class="text-sm">${soc.perkDesc}</p></div>`;
    }
    featList.innerHTML = featHtml;

    // Tab 4: Roleplay & Calendar
    const elBs = document.getElementById("sheetDisplayBackstory");
    if (elBs) elBs.textContent = char.backstory || "Belum ada catatan kisah masa lalu.";
    document.getElementById("sheetDisplayPersonality").textContent = char.personality || "-";
    document.getElementById("sheetDisplayIdeals").textContent = char.ideals || "-";
    document.getElementById("sheetDisplayBonds").textContent = char.bonds || "-";
    document.getElementById("sheetDisplayFlaws").textContent = char.flaws || "-";

    const calList = document.getElementById("sheetCalendarList");
    const checkedIds = char.calendarChecked || [];
    calList.innerHTML = DD_DATA.calendarEvents.map(evt => {
      const isChecked = checkedIds.includes(evt.id);
      return `
        <div class="calendar-event-item ${isChecked ? 'calendar-done' : ''}" style="background:var(--bg-surface);padding:0.5rem 0.75rem;border-radius:var(--radius-xs);margin-bottom:0.35rem;border:1px solid ${isChecked ? 'var(--green-health)' : 'var(--border-subtle)'};cursor:pointer;" onclick="app.toggleCalendarEvent('${evt.id}')">
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <input type="checkbox" ${isChecked ? 'checked' : ''} style="pointer-events:none;accent-color:var(--green-health);">
            <span style="font-weight:700;font-size:0.85rem;color:${isChecked ? 'var(--text-muted)' : '#fff'};${isChecked ? 'text-decoration:line-through' : ''}">${evt.name} <span class="text-muted text-xs">(${evt.term})</span></span>
          </div>
          <p class="text-muted text-xs" style="margin-top:0.2rem;margin-left:1.5rem;">${evt.desc}</p>
        </div>
      `;
    }).join("");

    // Tab 5: Affection Tracker (DM lock reset on each sheet render)
    this.renderAffectionTracker();
  }

  toggleCalendarEvent(eventId) {
    if (!this.currentCharacter) return;
    if (!this.currentCharacter.calendarChecked) this.currentCharacter.calendarChecked = [];
    const idx = this.currentCharacter.calendarChecked.indexOf(eventId);
    if (idx >= 0) this.currentCharacter.calendarChecked.splice(idx, 1);
    else this.currentCharacter.calendarChecked.push(eventId);
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
  }

  renderSheetMoves(filter = "all") {
    const list = document.getElementById("sheetMovesList");
    list.innerHTML = "";
    const char = this.currentCharacter;
    const eks = DD_DATA.ekskul.find(e => e.id === char.ekskulId);
    const arc = DD_DATA.archetypes.find(a => a.id === char.archetypeId);

    let moves = [];
    DD_DATA.basicActions.forEach(m => {
      moves.push({ name: m.name, category: m.category, type: m.type, range: m.range, check: m.check, damage: m.damage || m.effect || "-", desc: m.desc });
    });

    if (eks && eks.clubMoves) {
      eks.clubMoves.forEach(m => {
        moves.push({ name: m.name, category: "club_move", type: `${m.type} [${eks.name.split('(')[0].trim()}]`, range: m.range, check: m.check, damage: m.effect, desc: m.desc });
      });
    }

    if (arc && arc.archetypeMoves) {
      arc.archetypeMoves.forEach(m => {
        moves.push({ name: m.name, category: "archetype_move", type: `${m.type} [${arc.name.split('(')[0].trim()}]`, range: m.range, check: m.check, damage: m.effect, desc: m.desc });
      });
    }

    if (filter !== "all") moves = moves.filter(m => m.category === filter);

    if (moves.length === 0) {
      list.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1rem;">Tidak ada aksi dalam filter ini.</p>`;
      return;
    }

    moves.forEach(m => {
      const card = document.createElement("div");
      card.className = "move-card";
      const categoryColor = m.category === "club_move" ? "#fda4af" : m.category === "archetype_move" ? "#c4b5fd" : m.category === "basic_combat" ? "#60a5fa" : "#86efac";
      card.innerHTML = `
        <div class="move-card-header">
          <span class="move-name">${this.escapeHtml(m.name)}</span>
          <span class="move-type-badge" style="background:${categoryColor}22;color:${categoryColor}">${this.escapeHtml(m.type)}</span>
        </div>
        <div class="move-metrics-row">
          <span><strong>Range:</strong> ${this.escapeHtml(m.range)}</span>
          <span><strong>Check:</strong> ${this.escapeHtml(m.check)}</span>
          <span><strong>Efek:</strong> ${this.escapeHtml(m.damage)}</span>
        </div>
        <p class="move-desc">${this.escapeHtml(m.desc)}</p>
      `;
      list.appendChild(card);
    });
  }

  filterMoves(category) {
    document.querySelectorAll(".moves-filter-bar .filter-pill").forEach(pill => pill.classList.remove("active"));
    event.target.classList.add("active");
    this.renderSheetMoves(category);
  }

  switchSheetTab(tabName) {
    document.querySelectorAll(".sheet-tabs-nav .tab-btn").forEach(btn => btn.classList.remove("active"));
    document.querySelectorAll(".tab-pane").forEach(pane => pane.style.display = "none");
    const activeBtn = document.querySelector(`.sheet-tabs-nav .tab-btn[data-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add("active");
    const pane = document.getElementById(`tabPane${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
    if (pane) pane.style.display = "block";
    // Reset DM pin error on tab switch
    const errEl = document.getElementById("dmPinError");
    if (errEl) errEl.style.display = "none";
    const pinInput = document.getElementById("dmPinInput");
    if (pinInput && tabName !== "affection") pinInput.value = "";
  }

  // =========================================================================
  // BACKSTORY MODAL
  // =========================================================================
  openBackstoryModal() {
    if (!this.currentCharacter) return;
    const input = document.getElementById("modalBackstoryInput");
    if (input) input.value = this.currentCharacter.backstory || "";
    const modal = document.getElementById("backstoryModal");
    if (modal) modal.style.display = "flex";
  }

  closeBackstoryModal() {
    const modal = document.getElementById("backstoryModal");
    if (modal) modal.style.display = "none";
  }

  saveBackstoryFromModal() {
    if (!this.currentCharacter) return;
    const input = document.getElementById("modalBackstoryInput");
    this.currentCharacter.backstory = input ? input.value.trim() : "";
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.closeBackstoryModal();
    this.showToast("Kisah masa lalu (Backstory) berhasil diperbarui!");
  }

  // =========================================================================
  // SAVINGS MODAL (+ / - RUPIAH DENGAN LIVE KONVERSI YEN)
  // =========================================================================
  openSavingsModal() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;
    this.savingsTxType = "add";
    const curYen = char.savingsAmount || 0;
    const curRp = curYen * 100;

    const disp = document.getElementById("modalSavingsCurrentDisplay");
    if (disp) disp.textContent = `¥${curYen.toLocaleString()} / Rp ${curRp.toLocaleString()}`;

    const inputRp = document.getElementById("inputSavingsRp");
    if (inputRp) inputRp.value = "";

    const inputNote = document.getElementById("inputSavingsNote");
    if (inputNote) inputNote.value = "";

    this.setSavingsTxType("add");
    this.updateSavingsPreview();

    const modal = document.getElementById("savingsModal");
    if (modal) modal.style.display = "flex";
  }

  closeSavingsModal() {
    const modal = document.getElementById("savingsModal");
    if (modal) modal.style.display = "none";
  }

  setSavingsTxType(type) {
    this.savingsTxType = type; // 'add' | 'sub'
    const btnAdd = document.getElementById("txBtnAdd");
    const btnSub = document.getElementById("txBtnSub");
    if (btnAdd && btnSub) {
      if (type === "add") {
        btnAdd.className = "tx-type-btn active type-add";
        btnSub.className = "tx-type-btn";
      } else {
        btnAdd.className = "tx-type-btn";
        btnSub.className = "tx-type-btn active type-sub";
      }
    }
    this.updateSavingsPreview();
  }

  updateSavingsPreview() {
    const input = document.getElementById("inputSavingsRp");
    const prev = document.getElementById("savingsConversionPreview");
    if (!input || !prev) return;
    const rp = parseInt(input.value) || 0;
    const yen = Math.round(rp / 100);
    const sign = this.savingsTxType === "add" ? "+" : "−";
    prev.textContent = `≈ ${sign}¥${yen.toLocaleString()} (Rp ${rp.toLocaleString()})`;
    prev.style.color = this.savingsTxType === "add" ? "var(--green-health)" : "var(--rose-primary)";
  }

  applySavingsTransaction() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;
    const input = document.getElementById("inputSavingsRp");
    const rp = parseInt(input ? input.value : 0) || 0;
    if (rp <= 0) {
      alert("Masukkan nominal transaksi Rupiah yang valid (lebih dari 0).");
      return;
    }

    const deltaYen = Math.round(rp / 100);
    const note = document.getElementById("inputSavingsNote")?.value.trim() || "";
    let currentYen = char.savingsAmount || 0;

    if (this.savingsTxType === "add") {
      currentYen += deltaYen;
    } else {
      if (currentYen < deltaYen) {
        if (!confirm(`Tabungan hanya memiliki ¥${currentYen.toLocaleString()} (Rp ${(currentYen*100).toLocaleString()}). Pengurangan ini akan membuat tabungan menjadi 0. Lanjutkan?`)) {
          return;
        }
        currentYen = 0;
      } else {
        currentYen -= deltaYen;
      }
    }

    char.savingsAmount = currentYen;
    char.savings = `¥${currentYen.toLocaleString()} / Rp ${(currentYen * 100).toLocaleString()}`;
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.closeSavingsModal();

    const actionText = this.savingsTxType === "add" ? `+Rp ${rp.toLocaleString()} (+¥${deltaYen}) dimasukkan ke tabungan.` : `−Rp ${rp.toLocaleString()} (−¥${deltaYen}) dikurangkan dari tabungan.`;
    this.showToast(`${actionText}${note ? ' (' + note + ')' : ''}`);
  }

  // =========================================================================
  // BAITO MODAL (KERJA PARUH WAKTU: MULAI / BERHENTI / UBAH GAJI)
  // =========================================================================
  openBaitoModal() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;

    const jobInput = document.getElementById("inputBaitoJob");
    const wageInput = document.getElementById("inputBaitoWageRp");
    const alertBox = document.getElementById("baitoActiveAlert");

    const hasActiveJob = char.jobWageAmount > 0 && char.job && char.job !== "-";

    if (jobInput) jobInput.value = hasActiveJob ? char.job : "";
    if (wageInput) wageInput.value = hasActiveJob ? (char.jobWageAmount * 100) : "";
    if (alertBox) alertBox.style.display = hasActiveJob ? "block" : "none";

    this.updateBaitoPreview();

    const modal = document.getElementById("baitoModal");
    if (modal) modal.style.display = "flex";
  }

  closeBaitoModal() {
    const modal = document.getElementById("baitoModal");
    if (modal) modal.style.display = "none";
  }

  updateBaitoPreview() {
    const wageInput = document.getElementById("inputBaitoWageRp");
    const preview = document.getElementById("baitoWagePreview");
    if (!wageInput || !preview) return;
    const rp = parseInt(wageInput.value) || 0;
    const yen = Math.round(rp / 100);
    preview.textContent = `¥${yen.toLocaleString()} / Rp ${rp.toLocaleString()} per hari`;
  }

  saveBaitoFromModal() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;
    const jobInput = document.getElementById("inputBaitoJob");
    const wageInput = document.getElementById("inputBaitoWageRp");

    const jobTitle = jobInput ? jobInput.value.trim() : "";
    const wageRp = parseInt(wageInput ? wageInput.value : 0) || 0;

    if (!jobTitle) {
      alert("Masukkan nama pekerjaan paruh waktu (misal: Kasir Minimarket, Barista).");
      return;
    }

    const wageYen = Math.round(wageRp / 100);
    char.job = jobTitle;
    char.jobWageAmount = wageYen;

    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.closeBaitoModal();
    this.showToast(`Pekerjaan paruh waktu diatur: ${jobTitle} (Gaji: ¥${wageYen.toLocaleString()} / Rp ${wageRp.toLocaleString()} per hari).`);
  }

  stopBaito() {
    if (!this.currentCharacter) return;
    if (confirm("Yakin ingin berhenti bekerja paruh waktu (resign)? Karakter tidak akan lagi menerima upah saat Long Rest.")) {
      const char = this.currentCharacter;
      char.job = "-";
      char.jobWageAmount = 0;
      this.saveCurrentCharacter();
      this.renderCharacterSheet();
      this.closeBaitoModal();
      this.showToast("Karakter berhenti bekerja (status menganggur).");
    }
  }

  editProficiencies() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;
    const uniform = prompt("Gaya Seragam & Pakaian:", char.profUniform || document.getElementById("sheetProfUniform").textContent);
    if (uniform === null) return;
    const tools = prompt("Alat & Perlengkapan Ekskul Khusus:", char.profClubTools || document.getElementById("sheetProfClubTools").textContent);
    if (tools === null) return;
    const langs = prompt("Bahasa & Dialek yang Dikuasai:", char.profLanguages || document.getElementById("sheetProfLanguages").textContent);
    if (langs === null) return;

    char.profUniform = uniform.trim();
    char.profClubTools = tools.trim();
    char.profLanguages = langs.trim();
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.showToast("Profisiensi & Bahasa diperbarui!");
  }

  // =========================================================================
  // DM ONLY AFFECTION TRACKER — PIN AUTH
  // =========================================================================
  unlockDmMode() {
    const pinInput = document.getElementById("dmPinInput");
    const errEl = document.getElementById("dmPinError");
    const pin = pinInput ? pinInput.value.trim() : "";

    if (pin !== DM_PIN) {
      if (errEl) {
        errEl.style.display = "block";
        errEl.classList.add("shake");
        setTimeout(() => errEl.classList.remove("shake"), 400);
      }
      if (pinInput) pinInput.value = "";
      return;
    }

    // Correct PIN
    if (errEl) errEl.style.display = "none";
    if (pinInput) pinInput.value = "";
    this.dmModeUnlocked = true;
    document.getElementById("dmGateBox").style.display = "none";
    document.getElementById("dmUnlockedContent").style.display = "block";
    this.renderAffectionTracker();
  }

  lockDmMode() {
    this.dmModeUnlocked = false;
    document.getElementById("dmGateBox").style.display = "block";
    document.getElementById("dmUnlockedContent").style.display = "none";
    const pinInput = document.getElementById("dmPinInput");
    if (pinInput) pinInput.value = "";
  }

  renderAffectionTracker() {
    const gateBox = document.getElementById("dmGateBox");
    const content = document.getElementById("dmUnlockedContent");
    if (!this.dmModeUnlocked) {
      if (gateBox) gateBox.style.display = "block";
      if (content) content.style.display = "none";
      return;
    }

    if (gateBox) gateBox.style.display = "none";
    if (content) content.style.display = "block";

    const container = document.getElementById("sheetTargetsList");
    const targets = this.currentCharacter.targets || [];
    container.innerHTML = "";

    if (targets.length === 0) {
      container.innerHTML = `<p style="color:var(--text-muted);text-align:center;padding:1rem;">Belum ada target romansa. Tambahkan dengan tombol di bawah.</p>`;
    }

    targets.forEach((t, idx) => {
      const card = document.createElement("div");
      card.className = "target-card";
      let heartsHtml = "";
      for (let h = 1; h <= 10; h++) {
        heartsHtml += `<span class="heart-dot ${h <= (t.affection || 0) ? 'active' : 'empty'}" onclick="app.setTargetAffection(${idx}, ${h})">♥</span>`;
      }
      card.innerHTML = `
        <div class="target-card-header">
          <span class="target-name">${this.escapeHtml(t.name || 'Target Asmara')}</span>
          <span class="target-status-badge">${this.escapeHtml(t.status || 'Crush')}</span>
        </div>
        <div class="target-heart-meter">
          ${heartsHtml}
          <span style="font-size:0.85rem;font-weight:800;color:var(--rose-light);margin-left:0.5rem;">(${t.affection || 0}/10)</span>
        </div>
        <div class="target-secret-box"><strong>Event Flag & Rahasia:</strong> ${this.escapeHtml(t.secret || 'Belum ada catatan rahasia.')}</div>
      `;
      container.appendChild(card);
    });
  }

  setTargetAffection(targetIdx, hearts) {
    if (!this.currentCharacter || !this.currentCharacter.targets) return;
    this.currentCharacter.targets[targetIdx].affection = hearts;
    this.saveCurrentCharacter();
    this.renderAffectionTracker();
    this.showToast(`Affection meter diperbarui menjadi ${hearts}/10 ♥`);
  }

  addNewTargetDialog() {
    const name = prompt("Nama Target Romansa / Gebetan / Rival Baru:");
    if (!name) return;
    const status = prompt("Status Hubungan (contoh: Secret Crush, Rival, Teman Sebangku):", "Secret Crush");
    const secret = prompt("Catatan Rahasia / Momen Berkesan:", "");
    if (!this.currentCharacter.targets) this.currentCharacter.targets = [];
    this.currentCharacter.targets.push({ name, status: status || "Secret Crush", affection: 1, secret: secret || "" });
    this.saveCurrentCharacter();
    this.renderAffectionTracker();
  }

  // =========================================================================
  // VITALS & REST INTERACTIONS
  // =========================================================================
  alterHealth(type, amount) {
    if (!this.currentCharacter) return;
    if (type === "phys") {
      this.currentCharacter.physicalHpCurrent = Math.max(0, Math.min(this.currentCharacter.physicalHpMax, this.currentCharacter.physicalHpCurrent + amount));
    } else {
      this.currentCharacter.composureCurrent = Math.max(0, Math.min(this.currentCharacter.composureMax, this.currentCharacter.composureCurrent + amount));
    }
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
  }

  promptHpDamage(type) {
    const val = prompt(`Masukkan jumlah Damage / Salting (${type === 'phys' ? 'Physical HP' : 'Composure'}):`, "1");
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) this.alterHealth(type, -num);
  }

  promptHpHeal(type) {
    const val = prompt(`Masukkan jumlah Pemulihan / Tenang (${type === 'phys' ? 'Physical HP' : 'Composure'}):`, "1");
    const num = parseInt(val);
    if (!isNaN(num) && num > 0) this.alterHealth(type, num);
  }

  triggerShortRest() {
    if (!this.currentCharacter) return;
    const spent = this.currentCharacter.restDiceSpent || 0;
    const total = this.currentCharacter.restDiceTotal || 1;
    if (spent >= total) { alert("Rest Dice sudah habis! Butuh Long Rest sepulang sekolah."); return; }
    const eks = DD_DATA.ekskul.find(e => e.id === this.currentCharacter.ekskulId);
    const dieFaces = eks ? (eks.hitDie === "d10" ? 10 : eks.hitDie === "d8" ? 8 : 6) : 8;
    const rolled = Math.floor(Math.random() * dieFaces) + 1;
    const arc = DD_DATA.archetypes.find(a => a.id === this.currentCharacter.archetypeId);
    const phyBonus = (arc && arc.statBonus.physique) || 0;
    const modPhy = Math.floor((this.currentCharacter.baseAbilities.physique + phyBonus - 10) / 2);
    const healTotal = Math.max(1, rolled + modPhy);
    this.currentCharacter.restDiceSpent += 1;
    this.currentCharacter.physicalHpCurrent = Math.min(this.currentCharacter.physicalHpMax, this.currentCharacter.physicalHpCurrent + healTotal);
    this.currentCharacter.composureCurrent = Math.min(this.currentCharacter.composureMax, this.currentCharacter.composureCurrent + healTotal);
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.showToast(`Short Rest: 1d${dieFaces} (${rolled}) +${modPhy} = ${healTotal} HP & Composure dipulihkan!`);
  }

  triggerLongRest() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;

    // Full HP & Composure restore
    char.physicalHpCurrent = char.physicalHpMax;
    char.composureCurrent = char.composureMax;
    char.restDiceSpent = 0;
    char.heartInspiration = true;

    // Financial: add daily allowance + job wage (Long Rest = new day)
    const dailyIncome = (char.dailyMoneyAmount || 0) + (char.jobWageAmount || 0);
    if (dailyIncome > 0) {
      char.savingsAmount = (char.savingsAmount || 0) + dailyIncome;
      // Update savings display string (simplified format)
      char.savings = `¥${char.savingsAmount.toLocaleString()} / Rp ${(char.savingsAmount * 100).toLocaleString()}`;
    }

    document.querySelectorAll(".check-bubble").forEach(cb => cb.checked = false);
    this.saveCurrentCharacter();
    this.renderCharacterSheet();

    const incomeMsg = dailyIncome > 0 ? ` +¥${dailyIncome} (uang saku${char.jobWageAmount ? ' + baito' : ''}) masuk tabungan.` : "";
    this.showToast(`Long Rest: Hari baru dimulai! Seluruh HP & Composure pulih penuh.${incomeMsg}`);
  }

  toggleHeartInspiration() {
    if (!this.currentCharacter) return;
    this.currentCharacter.heartInspiration = !this.currentCharacter.heartInspiration;
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.showToast(this.currentCharacter.heartInspiration ? "Heart Token Aktif! Siap digunakan untuk momen romantis." : "Heart Token telah digunakan.");
  }

  saveCurrentCharacter() {
    if (!this.currentCharacter) return;
    const idx = this.roster.findIndex(c => c.id === this.currentCharacter.id);
    if (idx >= 0) { this.roster[idx] = this.currentCharacter; this.saveRoster(); }
    if (this.supabase) {
      this.saveCharacterToCloud(this.currentCharacter);
    }
  }

  addCustomInventoryItem() {
    const input = document.getElementById("addCustomItemInput");
    const val = input.value.trim();
    if (!val || !this.currentCharacter) return;
    if (!this.currentCharacter.bagItems) this.currentCharacter.bagItems = [];
    this.currentCharacter.bagItems.push(val);
    input.value = "";
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
    this.showToast(`"${val}" dimasukkan ke dalam tas sekolah.`);
  }

  removeInventoryItem(type, idx) {
    if (!this.currentCharacter) return;
    if (type === "bag") this.currentCharacter.bagItems.splice(idx, 1);
    else this.currentCharacter.keepsakes.splice(idx, 1);
    this.saveCurrentCharacter();
    this.renderCharacterSheet();
  }

  // =========================================================================
  // DICE ROLLER MODAL
  // =========================================================================
  toggleDiceModal() {
    const modal = document.getElementById("diceModal");
    modal.style.display = modal.style.display === "none" ? "flex" : "none";
  }

  rollAbilityCheck(statKey) {
    if (!this.currentCharacter) return;
    const arc = DD_DATA.archetypes.find(a => a.id === this.currentCharacter.archetypeId);
    const base = this.currentCharacter.baseAbilities[statKey] || 10;
    const bonus = (arc && arc.statBonus[statKey]) || 0;
    const mod = Math.floor((base + bonus - 10) / 2);
    this.rollDice(20, mod, `Ability Check: ${DD_DATA.abilities[statKey].name}`);
  }

  rollDice(faces = 20, forcedMod = null, label = "") {
    const customModInput = document.getElementById("diceCustomMod");
    const mod = forcedMod !== null ? forcedMod : (parseInt(customModInput?.value) || 0);
    const rawRoll = Math.floor(Math.random() * faces) + 1;
    const total = rawRoll + mod;
    const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
    document.getElementById("diceModalDieLabel").textContent = `d${faces}`;
    document.getElementById("diceModalResultNum").textContent = total;
    document.getElementById("diceModalDetails").textContent = `${label ? label + ': ' : ''}d${faces} (${rawRoll}) ${modStr} = ${total}`;
    this.diceHistory.unshift({ label: label || `d${faces}`, roll: rawRoll, mod, total, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) });
    this.renderDiceHistory();
    const modal = document.getElementById("diceModal");
    if (modal.style.display === "none") modal.style.display = "flex";
  }

  renderDiceHistory() {
    const list = document.getElementById("diceHistoryList");
    list.innerHTML = this.diceHistory.slice(0, 10).map(h => `
      <div class="history-entry">
        <span>${this.escapeHtml(h.label)}</span>
        <span>(${h.roll} ${h.mod >= 0 ? '+' + h.mod : h.mod}) = <strong>${h.total}</strong> [${h.time}]</span>
      </div>
    `).join("");
  }

  // =========================================================================
  // AVATAR PICKER MODAL
  // =========================================================================
  openAvatarPickerModal() {
    const presets = [
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Ren", "https://api.dicebear.com/7.x/adventurer/svg?seed=Yuki",
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Hina", "https://api.dicebear.com/7.x/adventurer/svg?seed=Makoto",
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Ryuji", "https://api.dicebear.com/7.x/adventurer/svg?seed=Kasumi",
      "https://api.dicebear.com/7.x/adventurer/svg?seed=Futaba", "https://api.dicebear.com/7.x/adventurer/svg?seed=Okabe"
    ];
    const grid = document.getElementById("avatarPresetGrid");
    grid.innerHTML = presets.map(url => `<div class="preset-avatar-opt" onclick="app.selectPresetAvatar('${url}')"><img src="${url}" alt="Preset"></div>`).join("");
    document.getElementById("avatarModal").style.display = "flex";
  }

  closeAvatarPickerModal() { document.getElementById("avatarModal").style.display = "none"; }

  selectPresetAvatar(url) {
    if (this.builderDraft) { this.builderDraft.avatar = url; document.getElementById("builderAvatarImg").src = url; }
    this.closeAvatarPickerModal();
  }

  applyCustomAvatarUrl() {
    const url = document.getElementById("avatarCustomUrlInput").value.trim();
    if (url && this.builderDraft) { this.builderDraft.avatar = url; document.getElementById("builderAvatarImg").src = url; }
    this.closeAvatarPickerModal();
  }

  handleModalBackdropClick(e, modalId) {
    if (e.target.id === modalId) document.getElementById(modalId).style.display = "none";
  }

  // =========================================================================
  // JSON IMPORT / EXPORT
  // =========================================================================
  exportCurrentJSON() {
    if (!this.currentCharacter) return;
    const str = JSON.stringify(this.currentCharacter, null, 2);
    const blob = new Blob([str], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${this.currentCharacter.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_DamselAndDesire.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Karakter diekspor ke file JSON!");
  }

  importCharacter(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (!imported.name || !imported.baseAbilities) throw new Error("Format file JSON bukan karakter Damsel & Desire yang valid.");
        imported.id = "char_" + Date.now();
        this.roster.unshift(imported);
        this.saveRoster();
        this.renderRoster();
        this.showToast(`Karakter ${imported.name} berhasil diimpor!`);
        this.openCharacterSheet(imported.id);
      } catch (err) { alert("Gagal mengimpor file: " + err.message); }
    };
    reader.readAsText(file);
    event.target.value = "";
  }

  // =========================================================================
  // PRINT & EXPORT PDF (OFFICIAL 3-PAGE A4 FORMAT)
  // =========================================================================
  printOrExportPDF() {
    if (!this.currentCharacter) return;
    const char = this.currentCharacter;
    const arc = DD_DATA.archetypes.find(a => a.id === char.archetypeId);
    const eks = DD_DATA.ekskul.find(e => e.id === char.ekskulId);
    const soc = DD_DATA.socialClasses.find(s => s.id === char.socialClassId);
    const statKeys = ["physique", "intelligent", "looks", "mind", "talent", "luck"];
    const mods = {}, totals = {};
    const profBonus = char.grade >= 5 ? 3 : 2;
    statKeys.forEach(k => {
      const base = char.baseAbilities[k] || 10;
      const bonus = (arc && arc.statBonus[k]) || 0;
      totals[k] = base + bonus;
      mods[k] = Math.floor((totals[k] - 10) / 2);
    });

    // 4 Signature Moves on Page 1
    const signatureMoves = [
      DD_DATA.basicActions[0], // Pukulan Fisik
      DD_DATA.basicActions[6], // Senyuman Persuasi
      ...(eks && eks.clubMoves ? [eks.clubMoves[0]] : []),
      ...(arc && arc.archetypeMoves ? [arc.archetypeMoves[0]] : [])
    ];

    // All club and archetype moves on Page 2
    const specialMoves = [
      ...(eks && eks.clubMoves ? eks.clubMoves.map(m => ({ ...m, tag: eks.name.split('(')[0].trim() })) : []),
      ...(arc && arc.archetypeMoves ? arc.archetypeMoves.map(m => ({ ...m, tag: arc.name.split('(')[0].trim() })) : [])
    ];

    const container = document.getElementById("printSheetContainer");
    container.innerHTML = `
      <!-- PAGE 1: CORE STATS, VITALS, 18 SKILLS & SIGNATURE MOVES -->
      <div class="print-page">
        <div class="print-header">
          <div class="print-header-brand">
            <h1>DAMSEL &amp; DESIRE</h1>
            <span>Japanese High School Romance TRPG</span>
            <div style="font-size:5.5pt;margin-top:2px;color:#cbd5e0;">OFFICIAL CHARACTER RECORD SHEET</div>
          </div>
          <div class="print-header-info">
            <div><strong>NAMA:</strong>${this.escapeHtml(char.name)}</div>
            <div><strong>ARCHETYPE:</strong>${arc ? arc.name.split('(')[0].trim() : '-'}</div>
            <div><strong>EKSKUL:</strong>${eks ? eks.name.split('(')[0].trim() : '-'}</div>
            <div><strong>KELAS / LVL:</strong>Kelas ${char.grade === 1 ? '10' : char.grade <= 4 ? '11' : '12'} (Lvl ${char.grade})</div>
            <div><strong>ORIGIN:</strong>${soc ? soc.name.split('(')[0].trim() : '-'}</div>
            <div><strong>HEART TOKEN:</strong>[ ${char.heartInspiration ? '✓' : ' '} ] Desire Inspiration</div>
          </div>
        </div>

        <table class="print-table" style="text-align:center;">
          <tr>
            <th style="width:14%;">PHYSICAL AC</th>
            <th style="width:14%;">INITIATIVE</th>
            <th style="width:14%;">SPEED</th>
            <th style="width:20%;">PHYSICAL HP</th>
            <th style="width:20%;">COMPOSURE (MENTAL)</th>
            <th style="width:18%;">SOCIAL AC</th>
          </tr>
          <tr>
            <td style="font-size:10pt;font-weight:bold;">${10 + mods.physique}</td>
            <td style="font-size:10pt;font-weight:bold;">${mods.physique >= 0 ? '+' + mods.physique : mods.physique}</td>
            <td style="font-size:10pt;font-weight:bold;">${(arc && arc.id === 'jock') ? '35 ft' : '30 ft'}</td>
            <td>Max: [ ${char.physicalHpMax} ] Cur: [ ${char.physicalHpCurrent} ]</td>
            <td>Max: [ ${char.composureMax} ] Cur: [ ${char.composureCurrent} ]</td>
            <td style="font-size:10pt;font-weight:bold;">${10 + mods.mind + Math.max(0, mods.looks)}</td>
          </tr>
        </table>

        <div class="print-title">ABILITY SCORES, SAVING THROWS &amp; 18 SUB-SKILLS</div>
        <table class="print-table">
          <tr>${statKeys.map(k => {
            const def = DD_DATA.abilities[k];
            const isProfSave = (char.proficientSaves || []).includes(k);
            const saveVal = mods[k] + (isProfSave ? profBonus : 0);
            return `<td style="vertical-align:top;width:16.6%;">
              <div style="font-weight:bold;color:#1a365d;text-align:center;font-size:7pt;">${def.name}</div>
              <div style="text-align:center;font-size:9.5pt;font-weight:bold;">${totals[k]} (${mods[k] >= 0 ? '+' + mods[k] : mods[k]})</div>
              <div style="font-size:6pt;background:#edf2f7;padding:1px 2px;text-align:center;margin:2px 0;">[ ${isProfSave ? '✓' : ' '} ] Save: ${saveVal >= 0 ? '+' + saveVal : saveVal}</div>
              ${def.skills.map(sk => {
                const isProfSk = (char.proficientSkills || []).includes(sk.id);
                const skVal = mods[k] + (isProfSk ? profBonus : 0);
                return `<div style="font-size:5.8pt;line-height:1.2;">[ ${isProfSk ? '✓' : ' '} ] ${sk.name} (${skVal >= 0 ? '+' + skVal : skVal})</div>`;
              }).join("")}
            </td>`;
          }).join("")}</tr>
        </table>

        <!-- Senses & Proficiencies Table -->
        <table class="print-table">
          <tr>
            <th style="width:50%;">SENSES (INDRA &amp; KEPEKAAN PASIF)</th>
            <th style="width:50%;">PROFISIENSI GAYA, PERALATAN &amp; BAHASA</th>
          </tr>
          <tr>
            <td style="font-size:6.3pt;line-height:1.3;">
              • [ ${10 + mods.mind + ((char.proficientSkills || []).includes("awareness") ? profBonus : 0)} ] <strong>Passive Perception</strong> (Lirik tatapan rahasia orang lain)<br>
              • [ ${10 + mods.intelligent + ((char.proficientSkills || []).includes("people") ? profBonus : 0)} ] <strong>Passive Insight</strong> (Peka salting &amp; motif bohong)<br>
              • [ ${10 + mods.intelligent + ((char.proficientSkills || []).includes("academic") ? profBonus : 0)} ] <strong>Passive Investigation</strong> (Temu surat di loker)
            </td>
            <td style="font-size:6.3pt;line-height:1.3;">
              • <strong>Seragam:</strong> ${this.escapeHtml(char.profUniform || 'Standar Blazer Sekolah')}<br>
              • <strong>Alat Ekskul:</strong> ${this.escapeHtml(char.profClubTools || (eks ? eks.name : 'Sesuai ekskul'))}<br>
              • <strong>Bahasa:</strong> ${this.escapeHtml(char.profLanguages || 'Bahasa Jepang Standar, Slang Gaul')}
            </td>
          </tr>
        </table>

        <div class="print-title">SIGNATURE ACTIONS &amp; MOVES (AKSI &amp; SERANGAN UTAMA)</div>
        <table class="print-table">
          <tr>
            <th style="width:30%;">NAMA AKSI / MOVE</th>
            <th style="width:18%;">JANGKAUAN</th>
            <th style="width:20%;">CHECK</th>
            <th style="width:32%;">EFEK / DAMAGE</th>
          </tr>
          ${signatureMoves.map(m => `<tr>
            <td><strong>${this.escapeHtml(m.name)}</strong></td>
            <td>${this.escapeHtml(m.range)}</td>
            <td>${this.escapeHtml(m.check)}</td>
            <td>${this.escapeHtml(m.damage || m.effect || '-')}</td>
          </tr>`).join("")}
        </table>
      </div>

      <!-- PAGE 2: ROLEPLAY, FEATURES & INVENTORY -->
      <div class="print-page">
        <div class="print-title" style="font-size:9pt;border-bottom:1.5px solid #1a365d;padding-bottom:3px;margin-bottom:6px;">
          DAMSEL &amp; DESIRE — ROLEPLAY, LATAR BELAKANG &amp; INVENTORY
        </div>
        <table class="print-table">
          <tr>
            <td style="width:50%;vertical-align:top;">
              <div class="print-title">BACKSTORY &amp; KISAH MASA LALU</div>
              <div class="print-box" style="margin-bottom:4px;">${this.escapeHtml(char.backstory || 'Tidak ada catatan kisah masa lalu.')}</div>
              <div class="print-title">PERSONALITY TRAITS (SIFAT &amp; KEBIASAAN)</div>
              <div class="print-box">${this.escapeHtml(char.personality || 'Tidak ada catatan.')}</div>
              <div class="print-title">IDEALS &amp; YOUTH DREAMS (PRINSIP &amp; CITA-CITA)</div>
              <div class="print-box">${this.escapeHtml(char.ideals || 'Tidak ada catatan.')}</div>
              <div class="print-title">BONDS &amp; JANJI MASA LALU (IKATAN PENTING)</div>
              <div class="print-box">${this.escapeHtml(char.bonds || 'Tidak ada catatan.')}</div>
              <div class="print-title">FLAWS &amp; INSECURITIES (KELEMAHAN &amp; SALTING)</div>
              <div class="print-box">${this.escapeHtml(char.flaws || 'Tidak ada catatan.')}</div>
            </td>
            <td style="width:50%;vertical-align:top;">
              <div class="print-title">ARCHETYPE TRAITS (${arc ? arc.name : '-'})</div>
              <div class="print-box">${arc ? arc.perks.map(p => `• <strong>${p.name}:</strong> ${p.desc}`).join('<br>') : '-'}</div>
              <div class="print-title">EKSKUL PERKS (${eks ? eks.name : '-'})</div>
              <div class="print-box">${eks ? eks.perkDesc : '-'}</div>
              <div class="print-title">ORIGIN &amp; SOCIAL CLASS (${soc ? soc.name : '-'})</div>
              <div class="print-box">${soc ? soc.perkDesc : '-'}</div>
            </td>
          </tr>
        </table>

        <div class="print-title">SCHOOL BAG, INVENTORY &amp; FINANSIAL</div>
        <table class="print-table">
          <tr>
            <th style="width:42%;">ISI TAS SEKOLAH (BAG)</th>
            <th style="width:30%;">KEEPSAKES &amp; JIMAT</th>
            <th style="width:28%;">FINANSIAL SMA</th>
          </tr>
          <tr>
            <td style="vertical-align:top;font-size:6.3pt;line-height:1.3;">${(char.bagItems || []).map(i => `• ${this.escapeHtml(i)}`).join('<br>')}</td>
            <td style="vertical-align:top;font-size:6.3pt;line-height:1.3;">${(char.keepsakes || []).map(i => `♥ ${this.escapeHtml(i)}`).join('<br>')}</td>
            <td style="vertical-align:top;font-size:6.3pt;line-height:1.3;">
              <strong>Uang Saku:</strong><br>${char.dailyMoney || '-'}<br><br>
              <strong>Tabungan:</strong><br>${char.savings || '-'}<br><br>
              <strong>Baito:</strong><br>${char.job || '-'}
            </td>
          </tr>
        </table>

        <div class="print-title">JURUS SPESIAL EKSKUL &amp; ARCHETYPE</div>
        <table class="print-table">
          <tr>
            <th style="width:30%;">JURUS / MOVE</th>
            <th style="width:16%;">TIPE / ASAL</th>
            <th style="width:18%;">CHECK</th>
            <th style="width:36%;">EFEK / DESKRIPSI</th>
          </tr>
          ${specialMoves.map(m => `<tr>
            <td><strong>${this.escapeHtml(m.name)}</strong></td>
            <td>${this.escapeHtml(m.tag)}</td>
            <td>${this.escapeHtml(m.check)}</td>
            <td>${this.escapeHtml(m.effect || m.damage || '-')}</td>
          </tr>`).join("")}
        </table>
      </div>

      <!-- PAGE 3: AFFECTION TRACKER & CALENDAR (DM ONLY) -->
      <div class="print-page">
        <div class="print-title" style="font-size:9pt;border-bottom:1.5px solid #881337;padding-bottom:3px;color:#881337;margin-bottom:6px;">
          DAMSEL &amp; DESIRE — AFFECTION METER &amp; SCHOOL LOG (DM RECORD)
        </div>
        <div class="print-title" style="color:#881337;">AFFECTION &amp; RELATIONSHIP TRACKER (TARGET ROMANSA &amp; RIVAL)</div>
        <table class="print-table">
          <tr style="background:#881337;color:#fff;">
            <th style="width:25%;">TARGET ROMANSA / RIVAL</th>
            <th style="width:18%;">STATUS</th>
            <th style="width:22%;">METERAN HATI (AFFECTION)</th>
            <th style="width:35%;">EVENT FLAGS &amp; RAHASIA</th>
          </tr>
          ${(char.targets || []).map(t => {
            let hearts = "";
            for (let i = 1; i <= 10; i++) hearts += i <= t.affection ? "♥ " : "○ ";
            return `<tr>
              <td><strong>${this.escapeHtml(t.name)}</strong></td>
              <td>${this.escapeHtml(t.status)}</td>
              <td style="font-size:7pt;color:#881337;font-weight:bold;">${hearts} (${t.affection}/10)</td>
              <td>${this.escapeHtml(t.secret)}</td>
            </tr>`;
          }).join("")}
          <tr>
            <td>[ Slot Tambahan / Rival ]</td>
            <td>-</td>
            <td style="color:#a0aec0;">○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ( /10)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>[ Slot Tambahan / Gebetan ]</td>
            <td>-</td>
            <td style="color:#a0aec0;">○ ○ ○ ○ ○ ○ ○ ○ ○ ○ ( /10)</td>
            <td>-</td>
          </tr>
        </table>

        <div class="print-title" style="margin-top:8px;">KALENDER KEGIATAN SMA (EVENT FLAGS TAHUN AJARAN)</div>
        <table class="print-table">
          <tr>
            <th style="width:30%;">SEMESTER &amp; ACARA</th>
            <th style="width:58%;">DESKRIPSI &amp; KESEMPATAN ASMARA</th>
            <th style="width:12%;text-align:center;">STATUS</th>
          </tr>
          ${DD_DATA.calendarEvents.map(evt => {
            const done = (char.calendarChecked || []).includes(evt.id);
            return `<tr>
              <td><strong>${this.escapeHtml(evt.name)}</strong><br><span style="font-size:5.8pt;color:#718096;">${this.escapeHtml(evt.term)}</span></td>
              <td style="font-size:6.3pt;">${this.escapeHtml(evt.desc)}</td>
              <td style="text-align:center;font-weight:bold;color:${done ? '#10b981' : '#a0aec0'};">${done ? '✓ SELESAI' : '[  ]'}</td>
            </tr>`;
          }).join("")}
        </table>
      </div>
    `;
    setTimeout(() => window.print(), 100);
  }

  // =========================================================================
  // CLOUD SUPABASE INTEGRATION (AUTOMATIC GLOBAL REALTIME SYNC)
  // =========================================================================
  async initSupabase() {
    try {
      if (typeof window !== "undefined" && window.supabase) {
        this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
      }
    } catch (err) {
      console.warn("Supabase init error:", err);
    }

    this.updateCloudUI();

    if (this.supabase) {
      await this.loadRosterFromSupabase(false);
      this.setupGlobalRealtimeSubscription();
    }
  }

  updateCloudUI(customStatus = null) {
    const dot = document.getElementById("cloudStatusDot");
    const modalDot = document.getElementById("cloudModalStatusDot");
    const navLabel = document.getElementById("navCloudLabel");
    const title = document.getElementById("cloudStatusTitle");
    const desc = document.getElementById("cloudStatusDesc");

    const isConnected = !!this.supabase;

    if (customStatus === "syncing") {
      if (dot) dot.className = "cloud-status-dot syncing";
      if (modalDot) modalDot.className = "cloud-status-dot large syncing";
      if (navLabel) navLabel.textContent = "Cloud: Menyinkronkan...";
      return;
    }

    if (isConnected) {
      if (dot) dot.className = "cloud-status-dot online";
      if (modalDot) modalDot.className = "cloud-status-dot large online";
      if (navLabel) navLabel.textContent = "Cloud: Online (Global)";
      if (title) title.textContent = "🟢 Terhubung: Database Cloud Global";
      if (desc) desc.textContent = "Semua karakter disinkronkan secara publik. Perubahan HP, status, & tabungan otomatis realtime.";
    } else {
      if (dot) dot.className = "cloud-status-dot offline";
      if (modalDot) modalDot.className = "cloud-status-dot large offline";
      if (navLabel) navLabel.textContent = "Cloud: Offline";
      if (title) title.textContent = "⚪ Mode Lokal (Offline)";
      if (desc) desc.textContent = "Koneksi cloud tidak terhubung. Data tersimpan di memori browser lokal.";
    }
  }

  openCloudModal() {
    this.updateCloudUI();
    const modal = document.getElementById("cloudModal");
    if (modal) modal.style.display = "flex";
  }

  closeCloudModal() {
    const modal = document.getElementById("cloudModal");
    if (modal) modal.style.display = "none";
  }

  async loadRosterFromSupabase(showToast = false) {
    if (!this.supabase) return;
    try {
      this.updateCloudUI("syncing");

      const { data, error } = await this.supabase
        .from('characters')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const cloudChars = data.map(row => row.data);
        this.roster = cloudChars;
        this.saveRoster(); // Local cache
        this.renderRoster();
        this.updateCloudUI();
        if (showToast) this.showToast(`✓ Berhasil memuat ${data.length} karakter dari Cloud Global.`);
      } else {
        // If Supabase table is empty but we have local roster, seed it to cloud
        if (this.roster.length > 0) {
          await this.syncCurrentRosterToCloud(false);
        }
        this.updateCloudUI();
      }
    } catch (err) {
      console.warn("Gagal memuat roster dari Supabase:", err);
      this.updateCloudUI();
      if (showToast) this.showToast("Gagal memuat dari Cloud: " + (err.message || "Error jaringan"));
    }
  }

  setupGlobalRealtimeSubscription() {
    if (!this.supabase) return;
    if (this.realtimeChannel) {
      this.supabase.removeChannel(this.realtimeChannel);
      this.realtimeChannel = null;
    }

    this.realtimeChannel = this.supabase
      .channel('global-characters')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'characters' },
        (payload) => this.handleRealtimeEvent(payload)
      )
      .subscribe((status) => {
        const dot = document.getElementById("cloudStatusDot");
        if (dot) {
          dot.className = status === 'SUBSCRIBED' ? 'cloud-status-dot online' : 'cloud-status-dot syncing';
        }
      });
  }

  handleRealtimeEvent(payload) {
    const eventType = payload.eventType;

    if (eventType === "INSERT") {
      const newChar = payload.new.data;
      if (!this.roster.some(c => c.id === newChar.id)) {
        this.roster.unshift(newChar);
        this.saveRoster();
        this.renderRoster();
        this.showToast(`Karakter baru: "${newChar.name}" ditambahkan!`);
      }
    } else if (eventType === "UPDATE") {
      const updatedChar = payload.new.data;
      const idx = this.roster.findIndex(c => c.id === updatedChar.id);
      if (idx >= 0) {
        this.roster[idx] = updatedChar;
      } else {
        this.roster.unshift(updatedChar);
      }
      this.saveRoster();
      this.renderRoster();

      // If this character is currently viewed in Sheet, LIVE RE-RENDER!
      if (this.currentCharacter && this.currentCharacter.id === updatedChar.id) {
        this.currentCharacter = updatedChar;
        this.renderCharacterSheet();
        this.showToast(`Status "${updatedChar.name}" ter-update realtime!`);
      }
    } else if (eventType === "DELETE") {
      const deletedId = payload.old.id;
      this.roster = this.roster.filter(c => c.id !== deletedId);
      this.saveRoster();
      this.renderRoster();
      if (this.currentCharacter && this.currentCharacter.id === deletedId) {
        this.showToast("Karakter yang sedang dibuka telah dihapus.");
        this.showView("landing");
      }
    }
  }

  async saveCharacterToCloud(char) {
    if (!this.supabase || !char) return;
    try {
      const { error } = await this.supabase
        .from('characters')
        .upsert({
          id: char.id,
          room_code: 'global',
          name: char.name,
          data: char,
          updated_at: new Date().toISOString()
        });
      if (error) console.warn("Supabase upsert error:", error);
    } catch (e) {
      console.warn("Error saving to cloud:", e);
    }
  }

  async deleteCharacterFromCloud(charId) {
    if (!this.supabase) return;
    try {
      await this.supabase
        .from('characters')
        .delete()
        .eq('id', charId);
    } catch (e) {
      console.warn("Error deleting from cloud:", e);
    }
  }

  async syncCurrentRosterToCloud(showToast = true) {
    if (!this.supabase) {
      alert("Koneksi Supabase belum siap.");
      return;
    }
    if (this.roster.length === 0) {
      alert("Tidak ada karakter untuk disinkronkan.");
      return;
    }
    try {
      if (showToast) this.showToast("Menyinkronkan karakter ke Cloud Global...");
      for (const char of this.roster) {
        await this.saveCharacterToCloud(char);
      }
      if (showToast) this.showToast(`✓ Seluruh (${this.roster.length}) karakter berhasil disinkronkan ke Cloud Global!`);
      this.closeCloudModal();
    } catch (err) {
      alert("Gagal menyinkronkan ke cloud: " + err.message);
    }
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }
}

const app = new DamselDesireApp();
window.addEventListener("DOMContentLoaded", () => app.init());
