import { MAP_FLOORS } from "../map/mapData";
import { Map2DRenderer } from "../map/Map2DRenderer";
import { searchSchoolMap, type SearchResult } from "../map/mapSearch";
import { FALLBACK_DD_DATA } from "../data/fallbackCompendium";
import type { FloorId, Room, MapMode } from "../map/types";
import { getCategoryColor, getCategoryLabel } from "../map/mapUtils";
import { router } from "../router/router";
import { Map3DRenderer } from "../map/Map3DRenderer";

type AnyMapRenderer = Map2DRenderer | Map3DRenderer;
let activeRenderer: AnyMapRenderer | null = null;
let currentFloorId: FloorId = "campus";
let currentMode: MapMode = "2d";

export async function renderMapView(params: Record<string, string>): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  // Clean up any existing renderer
  if (activeRenderer) {
    activeRenderer.destroy();
    activeRenderer = null;
  }

  // Parse initial parameters from route
  currentFloorId =
    params.floor && params.floor in MAP_FLOORS ? (params.floor as FloorId) : "campus";
  currentMode = params.mode === "3d" ? "3d" : "2d";
  const initialRoomId = params.room || null;

  appContainer.innerHTML = `
    <div class="map-view-container">
      <!-- Toolbar -->
      <header class="map-toolbar">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <!-- Floor Selector -->
          <div class="map-floor-selector" id="mapFloorSelector" role="tablist" aria-label="Pilih Lantai">
            <button class="map-floor-btn ${currentFloorId === 'roof' ? 'active' : ''}" data-floor="roof" role="tab" aria-selected="${currentFloorId === 'roof'}">Roof</button>
            <button class="map-floor-btn ${currentFloorId === 'f3' ? 'active' : ''}" data-floor="f3" role="tab" aria-selected="${currentFloorId === 'f3'}">3F</button>
            <button class="map-floor-btn ${currentFloorId === 'f2' ? 'active' : ''}" data-floor="f2" role="tab" aria-selected="${currentFloorId === 'f2'}">2F</button>
            <button class="map-floor-btn ${currentFloorId === 'f1' ? 'active' : ''}" data-floor="f1" role="tab" aria-selected="${currentFloorId === 'f1'}">1F</button>
            <button class="map-floor-btn ${currentFloorId === 'campus' ? 'active' : ''}" data-floor="campus" role="tab" aria-selected="${currentFloorId === 'campus'}">Campus</button>
          </div>

          <!-- Mode Toggle -->
          <div class="map-mode-toggle" id="mapModeToggle">
            <button class="map-mode-btn ${currentMode === '2d' ? 'active' : ''}" data-mode="2d">2D Vector</button>
            <button class="map-mode-btn ${currentMode === '3d' ? 'active' : ''}" data-mode="3d">3D Isometric</button>
          </div>
        </div>

        <!-- Search Autocomplete Input -->
        <div class="map-search-container" id="mapSearchContainer">
          <div class="map-search-input-wrapper">
            <span class="map-search-icon" aria-hidden="true">🔍</span>
            <input
              type="text"
              id="mapSearchInput"
              class="map-search-input"
              placeholder="Cari ruangan atau klub... ( / )"
              autocomplete="off"
              spellcheck="false"
              aria-label="Cari ruangan atau klub"
            />
            <button id="mapSearchClearBtn" class="map-search-clear" style="display:none;" title="Hapus pencarian" aria-label="Hapus pencarian">✕</button>
          </div>
          <div id="mapSearchDropdown" class="map-search-dropdown" role="listbox"></div>
        </div>
      </header>

      <!-- Map Canvas Area -->
      <div class="map-canvas-area" id="mapCanvasContainer" role="region" aria-label="Denah Interaktif"></div>

      <!-- Floating HUD Controls -->
      <div class="map-floating-controls" role="toolbar" aria-label="Kontrol Tampilan Peta">
        <button class="map-hud-btn" id="mapZoomInBtn" title="Perbesar (+)" aria-label="Perbesar">+</button>
        <button class="map-hud-btn" id="mapZoomOutBtn" title="Perkecil (−)" aria-label="Perkecil">−</button>
        <button class="map-hud-btn" id="mapResetBtn" title="Reset Tampilan (⟲)" aria-label="Reset Tampilan">⟲</button>
      </div>

      <!-- Room Detail Drawer / Panel -->
      <aside id="mapRoomPanel" class="map-room-panel" style="display:none;" aria-label="Detail Ruangan"></aside>
    </div>
  `;

  const canvasContainer = document.getElementById("mapCanvasContainer");
  const roomPanel = document.getElementById("mapRoomPanel");
  const searchInput = document.getElementById("mapSearchInput") as HTMLInputElement | null;
  const searchClearBtn = document.getElementById("mapSearchClearBtn");
  const searchDropdown = document.getElementById("mapSearchDropdown");
  if (!canvasContainer) return;

  // Build ekskul dictionary for quick detail lookup
  const ekskulMap = new Map<string, any>();
  for (const ek of FALLBACK_DD_DATA.ekskul) {
    ekskulMap.set(ek.id, ek);
  }

  function updateUrl(roomId?: string | null, pushState: boolean = false) {
    const queryParts: string[] = [`floor=${currentFloorId}`];
    if (currentMode === "3d") {
      queryParts.push("mode=3d");
    }
    const targetRoom = roomId !== undefined ? roomId : activeRenderer?.getSelectedRoomId();
    if (targetRoom) {
      queryParts.push(`room=${targetRoom}`);
    }
    const newUrl = `/map?${queryParts.join("&")}`;
    router.navigate(newUrl, !pushState);
  }

  function showRoomDetails(room: Room) {
    if (!roomPanel) return;
    const colors = getCategoryColor(room.category);
    const floorLabel = MAP_FLOORS[room.floorId].label;
    const isCampusMainBuilding = room.id === "campus_main_building";

    // Lookup ekskul data if available
    const ekskulData = room.ekskulId ? ekskulMap.get(room.ekskulId) : null;

    roomPanel.innerHTML = `
      <div class="map-drawer-handle" aria-hidden="true"></div>
      <div class="map-room-panel-header">
        <h3 class="map-room-panel-title">${room.name}</h3>
        <button class="map-room-panel-close" id="mapClosePanelBtn" aria-label="Tutup Panel">✕</button>
      </div>
      <div>
        <span
          class="map-room-category-badge"
          style="background-color:${colors.fill};color:${colors.text};border:1px solid ${colors.stroke};"
        >
          ${getCategoryLabel(room.category)} • ${floorLabel}
        </span>
      </div>
      <p class="map-room-desc">${room.description || "Tidak ada deskripsi tambahan untuk ruangan ini."}</p>

      ${
        ekskulData
          ? `
          <div class="map-ekskul-card">
            <div class="map-ekskul-card-title">🏆 ${ekskulData.name}</div>
            <div class="map-ekskul-card-tagline">“${ekskulData.tagline || ''}”</div>
            <div class="map-ekskul-card-stats">
              Hit Die: <strong>${ekskulData.hit_die || ekskulData.hitDie || '-'}</strong> • Atribut Utama: <strong>${ekskulData.primary_stat || ekskulData.primaryStat || '-'}</strong>
            </div>
          </div>
          `
          : ""
      }

      ${
        room.relatedEkskulIds && room.relatedEkskulIds.length > 0
          ? `
          <div style="margin-bottom:0.85rem;font-size:0.75rem;color:var(--text-muted);">
            <span>Ekskul Terkait: </span>
            ${room.relatedEkskulIds
              .map(id => {
                const e = ekskulMap.get(id);
                return `<span style="background:var(--bg-surface);border:1px solid var(--border-subtle);padding:2px 6px;border-radius:4px;color:var(--text-main);margin-right:4px;">${e ? e.name : id}</span>`;
              })
              .join("")}
          </div>
          `
          : ""
      }

      <div class="map-room-actions">
        ${
          room.ekskulId
            ? `<a href="/compendium" class="btn-primary" style="font-size:0.8rem;padding:6px 12px;text-decoration:none;display:inline-flex;align-items:center;gap:4px;">
                <span>📚</span> Buka di Compendium
               </a>`
            : ""
        }
        ${
          isCampusMainBuilding
            ? `<button id="mapBtnEnter1F" class="btn-primary" style="font-size:0.8rem;padding:6px 12px;display:inline-flex;align-items:center;gap:4px;">
                <span>🚪</span> Masuk ke Gedung (1F)
               </button>`
            : ""
        }
        <button id="mapBtnFocusRoom" class="map-ctrl-btn" style="font-size:0.8rem;padding:6px 10px;" title="Pusatkan kamera pada ruangan ini">
          <span>🎯</span> Pusatkan
        </button>
      </div>
    `;
    roomPanel.style.display = "block";

    document.getElementById("mapClosePanelBtn")?.addEventListener("click", () => {
      roomPanel.style.display = "none";
      if (activeRenderer) activeRenderer.selectRoom(null);
      updateUrl(null, false);
    });

    document.getElementById("mapBtnFocusRoom")?.addEventListener("click", () => {
      activeRenderer?.focusRoom(room.id, true);
    });

    if (isCampusMainBuilding) {
      document.getElementById("mapBtnEnter1F")?.addEventListener("click", () => {
        switchToFloor("f1", true);
      });
    }
  }

  function switchToFloor(targetFloorId: FloorId, pushHistory: boolean = false) {
    if (targetFloorId === currentFloorId && activeRenderer) return;

    currentFloorId = targetFloorId;
    if (activeRenderer) {
      activeRenderer.setFloor(MAP_FLOORS[targetFloorId]);
      activeRenderer.selectRoom(null);
    }
    if (roomPanel) roomPanel.style.display = "none";

    // Update active floor button
    document.querySelectorAll(".map-floor-btn").forEach(btn => {
      const isSelected = btn.getAttribute("data-floor") === targetFloorId;
      btn.classList.toggle("active", isSelected);
      btn.setAttribute("aria-selected", String(isSelected));
    });

    updateUrl(null, pushHistory);
  }

  function selectAndFocusRoom(targetRoom: Room, targetFloorId: FloorId) {
    if (targetFloorId !== currentFloorId) {
      currentFloorId = targetFloorId;
      if (activeRenderer) {
        activeRenderer.setFloor(MAP_FLOORS[targetFloorId]);
      }
      document.querySelectorAll(".map-floor-btn").forEach(btn => {
        const isSelected = btn.getAttribute("data-floor") === targetFloorId;
        btn.classList.toggle("active", isSelected);
        btn.setAttribute("aria-selected", String(isSelected));
      });
    }

    if (activeRenderer) {
      activeRenderer.focusRoom(targetRoom.id, true);
    }
    showRoomDetails(targetRoom);
    updateUrl(targetRoom.id, false);
  }

  // Initialize Active Renderer (2D Vector or 3D Isometric)
  function initRenderer(selectedRoomId: string | null = null) {
    if (activeRenderer) {
      activeRenderer.destroy();
      activeRenderer = null;
    }

    if (currentMode === "3d") {
      activeRenderer = new Map3DRenderer({
        container: canvasContainer!,
        floorId: currentFloorId,
        selectedRoomId,
        onRoomSelect: (room: Room) => {
          if (room.id === "campus_main_building") {
            switchToFloor("f1", true);
            return;
          }
          activeRenderer?.focusRoom(room.id, true);
          showRoomDetails(room);
          updateUrl(room.id, false);
        }
      });
    } else {
      activeRenderer = new Map2DRenderer({
        container: canvasContainer!,
        floor: MAP_FLOORS[currentFloorId],
        selectedRoomId,
        onRoomSelect: (room: Room) => {
          if (room.id === "campus_main_building") {
            switchToFloor("f1", true);
            return;
          }
          activeRenderer?.focusRoom(room.id, true);
          showRoomDetails(room);
          updateUrl(room.id, false);
        }
      });
    }

    // Focus initial room if present
    if (selectedRoomId) {
      const room = MAP_FLOORS[currentFloorId].rooms.find(r => r.id === selectedRoomId);
      if (room) {
        activeRenderer.focusRoom(selectedRoomId, false);
        showRoomDetails(room);
      }
    }
  }

  // Initial renderer launch
  initRenderer(initialRoomId);

  // Mode Toggle Events (2D Vector vs 3D Isometric)
  document.getElementById("mapModeToggle")?.addEventListener("click", e => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".map-mode-btn");
    if (!btn) return;
    const targetMode = btn.getAttribute("data-mode") as MapMode;
    if (!targetMode || targetMode === currentMode) return;

    currentMode = targetMode;

    // Update active class on toggle buttons
    document.querySelectorAll(".map-mode-btn").forEach(b => {
      b.classList.toggle("active", b.getAttribute("data-mode") === targetMode);
    });

    const currentSelected = activeRenderer?.getSelectedRoomId() || null;
    initRenderer(currentSelected);
    updateUrl(currentSelected, true);
  });

  // Floor Selector Events
  document.getElementById("mapFloorSelector")?.addEventListener("click", e => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".map-floor-btn");
    if (!btn) return;
    const targetFloor = btn.getAttribute("data-floor") as FloorId;
    if (targetFloor && targetFloor in MAP_FLOORS && targetFloor !== currentFloorId) {
      switchToFloor(targetFloor, true);
    }
  });

  // HUD Zoom and Reset Controls
  document.getElementById("mapZoomInBtn")?.addEventListener("click", () => {
    activeRenderer?.zoomIn();
  });
  document.getElementById("mapZoomOutBtn")?.addEventListener("click", () => {
    activeRenderer?.zoomOut();
  });
  document.getElementById("mapResetBtn")?.addEventListener("click", () => {
    activeRenderer?.resetView(true);
  });

  // =========================================================================
  // Search Autocomplete Logic
  // =========================================================================
  let searchResults: SearchResult[] = [];
  let highlightedIndex = -1;

  function renderSearchDropdown() {
    if (!searchDropdown) return;
    if (searchResults.length === 0) {
      searchDropdown.innerHTML = `<div class="map-search-empty">Tidak ada ruangan atau klub yang cocok.</div>`;
      searchDropdown.classList.add("open");
      return;
    }

    searchDropdown.innerHTML = searchResults
      .map((res, idx) => {
        return `
          <div
            class="map-search-item ${idx === highlightedIndex ? 'highlighted' : ''}"
            data-index="${idx}"
            data-room-id="${res.room.id}"
            data-floor-id="${res.floorId}"
            role="option"
          >
            <div class="map-search-item-header">
              <span class="map-search-item-name">${res.room.name}</span>
              <span class="map-search-item-floor">${res.floorId.toUpperCase()}</span>
            </div>
            <div class="map-search-item-meta">
              <span>${res.categoryLabel}</span>
              ${res.ekskulName ? ` • <span style="color:var(--rose-light);">Klub: ${res.ekskulName}</span>` : ""}
            </div>
          </div>
        `;
      })
      .join("");
    searchDropdown.classList.add("open");
  }

  function closeSearchDropdown() {
    if (searchDropdown) {
      searchDropdown.classList.remove("open");
      searchDropdown.innerHTML = "";
    }
    highlightedIndex = -1;
  }

  function handleSelectSearchItem(index: number) {
    const item = searchResults[index];
    if (!item) return;

    if (searchInput) {
      searchInput.value = item.room.name;
    }
    closeSearchDropdown();
    selectAndFocusRoom(item.room, item.floorId);
  }

  searchInput?.addEventListener("input", () => {
    const q = searchInput.value.trim();
    if (searchClearBtn) {
      searchClearBtn.style.display = q ? "block" : "none";
    }

    if (!q) {
      closeSearchDropdown();
      return;
    }

    searchResults = searchSchoolMap(q, 8);
    highlightedIndex = searchResults.length > 0 ? 0 : -1;
    renderSearchDropdown();
  });

  searchClearBtn?.addEventListener("click", () => {
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    if (searchClearBtn) searchClearBtn.style.display = "none";
    closeSearchDropdown();
  });

  // Keyboard navigation within search input
  searchInput?.addEventListener("keydown", e => {
    if (!searchDropdown?.classList.contains("open")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchResults.length > 0) {
        highlightedIndex = (highlightedIndex + 1) % searchResults.length;
        renderSearchDropdown();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchResults.length > 0) {
        highlightedIndex = (highlightedIndex - 1 + searchResults.length) % searchResults.length;
        renderSearchDropdown();
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectSearchItem(highlightedIndex);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeSearchDropdown();
      searchInput.blur();
    }
  });

  // Search dropdown item click delegation
  searchDropdown?.addEventListener("click", e => {
    const targetItem = (e.target as HTMLElement).closest<HTMLElement>(".map-search-item");
    if (!targetItem) return;
    const idx = parseInt(targetItem.getAttribute("data-index") || "0", 10);
    handleSelectSearchItem(idx);
  });

  // Close dropdown on outside click
  document.addEventListener("click", e => {
    const searchContainer = document.getElementById("mapSearchContainer");
    if (searchContainer && !searchContainer.contains(e.target as Node)) {
      closeSearchDropdown();
    }
  });

  // Global hotkey: press '/' to focus search input, press 'Escape' to close drawer/search
  window.addEventListener("keydown", e => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput?.focus();
      searchInput?.select();
    } else if (e.key === "Escape") {
      closeSearchDropdown();
      if (roomPanel && roomPanel.style.display !== "none") {
        roomPanel.style.display = "none";
        activeRenderer?.selectRoom(null);
        updateUrl(null, false);
      }
    }
  });
}
