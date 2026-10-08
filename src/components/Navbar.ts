import { authStore } from "../store/authStore";
import { signOut } from "../api/auth";
import { router } from "../router/router";

export function renderNavbar(): string {
  const isAuth = authStore.isAuthenticated();
  const profile = authStore.profile;
  const displayName = profile?.display_name || authStore.user?.email || "Akun Saya";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`;

  return `
    <header class="global-navbar">
      <div class="nav-container">
        <div class="nav-brand" style="cursor:pointer;" id="navBrandBtn">
          <div class="brand-crest">
            <svg viewBox="0 0 24 24" class="crest-icon" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div class="brand-titles">
            <span class="brand-name">DAMSEL & DESIRE</span>
            <span class="brand-sub">Japanese High School Romance TRPG</span>
          </div>
        </div>

        <nav class="nav-links">
          <a href="/" class="nav-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
            Roster Karakter
          </a>
          <a href="/codex" class="nav-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" class="nav-icon" style="width:16px;height:16px;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            Kamus Karakter
          </a>
          <a href="/compendium" class="nav-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
            Compendium
          </a>
          <a href="/handbook" class="nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon" style="width:16px;height:16px;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            Handbook
          </a>
          <a href="/map" class="nav-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon" style="width:16px;height:16px;"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
            Peta
          </a>
          <button class="nav-btn nav-btn-dice" id="globalDiceRollBtn">
            <span class="dice-badge">d20</span>
            Lempar Dadu
          </button>
          <a href="/characters/new" class="nav-btn nav-btn-primary">
            + Buat Karakter
          </a>
        </nav>
      </div>
    </header>
  `;
}

export function attachNavbarEvents() {
  document.getElementById("navBrandBtn")?.addEventListener("click", () => router.navigate("/"));
  document.getElementById("navLogoutBtn")?.addEventListener("click", async () => {
    await signOut();
    router.navigate("/");
  });
}
