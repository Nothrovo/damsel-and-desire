import { signInWithOtp, signInWithOAuth } from "../api/auth";
import { showToast } from "../components/Toast";
import { router } from "../router/router";

export function renderLoginView(): void {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const redirectTarget = urlParams.get("redirect") || "/";

  appContainer.innerHTML = `
    <section class="view-section active" style="min-height:75vh;display:flex;align-items:center;justify-content:center;padding:2rem;">
      <div class="modal-card" style="max-width:440px;width:100%;box-shadow:var(--shadow-lg);border:1px solid var(--border-card);">
        <div class="modal-header" style="text-align:center;display:block;">
          <div class="brand-crest" style="margin:0 auto 12px auto;width:48px;height:48px;">
            <svg viewBox="0 0 24 24" class="crest-icon" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 style="font-family:var(--font-heading);margin-bottom:4px;">Masuk ke Akun Anda</h2>
          <p style="font-size:0.85rem;color:var(--text-muted);">Simpan karakter, sinkronisasi campaign multi-perangkat, dan jelajahi kisah SMA-mu.</p>
        </div>

        <div class="modal-body" style="padding-top:1.5rem;">
          <button class="btn btn-secondary" id="btnLoginGoogle" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:1.5rem;padding:0.75rem;">
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.8 5 12 5z"/><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"/><path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 11.5 0 14s.6 4.8 1.6 6.8l3.7-6.1z"/><path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.4-6.7-5.3L1.6 16c1.9 3.8 5.8 7 10.4 7z"/></svg>
            Masuk dengan Google
          </button>

          <div style="display:flex;align-items:center;margin-bottom:1.5rem;">
            <div style="flex:1;height:1px;background:var(--border-subtle);"></div>
            <span style="padding:0 12px;font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;">atau email magic link</span>
            <div style="flex:1;height:1px;background:var(--border-subtle);"></div>
          </div>

          <form id="magicLinkForm">
            <div class="form-group" style="margin-bottom:1.2rem;">
              <label for="inputLoginEmail">Alamat Email:</label>
              <input type="email" id="inputLoginEmail" class="input-text" placeholder="nama@email.com" required style="width:100%;">
            </div>
            <button type="submit" class="btn btn-primary" id="btnSubmitMagicLink" style="width:100%;padding:0.75rem;">
              ✉️ Kirim Tautan Masuk (Magic Link)
            </button>
          </form>
        </div>

        <div class="modal-footer" style="justify-content:center;border-top:1px solid var(--border-subtle);padding-top:1rem;">
          <a href="/" style="font-size:0.85rem;color:var(--text-muted);text-decoration:none;">← Kembali ke Beranda</a>
        </div>
      </div>
    </section>
  `;

  document.getElementById("btnLoginGoogle")?.addEventListener("click", async () => {
    try {
      await signInWithOAuth("google");
    } catch (err: any) {
      showToast(`Gagal login via Google: ${err.message}`, "error");
    }
  });

  document.getElementById("magicLinkForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("inputLoginEmail") as HTMLInputElement;
    const email = emailInput?.value.trim();
    if (!email) return;

    const submitBtn = document.getElementById("btnSubmitMagicLink") as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim tautan...";
    }

    try {
      await signInWithOtp(email);
      showToast("Tautan login terkirim! Silakan periksa inbox email Anda.", "success", 6000);
      emailInput.value = "";
    } catch (err: any) {
      showToast(`Gagal mengirim Magic Link: ${err.message}`, "error");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = "✉️ Kirim Tautan Masuk (Magic Link)";
      }
    }
  });
}
