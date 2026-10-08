import { dmAuthStore } from "../store/dmAuthStore";
import { showToast } from "./Toast";

class DmAuthModal {
  private modalEl: HTMLElement | null = null;
  private onSuccessCallback: (() => void) | null = null;

  render(): string {
    return `
      <div id="dmAuthModal" class="modal-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;backdrop-filter:blur(6px);padding:1rem;">
        <div class="modal-card" style="background:var(--bg-card);border:1px solid var(--rose-primary);box-shadow:0 12px 36px rgba(225,29,72,0.3);border-radius:var(--radius-lg);max-width:440px;width:100%;padding:2rem;position:relative;">
          <button id="closeDmAuthModalBtn" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:var(--text-muted);font-size:1.5rem;cursor:pointer;">&times;</button>
          
          <div style="text-align:center;margin-bottom:1.5rem;">
            <div style="font-size:2.5rem;margin-bottom:0.5rem;">👑</div>
            <h2 style="font-family:var(--font-heading);color:var(--amber-gold);margin:0 0 0.5rem 0;font-size:1.4rem;">
              Otoritas Game Master (DM)
            </h2>
            <p style="color:var(--text-muted);font-size:0.85rem;margin:0;">
              Masukkan kata sandi master DM untuk membuka kontrol penyingkapan rahasia karakter (Codex) dan catatan tersembunyi.
            </p>
          </div>

          <form id="dmAuthForm" style="display:flex;flex-direction:column;gap:1.25rem;">
            <div>
              <label for="dmPasswordInput" style="display:block;font-size:0.85rem;color:var(--text-dim);margin-bottom:0.5rem;font-weight:600;">
                Kata Sandi Master DM
              </label>
              <input
                type="password"
                id="dmPasswordInput"
                placeholder="Masukkan kata sandi DM..."
                required
                autocomplete="current-password"
                style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:0.75rem 1rem;color:var(--text-main);font-size:1rem;outline:none;transition:border-color 0.2s;"
              />
              <span id="dmAuthErrorMsg" style="display:none;color:var(--rose-primary);font-size:0.8rem;margin-top:0.4rem;"></span>
            </div>

            <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:0.5rem;">
              <button type="button" id="cancelDmAuthBtn" class="btn btn-secondary" style="padding:0.6rem 1.25rem;">
                Batal
              </button>
              <button type="submit" id="submitDmAuthBtn" class="btn btn-primary" style="padding:0.6rem 1.5rem;background:var(--rose-primary);border-color:var(--rose-primary);display:flex;align-items:center;gap:6px;">
                <span>Masuk Mode DM</span>
              </button>
            </div>
          </form>

          <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border-subtle);text-align:center;">
            <p style="font-size:0.75rem;color:var(--text-muted);margin:0;">
              Dilindungi oleh server Supabase & pgcrypto (Batas 5 kali percobaan sebelum penguncian sementara).
            </p>
          </div>
        </div>
      </div>
    `;
  }

  attachEvents() {
    this.modalEl = document.getElementById("dmAuthModal");
    const closeBtn = document.getElementById("closeDmAuthModalBtn");
    const cancelBtn = document.getElementById("cancelDmAuthBtn");
    const form = document.getElementById("dmAuthForm");

    closeBtn?.addEventListener("click", () => this.hide());
    cancelBtn?.addEventListener("click", () => this.hide());
    this.modalEl?.addEventListener("click", (e) => {
      if (e.target === this.modalEl) this.hide();
    });

    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });
  }

  public open(onSuccess?: () => void) {
    this.onSuccessCallback = onSuccess || null;
    if (!this.modalEl) this.modalEl = document.getElementById("dmAuthModal");
    if (!this.modalEl) return;

    const input = document.getElementById("dmPasswordInput") as HTMLInputElement;
    const errorEl = document.getElementById("dmAuthErrorMsg");
    if (input) input.value = "";
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }

    this.modalEl.style.display = "flex";
    setTimeout(() => input?.focus(), 100);
  }

  public hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private async handleLogin() {
    const input = document.getElementById("dmPasswordInput") as HTMLInputElement;
    const submitBtn = document.getElementById("submitDmAuthBtn") as HTMLButtonElement;
    const errorEl = document.getElementById("dmAuthErrorMsg");

    const pass = input?.value || "";
    if (!pass) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = "Memverifikasi...";
    }

    try {
      const res = await dmAuthStore.login(pass);
      if (res.success) {
        showToast("👑 Berhasil masuk sebagai Game Master (Mode DM Aktif)!", "success");
        this.hide();
        if (this.onSuccessCallback) {
          this.onSuccessCallback();
        } else {
          window.location.reload();
        }
      } else {
        if (errorEl) {
          errorEl.textContent = res.error || "Kata sandi salah.";
          errorEl.style.display = "block";
        }
        showToast(res.error || "Gagal masuk mode DM", "error");
      }
    } catch (e: any) {
      if (errorEl) {
        errorEl.textContent = e.message || "Terjadi kesalahan saat memverifikasi.";
        errorEl.style.display = "block";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = "Masuk Mode DM";
      }
    }
  }
}

export const dmAuthModal = new DmAuthModal();
