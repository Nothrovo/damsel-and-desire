import { router } from "./router/router";
import { renderNavbar, attachNavbarEvents, updateNavbarActive } from "./components/Navbar";
import { diceRollerModal } from "./components/DiceRollerModal";
import { savingsModal } from "./components/SavingsModal";
import { baitoModal } from "./components/BaitoModal";
import { backstoryModal } from "./components/BackstoryModal";
import { itemDetailModal } from "./components/ItemDetailModal";
import { addItemModal } from "./components/AddItemModal";
import { slideOverDrawer } from "./components/SlideOverDrawer";
import { quickVitalsPopover } from "./components/QuickVitalsPopover";

// Views
import { renderLandingView } from "./views/LandingView";
import { renderBuilderWizardView } from "./views/BuilderWizardView";
import { renderCharacterSheetView } from "./views/CharacterSheetView";
import { renderCompendiumView } from "./views/CompendiumView";
import { renderHandbookView } from "./views/HandbookView";
import { renderSettingsView } from "./views/SettingsView";
import { renderMapView } from "./views/MapView";
import { renderCalendarView } from "./views/CalendarView";
import { renderNotFoundView } from "./views/NotFoundView";
import { renderCodexCatalogView } from "./views/CodexCatalogView";
import { renderCodexCategoryView } from "./views/CodexCategoryView";
import { renderCodexDetailView } from "./views/CodexDetailView";
import { dmAuthModal } from "./components/DmAuthModal";
import { dmRevealHistoryModal } from "./components/DmRevealHistoryModal";
import { codexCharacterEditorModal } from "./components/CodexCharacterEditorModal";
import { dmAuthStore } from "./store/dmAuthStore";

function mountGlobalShell() {
  // 1. Mount or update Navbar
  let navContainer = document.getElementById("navbarContainer");
  if (!navContainer) {
    navContainer = document.createElement("div");
    navContainer.id = "navbarContainer";
    document.body.prepend(navContainer);
  }
  navContainer.innerHTML = renderNavbar();
  attachNavbarEvents();

  // 2. Mount Modals Container
  let modalsContainer = document.getElementById("globalModalsContainer");
  if (!modalsContainer) {
    modalsContainer = document.createElement("div");
    modalsContainer.id = "globalModalsContainer";
    document.body.appendChild(modalsContainer);
    modalsContainer.innerHTML = `
      ${diceRollerModal.render()}
      ${savingsModal.render()}
      ${baitoModal.render()}
      ${backstoryModal.render()}
      ${itemDetailModal.render()}
      ${addItemModal.render()}
      ${dmAuthModal.render()}
      ${dmRevealHistoryModal.render()}
      ${codexCharacterEditorModal.render()}
      ${slideOverDrawer.render()}
      ${quickVitalsPopover.render()}
    `;
    diceRollerModal.attachEvents();
    savingsModal.attachEvents();
    baitoModal.attachEvents();
    backstoryModal.attachEvents();
    itemDetailModal.attachEvents();
    addItemModal.attachEvents();
    dmAuthModal.attachEvents();
    dmRevealHistoryModal.attachEvents();
    codexCharacterEditorModal.attachEvents();
    slideOverDrawer.attachEvents();
    quickVitalsPopover.attachEvents();
  }
}

function initApp() {
  mountGlobalShell();

  // Re-render navbar saat DM mode berubah
  dmAuthStore.subscribe(() => {
    mountGlobalShell();
  });

  // Register All Routes — semua terbuka untuk player tanpa login
  router
    .register("/", renderLandingView)
    .register("/roster", renderLandingView)
    .register("/characters/new", renderBuilderWizardView)
    .register("/characters/:id/edit", renderBuilderWizardView)
    .register("/characters/:id", renderCharacterSheetView)
    .register("/codex", renderCodexCatalogView)
    .register("/codex/:category", renderCodexCategoryView)
    .register("/codex/c/:id", renderCodexDetailView)
    .register("/compendium", renderCompendiumView)
    .register("/handbook", renderHandbookView)
    .register("/map", renderMapView)
    .register("/calendar", renderCalendarView)
    .register("/settings", renderSettingsView)
    .setNotFound(renderNotFoundView);

  // Update navbar active state on route changes
  router.onRouteChange((path) => {
    updateNavbarActive(path);
  });

  // Initialize Router
  router.init();
}

window.addEventListener("DOMContentLoaded", initApp);
