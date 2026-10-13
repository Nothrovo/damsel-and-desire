export interface DrawerStat {
  label: string;
  value: string;
  accent?: boolean;
}

export interface DrawerAction {
  label: string;
  variant?: "primary" | "secondary" | "accent" | "purple";
  icon?: string;
  onClick: () => void;
}

export interface DrawerContent {
  title: string;
  category?: string;
  categoryType?: "combat" | "social" | "club" | "subclass" | "item" | "feat" | "skill" | "secret";
  badge?: string;
  subtitle?: string;
  stats?: DrawerStat[];
  flavor?: string;
  mechanics?: string;
  notes?: string;
  actions?: DrawerAction[];
}

function escapeHtml(str: string): string {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export class SlideOverDrawer {
  private overlayEl: HTMLElement | null = null;
  private drawerEl: HTMLElement | null = null;
  private currentContent: DrawerContent | null = null;
  private isOpen = false;

  render(): string {
    return `
      <div id="slideOverOverlay" class="drawer-overlay" style="display:none;" aria-hidden="true">
        <aside id="slideOverDrawer" class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawerTitle">
          <!-- Drawer Header -->
          <div class="drawer-header">
            <div class="drawer-header-meta">
              <span id="drawerCategoryBadge" class="drawer-category-badge">MOVE</span>
              <span id="drawerBadge" class="drawer-sub-badge" style="display:none;"></span>
            </div>
            <div class="drawer-title-row">
              <h2 id="drawerTitle" class="drawer-title">Nama Elemen</h2>
              <button id="closeSlideOverBtn" class="drawer-close-btn" aria-label="Tutup Panel" type="button">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:20px;height:20px;">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
            <div id="drawerSubtitle" class="drawer-subtitle" style="display:none;"></div>
          </div>

          <!-- Drawer Body (Scrollable) -->
          <div class="drawer-body">
            <!-- Stats / Mechanics Key-Value Strip -->
            <div id="drawerStatsGrid" class="drawer-stats-grid" style="display:none;"></div>

            <!-- Roleplay & Atmosphere Box -->
            <div id="drawerFlavorSection" class="drawer-section" style="display:none;">
              <div class="drawer-section-heading">
                <span>📖</span>
                <span>SUASANA &amp; ROLEPLAY</span>
              </div>
              <div id="drawerFlavorContent" class="drawer-flavor-box"></div>
            </div>

            <!-- Core Rules & Mechanics Box -->
            <div id="drawerMechanicsSection" class="drawer-section" style="display:none;">
              <div class="drawer-section-heading">
                <span>⚡</span>
                <span>ATURAN &amp; MEKANIK TRPG</span>
              </div>
              <div id="drawerMechanicsContent" class="drawer-mechanics-box"></div>
            </div>

            <!-- Additional Notes (Optional) -->
            <div id="drawerNotesSection" class="drawer-section" style="display:none;">
              <div class="drawer-section-heading">
                <span>💡</span>
                <span>CATATAN KHUSUS</span>
              </div>
              <div id="drawerNotesContent" class="drawer-notes-box"></div>
            </div>
          </div>

          <!-- Drawer Sticky Actions Footer -->
          <div id="drawerFooter" class="drawer-footer" style="display:none;">
            <div id="drawerActionsContainer" class="drawer-actions-container"></div>
          </div>
        </aside>
      </div>
    `;
  }

  attachEvents(): void {
    this.overlayEl = document.getElementById("slideOverOverlay");
    this.drawerEl = document.getElementById("slideOverDrawer");

    document.getElementById("closeSlideOverBtn")?.addEventListener("click", () => this.close());

    this.overlayEl?.addEventListener("click", (e) => {
      if (e.target === this.overlayEl) {
        this.close();
      }
    });

    // Close on Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  open(content: DrawerContent): void {
    this.currentContent = content;
    this.isOpen = true;

    if (!this.overlayEl || !this.drawerEl) {
      this.overlayEl = document.getElementById("slideOverOverlay");
      this.drawerEl = document.getElementById("slideOverDrawer");
      this.attachEvents();
    }

    if (!this.overlayEl || !this.drawerEl) return;

    // 1. Populate Category Badge
    const catBadge = document.getElementById("drawerCategoryBadge");
    if (catBadge) {
      catBadge.textContent = (content.category || "DETAIL").toUpperCase();
      catBadge.className = `drawer-category-badge badge-${content.categoryType || "default"}`;
    }

    // 2. Secondary Badge
    const subBadge = document.getElementById("drawerBadge");
    if (subBadge) {
      if (content.badge) {
        subBadge.textContent = content.badge;
        subBadge.style.display = "inline-block";
      } else {
        subBadge.style.display = "none";
      }
    }

    // 3. Title & Subtitle
    const titleEl = document.getElementById("drawerTitle");
    if (titleEl) titleEl.textContent = content.title;

    const subEl = document.getElementById("drawerSubtitle");
    if (subEl) {
      if (content.subtitle) {
        subEl.textContent = content.subtitle;
        subEl.style.display = "block";
      } else {
        subEl.style.display = "none";
      }
    }

    // 4. Stats Grid
    const statsGrid = document.getElementById("drawerStatsGrid");
    if (statsGrid) {
      if (content.stats && content.stats.length > 0) {
        statsGrid.innerHTML = content.stats.map(s => `
          <div class="drawer-stat-pill ${s.accent ? 'stat-accent' : ''}">
            <span class="drawer-stat-lbl">${escapeHtml(s.label)}</span>
            <span class="drawer-stat-val">${escapeHtml(s.value)}</span>
          </div>
        `).join("");
        statsGrid.style.display = "grid";
      } else {
        statsGrid.style.display = "none";
      }
    }

    // 5. Flavor Box
    const flavorSec = document.getElementById("drawerFlavorSection");
    const flavorContent = document.getElementById("drawerFlavorContent");
    if (flavorSec && flavorContent) {
      if (content.flavor) {
        flavorContent.innerHTML = content.flavor;
        flavorSec.style.display = "block";
      } else {
        flavorSec.style.display = "none";
      }
    }

    // 6. Mechanics Box
    const mechSec = document.getElementById("drawerMechanicsSection");
    const mechContent = document.getElementById("drawerMechanicsContent");
    if (mechSec && mechContent) {
      if (content.mechanics) {
        mechContent.innerHTML = content.mechanics;
        mechSec.style.display = "block";
      } else {
        mechSec.style.display = "none";
      }
    }

    // 7. Notes Box
    const notesSec = document.getElementById("drawerNotesSection");
    const notesContent = document.getElementById("drawerNotesContent");
    if (notesSec && notesContent) {
      if (content.notes) {
        notesContent.innerHTML = content.notes;
        notesSec.style.display = "block";
      } else {
        notesSec.style.display = "none";
      }
    }

    // 8. Actions Footer
    const footerEl = document.getElementById("drawerFooter");
    const actionsContainer = document.getElementById("drawerActionsContainer");
    if (footerEl && actionsContainer) {
      if (content.actions && content.actions.length > 0) {
        actionsContainer.innerHTML = content.actions.map((act, idx) => `
          <button class="btn btn-${act.variant || 'primary'} drawer-action-btn" data-act-idx="${idx}" type="button">
            ${act.icon ? `<span class="act-icon">${act.icon}</span>` : ''}
            <span>${escapeHtml(act.label)}</span>
          </button>
        `).join("");

        // Attach action handlers
        actionsContainer.querySelectorAll(".drawer-action-btn").forEach((btn) => {
          btn.addEventListener("click", () => {
            const idx = Number((btn as HTMLElement).dataset.actIdx);
            if (content.actions && content.actions[idx]) {
              content.actions[idx].onClick();
            }
          });
        });

        footerEl.style.display = "block";
      } else {
        footerEl.style.display = "none";
      }
    }

    // Reveal with animation
    this.overlayEl.style.display = "block";
    // Trigger transition next frame
    requestAnimationFrame(() => {
      this.overlayEl?.classList.add("open");
      this.drawerEl?.classList.add("open");
    });
  }

  close(): void {
    if (!this.overlayEl || !this.drawerEl) return;
    this.isOpen = false;

    this.overlayEl.classList.remove("open");
    this.drawerEl.classList.remove("open");

    setTimeout(() => {
      if (!this.isOpen && this.overlayEl) {
        this.overlayEl.style.display = "none";
      }
    }, 250);
  }
}

export const slideOverDrawer = new SlideOverDrawer();
