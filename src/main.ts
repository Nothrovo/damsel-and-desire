import { router } from "./router/router";
import { authStore } from "./store/authStore";
import { renderNavbar, attachNavbarEvents } from "./components/Navbar";
import { diceRollerModal } from "./components/DiceRollerModal";
import { savingsModal } from "./components/SavingsModal";
import { baitoModal } from "./components/BaitoModal";
import { backstoryModal } from "./components/BackstoryModal";

// Views
import { renderLandingView } from "./views/LandingView";
import { renderLoginView } from "./views/LoginView";
import { renderCampaignsView } from "./views/CampaignsView";
import { renderCampaignDetailView } from "./views/CampaignDetailView";
import { renderBuilderWizardView } from "./views/BuilderWizardView";
import { renderCharacterSheetView } from "./views/CharacterSheetView";
import { renderDmDashboardView } from "./views/DmDashboardView";
import { renderCompendiumView } from "./views/CompendiumView";
import { renderSettingsView } from "./views/SettingsView";
import { renderNotFoundView } from "./views/NotFoundView";

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
    `;
    diceRollerModal.attachEvents();
    savingsModal.attachEvents();
    baitoModal.attachEvents();
    backstoryModal.attachEvents();
  }
}

function initApp() {
  mountGlobalShell();

  // Re-render navbar whenever auth state changes
  authStore.subscribe(() => {
    mountGlobalShell();
  });

  // Register All Routes
  router
    .register("/", renderLandingView)
    .register("/login", renderLoginView)
    .register("/campaigns", renderCampaignsView, { requiresAuth: true })
    .register("/campaigns/:id", renderCampaignDetailView, { requiresAuth: true })
    .register("/characters/new", renderBuilderWizardView)
    .register("/characters/:id", renderCharacterSheetView)
    .register("/dm/:campaignId", renderDmDashboardView, { requiresAuth: true, requiresDm: true })
    .register("/compendium", renderCompendiumView)
    .register("/settings", renderSettingsView, { requiresAuth: true })
    .setNotFound(renderNotFoundView);

  // Initialize Router
  router.init();
}

window.addEventListener("DOMContentLoaded", initApp);
