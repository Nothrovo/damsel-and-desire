import { MAP_FLOORS } from "../map/mapData";
import { Map2DRenderer } from "../map/Map2DRenderer";
import type { FloorId, Room } from "../map/types";
import { getCategoryColor } from "../map/mapUtils";
import { router } from "../router/router";

let activeRenderer: Map2DRenderer | null = null;

export async function renderMapView(params: Record<string, string>): Promise<void> {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  // Clean up any existing renderer
  if (activeRenderer) {
    activeRenderer.destroy();
    activeRenderer = null;
  }

  // Parse initial parameters
  let currentFloorId: FloorId =
    params.floor && params.floor in MAP_FLOORS ? (params.floor as FloorId) : "f1";
  const initialRoomId = params.room || null;
  let debugOverlay = params.debugOverlay === "1" || params.debugOverlay === "true";
  let debugOpacity = 0.45;

  appContainer.innerHTML = `
    <div class="map-view-container">
      <!-- Toolbar -->
      <header class="map-toolbar">
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div class="map-floor-selector" id="mapFloorSelector">
            <button class="map-floor-btn ${currentFloorId === 'roof' ? 'active' : ''}" data-floor="roof">Roof</button>
            <button class="map-floor-btn ${currentFloorId === 'f3' ? 'active' : ''}" data-floor="f3">3F</button>
            <button class="map-floor-btn ${currentFloorId === 'f2' ? 'active' : ''}" data-floor="f2">2F</button>
            <button class="map-floor-btn ${currentFloorId === 'f1' ? 'active' : ''}" data-floor="f1">1F</button>
            <button class="map-floor-btn ${currentFloorId === 'campus' ? 'active' : ''}" data-floor="campus">Campus</button>
          </div>

          <div class="map-mode-toggle">
            <button class="map-mode-btn active" data-mode="2d">2D Vector (SVG)</button>
            <button class="map-mode-btn" data-mode="3d" title="Mode 3D Three.js akan aktif di Fase C" style="opacity:0.5;cursor:not-allowed;">3D (Fase C)</button>
          </div>
        </div>

        <!-- Debug Overlay Controls -->
        <div class="map-debug-bar-inline" style="display:flex;align-items:center;gap:10px;">
          <label style="display:flex;align-items:center;gap:6px;font-size:0.8rem;color:var(--text-dim);cursor:pointer;user-select:none;">
            <input type="checkbox" id="mapDebugToggle" ${debugOverlay ? 'checked' : ''} style="cursor:pointer;accent-color:var(--rose-primary);">
            Overlay Referensi
          </label>
          <input
            type="range"
            id="mapDebugOpacitySlider"
            min="0.1"
            max="1"
            step="0.05"
            value="${debugOpacity}"
            style="width:70px;accent-color:var(--rose-primary);display:${debugOverlay ? 'inline-block' : 'none'};"
            title="Opasitas Overlay"
          />
        </div>
      </header>

      <!-- Map Canvas Area -->
      <div class="map-canvas-area" id="mapCanvasContainer"></div>

      <!-- Floating HUD Controls -->
      <div class="map-floating-controls">
        <button class="map-hud-btn" id="mapZoomInBtn" title="Perbesar (+)">+</button>
        <button class="map-hud-btn" id="mapZoomOutBtn" title="Perkecil (−)">−</button>
        <button class="map-hud-btn" id="mapResetBtn" title="Reset Tampilan (⟲)">⟲</button>
      </div>

      <!-- Room Detail Panel -->
      <div id="mapRoomPanel" class="map-room-panel" style="display:none;"></div>
    </div>
  `;

  const canvasContainer = document.getElementById("mapCanvasContainer");
  const roomPanel = document.getElementById("mapRoomPanel");
  if (!canvasContainer) return;

  function updateUrl() {
    const queryParts: string[] = [`floor=${currentFloorId}`];
    if (debugOverlay) queryParts.push("debugOverlay=1");
    if (activeRenderer && (activeRenderer as any).selectedRoomId) {
      queryParts.push(`room=${(activeRenderer as any).selectedRoomId}`);
    }
    const newUrl = `/map?${queryParts.join("&")}`;
    router.navigate(newUrl, true);
  }

  function showRoomDetails(room: Room) {
    if (!roomPanel) return;
    const colors = getCategoryColor(room.category);
    const floorLabel = MAP_FLOORS[room.floorId].label;

    const isCampusMainBuilding = room.id === "campus_main_building";

    roomPanel.innerHTML = `
      <div class="map-room-panel-header">
        <h3 class="map-room-panel-title">${room.name}</h3>
        <button class="map-room-panel-close" id="mapClosePanelBtn" aria-label="Tutup Panel">✕</button>
      </div>
      <div>
        <span
          class="map-room-category-badge"
          style="background-color:${colors.fill};color:${colors.stroke};border:1px solid ${colors.stroke};"
        >
          ${room.category} • ${floorLabel}
        </span>
      </div>
      <p class="map-room-desc">${room.description || "Tidak ada deskripsi tambahan untuk ruangan ini."}</p>
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
      </div>
    `;
    roomPanel.style.display = "block";

    document.getElementById("mapClosePanelBtn")?.addEventListener("click", () => {
      roomPanel.style.display = "none";
      if (activeRenderer) activeRenderer.selectRoom(null);
    });

    if (isCampusMainBuilding) {
      document.getElementById("mapBtnEnter1F")?.addEventListener("click", () => {
        switchToFloor("f1");
      });
    }
  }

  function switchToFloor(targetFloorId: FloorId) {
    currentFloorId = targetFloorId;
    if (activeRenderer) {
      activeRenderer.setFloor(MAP_FLOORS[targetFloorId]);
      activeRenderer.selectRoom(null);
    }
    if (roomPanel) roomPanel.style.display = "none";

    // Update active floor button
    document.querySelectorAll(".map-floor-btn").forEach(btn => {
      if (btn.getAttribute("data-floor") === targetFloorId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    updateUrl();
  }

  // Initialize Map2DRenderer
  activeRenderer = new Map2DRenderer({
    container: canvasContainer,
    floor: MAP_FLOORS[currentFloorId],
    selectedRoomId: initialRoomId,
    debugOverlay,
    debugOpacity,
    onRoomSelect: (room: Room) => {
      // Requirement: Klik Main Building di peta Campus: arahkan ke 1F
      if (room.id === "campus_main_building") {
        switchToFloor("f1");
        return;
      }
      showRoomDetails(room);
      updateUrl();
    }
  });

  // Focus room if provided initially
  if (initialRoomId) {
    const room = MAP_FLOORS[currentFloorId].rooms.find(r => r.id === initialRoomId);
    if (room) {
      activeRenderer.focusRoom(initialRoomId);
      showRoomDetails(room);
    }
  }

  // Attach Floor Selector Events
  document.getElementById("mapFloorSelector")?.addEventListener("click", e => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(".map-floor-btn");
    if (!btn) return;
    const targetFloor = btn.getAttribute("data-floor") as FloorId;
    if (targetFloor && targetFloor in MAP_FLOORS && targetFloor !== currentFloorId) {
      switchToFloor(targetFloor);
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
    activeRenderer?.resetView();
  });

  // Debug Overlay Controls
  const debugToggle = document.getElementById("mapDebugToggle") as HTMLInputElement | null;
  const opacitySlider = document.getElementById("mapDebugOpacitySlider") as HTMLInputElement | null;

  debugToggle?.addEventListener("change", () => {
    debugOverlay = !!debugToggle.checked;
    if (opacitySlider) {
      opacitySlider.style.display = debugOverlay ? "inline-block" : "none";
    }
    activeRenderer?.setDebugOverlay(debugOverlay, debugOpacity);
    updateUrl();
  });

  opacitySlider?.addEventListener("input", () => {
    debugOpacity = parseFloat(opacitySlider.value) || 0.45;
    activeRenderer?.setDebugOverlay(debugOverlay, debugOpacity);
  });
}
