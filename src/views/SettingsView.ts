import { authStore } from "../store/authStore";
import { updateProfile } from "../api/auth";
import { uploadAvatar } from "../api/storage";
import { showToast } from "../components/Toast";

export function renderSettingsView(): void {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  const profile = authStore.profile;
  const user = authStore.user;
  const displayName = profile?.display_name || user?.email || "";
  const avatarUrl = profile?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${displayName}`;

  appContainer.innerHTML = `
    <section class="view-section active" style="max-width:600px;margin:2rem auto;padding:0 1.5rem;">
      <div class="modal-card" style="box-shadow:var(--shadow-lg);border:1px solid var(--border-card);">
        <div class="modal-header">
          <h2 style="font-family:var(--font-heading);margin:0;font-size:1.4rem;">⚙️ Pengaturan Profil Pengguna</h2>
        </div>

        <div class="modal-body">
          <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:1.5rem;">
            <img src="${avatarUrl}" alt="Avatar" id="settingsAvatarPreview" style="width:96px;height:96px;border-radius:50%;object-fit:cover;border:3px solid var(--rose-primary);margin-bottom:12px;background:var(--bg-surface);">
            
            <button class="btn btn-xs btn-secondary" id="btnUploadAvatarTrigger">
              📷 Unggah Foto Baru (Storage Bucket)
            </button>
            <input type="file" id="avatarFileInput" accept="image/png,image/jpeg,image/webp" style="display:none;">
            <small style="color:var(--text-muted);margin-top:6px;font-size:0.75rem;">Maksimal ukuran 2MB (JPG, PNG, WEBP)</small>
          </div>

          <form id="profileForm">
            <div class="form-group" style="margin-bottom:1rem;">
              <label for="inputProfileEmail">Email Terdaftar:</label>
              <input type="text" id="inputProfileEmail" class="input-text" value="${user?.email || '-'}" disabled style="opacity:0.7;">
            </div>

            <div class="form-group" style="margin-bottom:1.5rem;">
              <label for="inputProfileName">Nama Tampilan (Display Name):</label>
              <input type="text" id="inputProfileName" class="input-text" value="${displayName}" required>
            </div>

            <button type="submit" class="btn btn-primary" id="btnSaveProfile" style="width:100%;">
              Simpan Perubahan
            </button>
          </form>
        </div>
      </div>
    </section>
  `;

  attachSettingsEvents();
}

function attachSettingsEvents() {
  const fileInput = document.getElementById("avatarFileInput") as HTMLInputElement;
  document.getElementById("btnUploadAvatarTrigger")?.addEventListener("click", () => fileInput?.click());

  let uploadedAvatarUrl: string | null = null;

  fileInput?.addEventListener("change", async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !authStore.user) return;

    try {
      showToast("Mengunggah foto ke storage cloud...", "info");
      const url = await uploadAvatar(file, authStore.user.id);
      uploadedAvatarUrl = url;

      const preview = document.getElementById("settingsAvatarPreview") as HTMLImageElement;
      if (preview) preview.src = url;

      showToast("Foto berhasil diunggah! Klik Simpan Perubahan untuk mengonfirmasi.", "success");
    } catch (err: any) {
      showToast(`Gagal mengunggah foto: ${err.message}`, "error");
    }
  });

  document.getElementById("profileForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("inputProfileName") as HTMLInputElement;
    const name = nameInput?.value.trim();

    if (!name) {
      showToast("Nama tampilan tidak boleh kosong.", "warning");
      return;
    }

    try {
      const updates: any = { display_name: name };
      if (uploadedAvatarUrl) updates.avatar_url = uploadedAvatarUrl;

      const updated = await updateProfile(updates);
      authStore.profile = updated;
      showToast("✓ Profil berhasil diperbarui!", "success");
    } catch (err: any) {
      showToast(`Gagal menyimpan profil: ${err.message}`, "error");
    }
  });
}
