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
            Karakter Saya
          </a>
          <a href="/campaigns" class="nav-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
            Campaigns
          </a>
          <a href="/compendium" class="nav-btn">
            <svg viewBox="0 0 20 20" fill="currentColor" class="nav-icon"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/></svg>
            Compendium
          </a>
          <button class="nav-btn nav-btn-dice" id="globalDiceRollBtn">
            <span class="dice-badge">d20</span>
            Lempar Dadu
          </button>
          <a href="/characters/new" class="nav-btn nav-btn-primary">
            + Buat Karakter
          </a>

          ${isAuth ? `
            <div class="nav-user-menu" style="display:flex;align-items:center;gap:8px;margin-left:8px;">
              <a href="/settings" title="Pengaturan Profil" style="display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--text-main);">
                <img src="${avatarUrl}" alt="Avatar" style="width:28px;height:28px;border-radius:50%;border:1px solid var(--border-subtle);object-fit:cover;">
                <span style="font-size:0.85rem;font-weight:600;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${displayName}</span>
              </a>
              <button class="btn btn-xs btn-secondary" id="navLogoutBtn" title="Keluar">Logout</button>
            </div>
          ` : `
            <a href="/login" class="nav-btn" style="border:1px solid var(--border-subtle);background:var(--bg-surface);">
              Masuk / Daftar
            </a>
          `}
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
