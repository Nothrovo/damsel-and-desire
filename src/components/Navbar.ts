import { authStore } from "../store/authStore";
import { signOut } from "../api/auth";
import { router } from "../router/router";
import { setMobileNavigationOpen } from "./mobileNavigation";

function getActivePath(): string {
  const path = window.location.pathname;
  if (path.includes("/campaigns")) return "/campaigns";
  if (path.includes("/codex")) return "/codex";
  if (path.includes("/compendium")) return "/compendium";
  if (path.includes("/handbook")) return "/handbook";
  if (path.includes("/map")) return "/map";
  if (path.includes("/calendar")) return "/calendar";
  if (path.includes("/characters/new")) return "/characters/new";
  if (path.includes("/characters/")) return "/";
  return "/";
}

export function renderNavbar(): string {
  const isAuth = authStore.isAuthenticated();
  const profile = authStore.profile;
  const displayName = profile?.display_name || authStore.user?.email || "Akun Saya";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`;
  const activePath = getActivePath();

  return `
    <header class="global-navbar">
      <div class="nav-container">
        <a href="/" class="nav-brand" id="navBrandBtn" aria-label="Damsel & Desire Beranda">
          <div class="brand-crest">
            <svg viewBox="0 0 24 24" class="crest-icon" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="brand-titles">
            <span class="brand-name">DAMSEL &amp; DESIRE</span>
            <span class="brand-sub">Japanese High School Romance TRPG</span>
          </div>
        </a>

        <button class="mobile-nav-toggle" id="mobileNavToggle" type="button" aria-label="Buka navigasi" aria-controls="mainNavLinks" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav-links" id="mainNavLinks">
          <a href="/campaigns" class="nav-link ${activePath === '/campaigns' ? 'active' : ''}" data-nav-path="/campaigns">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" class="nav-icon" aria-hidden="true"><path d="M3 6.5 8 4l8 3 5-2.5v13L16 20l-8-3-5 2.5z"/><path d="M8 4v13m8-10v13"/></svg>
            <span>Campaign</span>
          </a>
          <a href="/" class="nav-link ${activePath === '/' ? 'active' : ''}" data-nav-path="/">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
            <span>Roster</span>
          </a>
          <a href="/codex" class="nav-link ${activePath === '/codex' ? 'active' : ''}" data-nav-path="/codex">
            <svg viewBox="0 0 24 24" fill="currentColor" class="nav-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <span>Kamus</span>
          </a>
          <a href="/compendium" class="nav-link ${activePath === '/compendium' ? 'active' : ''}" data-nav-path="/compendium">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
            <span>Compendium</span>
          </a>
          <a href="/handbook" class="nav-link ${activePath === '/handbook' ? 'active' : ''}" data-nav-path="/handbook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>Handbook</span>
          </a>
          <a href="/map" class="nav-link ${activePath === '/map' ? 'active' : ''}" data-nav-path="/map">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            <span>Peta</span>
          </a>
          <a href="/calendar" class="nav-link ${activePath === '/calendar' ? 'active' : ''}" data-nav-path="/calendar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Kalender</span>
          </a>
        </nav>

        <div class="nav-actions">
          <button class="nav-action-btn nav-btn-dice" id="globalDiceRollBtn" type="button" title="Buka Dice Roller D&D d20">
            <span class="dice-badge">d20</span>
            <span class="dice-label">Lempar Dadu</span>
          </button>
          <a href="/characters/new" class="nav-action-btn nav-btn-create" id="navCreateCharBtn">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:16px;height:16px;"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
            <span>+ Buat Karakter</span>
          </a>
        </div>
      </div>
    </header>
  `;
}

export function updateNavbarActive(currentPath: string) {
  let target = "/";
  if (currentPath.includes("/codex")) target = "/codex";
  else if (currentPath.includes("/compendium")) target = "/compendium";
  else if (currentPath.includes("/handbook")) target = "/handbook";
  else if (currentPath.includes("/map")) target = "/map";
  else if (currentPath.includes("/calendar")) target = "/calendar";
  else if (currentPath === "/" || currentPath.startsWith("/characters/")) target = "/";

  const links = document.querySelectorAll("#mainNavLinks .nav-link");
  links.forEach((link) => {
    const linkPath = link.getAttribute("data-nav-path");
    if (linkPath === target) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

let mobileNavigationLifecycleAttached = false;

export function attachNavbarEvents() {
  const mobileToggle = document.getElementById("mobileNavToggle") as HTMLButtonElement | null;
  const navigation = document.getElementById("mainNavLinks");
  const closeMobileNavigation = () => {
    const currentToggle = document.getElementById("mobileNavToggle") as HTMLButtonElement | null;
    const currentNavigation = document.getElementById("mainNavLinks");
    if (currentToggle && currentNavigation) setMobileNavigationOpen(currentNavigation, currentToggle, false);
  };

  mobileToggle?.addEventListener("click", () => {
    if (navigation) setMobileNavigationOpen(navigation, mobileToggle, mobileToggle.getAttribute("aria-expanded") !== "true");
  });
  navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileNavigation));
  if (!mobileNavigationLifecycleAttached) {
    mobileNavigationLifecycleAttached = true;
    document.addEventListener("keydown", (event) => {
      const currentToggle = document.getElementById("mobileNavToggle") as HTMLButtonElement | null;
      if (event.key === "Escape" && currentToggle?.getAttribute("aria-expanded") === "true") {
        closeMobileNavigation();
        currentToggle.focus();
      }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) closeMobileNavigation();
    });
  }

  document.getElementById("navBrandBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    router.navigate("/");
  });
  document.getElementById("navLogoutBtn")?.addEventListener("click", async () => {
    await signOut();
    router.navigate("/");
  });
}
