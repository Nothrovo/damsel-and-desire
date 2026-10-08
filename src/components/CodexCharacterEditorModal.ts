import {
  DEFAULT_CODEX_CATEGORIES,
  dmUpsertCharacter,
  dmDeleteCharacter,
  dmUploadCharacterImage
} from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { showToast } from "./Toast";

class CodexCharacterEditorModal {
  private modalEl: HTMLElement | null = null;
  private isEditMode: boolean = false;
  private editingCharId: string | null = null;
  private onSavedCallback: ((slug: string) => void) | null = null;

  public render(): string {
    const categoryOptions = DEFAULT_CODEX_CATEGORIES.map(
      (cat) => `<option value="${cat.id}">${cat.name}</option>`
    ).join("");

    return `
      <div id="codexCharEditorModal" class="modal-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:10000;align-items:center;justify-content:center;backdrop-filter:blur(6px);padding:1rem;">
        <div class="modal-card" style="background:var(--bg-card);border:1.5px solid var(--amber-gold);box-shadow:0 16px 48px rgba(0,0,0,0.85);border-radius:var(--radius-lg);max-width:880px;width:100%;max-height:90vh;display:flex;flex-direction:column;position:relative;overflow:hidden;">
          
          <!-- Modal Header -->
          <div style="padding:1.25rem 1.75rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;background:rgba(13,17,26,0.6);">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:1.4rem;">👑</span>
              <div>
                <h2 id="codexEditorTitle" style="font-family:var(--font-heading);color:var(--amber-gold);margin:0;font-size:1.3rem;">
                  Tambah Karakter Baru (Codex Editor)
                </h2>
                <span style="font-size:0.75rem;color:var(--text-muted);">
                  Hanya Game Master dengan sesi aktif yang dapat menambah atau mengubah arsip karakter.
                </span>
              </div>
            </div>
            <button id="closeCodexEditorModalBtn" style="background:none;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
          </div>

          <!-- Editor Tabs Bar -->
          <div style="display:flex;gap:6px;padding:0.75rem 1.75rem;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);overflow-x:auto;">
            <button type="button" class="codex-editor-tab active btn btn-xs" data-etab="tab_meta" style="background:var(--rose-primary);color:#fff;border-color:var(--rose-primary);">
              1. 📋 Metadata & Identitas
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_appearance">
              2. 🎀 Penampilan & Foto
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_tier2">
              3. 🧠 Kepribadian, Latar & Relasi
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_tier3">
              4. 🔒 Pikiran, Rahasia & Catatan DM
            </button>
          </div>

          <!-- Scrollable Form Body -->
          <form id="codexCharEditorForm" style="flex:1;overflow-y:auto;padding:1.5rem 1.75rem;">
            
            <!-- TAB 1: METADATA & IDENTITAS -->
            <div id="etab_tab_meta" class="codex-editor-panel">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Nama Karakter (Wajib) *</label>
                  <input type="text" id="edCharName" required placeholder="Misal: Yamada Hanako (山田 花子)" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Slug ID Unik (Wajib) *</label>
                  <input type="text" id="edCharSlug" required placeholder="Misal: yamada_hanako" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);font-family:monospace;" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Furigana / Cara Baca</label>
                  <input type="text" id="edCharFurigana" placeholder="Misal: やまだ はなこ / Yamada Hanako" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Kategori Direktori</label>
                  <select id="edCharCategory" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);">
                    ${categoryOptions}
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Mode Saat Terkunci</label>
                  <select id="edCharVisMode" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);">
                    <option value="placeholder">Siluet Misterius (Placeholder)</option>
                    <option value="hidden">Disembunyikan Total (Hidden)</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Urutan Tampil (Sort Order)</label>
                  <input type="number" id="edCharSortOrder" value="1" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
                <div style="display:flex;align-items:center;padding-top:1.3rem;">
                  <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;color:var(--rose-light);font-weight:700;">
                    <input type="checkbox" id="edCharIsLoveInterest" style="width:16px;height:16px;accent-color:var(--rose-primary);cursor:pointer;" />
                    <span>♥ Target Asmara (Heroine)</span>
                  </label>
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Tagline / Kutipan Khas Karakter</label>
                <input type="text" id="edCharTagline" placeholder="Misal: Selamat pagi! Jangan lupa jadwal piket kelas hari ini ya!" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(170px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Panggilan (Pisahkan Koma)</label>
                  <input type="text" id="edCharNickname" placeholder="Hanako, Yamada-san" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Kelas & Angkatan</label>
                  <input type="text" id="edCharClassRoom" placeholder="Kelas 1-1" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Ekskul / Bukatsu</label>
                  <input type="text" id="edCharClub" placeholder="photography" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Peran di Sekolah</label>
                  <input type="text" id="edCharRole" placeholder="Murid / Ketua Kelas" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Usia (Tahun)</label>
                  <input type="number" id="edCharAge" value="15" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Ulang Tahun</label>
                  <input type="text" id="edCharBirthday" placeholder="14 April" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Zodiak</label>
                  <input type="text" id="edCharZodiac" placeholder="Aries" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Arketipe / Dere</label>
                  <input type="text" id="edCharArchetype" placeholder="Tsundere" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">MBTI</label>
                  <input type="text" id="edCharMbti" placeholder="ISFP" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">ID Ruang Peta</label>
                  <input type="text" id="edCharHomeRoom" placeholder="f1_class_1_1" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
              </div>

              <!-- 6 Ability Scores -->
              <div style="background:var(--bg-surface);padding:1rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:0.75rem;font-family:var(--font-heading);">Statistik Atribut Karakter (D&D 5e Chassis)</label>
                <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:0.75rem;">
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">PHY</span>
                    <input type="number" id="edStatPhy" value="10" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">INT</span>
                    <input type="number" id="edStatInt" value="10" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">LKS</span>
                    <input type="number" id="edStatLks" value="14" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">MND</span>
                    <input type="number" id="edStatMnd" value="12" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">TLT</span>
                    <input type="number" id="edStatTlt" value="12" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                  <div>
                    <span style="font-size:0.7rem;color:var(--text-muted);display:block;">LCK</span>
                    <input type="number" id="edStatLck" value="10" min="1" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:4px 6px;color:var(--text-main);text-align:center;" />
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 2: PENAMPILAN & FOTO -->
            <div id="etab_tab_appearance" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:160px 1fr;gap:1.5rem;margin-bottom:1.5rem;align-items:start;">
                <div style="background:#0d111a;border:2px solid var(--amber-gold);border-radius:var(--radius-md);aspect-ratio:3/4;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                  <img id="edAvatarPreview" src="https://api.dicebear.com/7.x/adventurer/svg?seed=housen" alt="Preview" style="width:100%;height:100%;object-fit:cover;" />
                </div>
                <div>
                  <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:6px;font-weight:600;">URL Potret / ID Photo Karakter</label>
                  <input type="text" id="edAvatarUrl" placeholder="Tempel URL gambar atau unggah file di bawah..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem 0.8rem;color:var(--text-main);margin-bottom:1rem;" />

                  <div style="background:var(--bg-surface);border:1px dashed var(--border-card);border-radius:var(--radius-md);padding:1rem;">
                    <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:6px;">
                      📤 Unggah File Foto dari Komputer (Otomatis diunggah dengan nama acak aman):
                    </label>
                    <input type="file" id="edAvatarFileInput" accept="image/*" style="font-size:0.8rem;color:var(--text-muted);" />
                    <div id="edUploadStatus" style="font-size:0.75rem;color:var(--amber-gold);margin-top:6px;"></div>
                  </div>
                </div>
              </div>

              <div style="margin-bottom:1rem;">
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:6px;font-weight:600;">Deskripsi Penampilan Fisik (Rambut, Mata, Seragam, Ciri Khas)</label>
                <textarea id="edAppearanceMarkdown" rows="7" placeholder="Tuliskan deskripsi visual karakter..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.75rem;color:var(--text-main);font-family:inherit;line-height:1.5;"></textarea>
              </div>
            </div>

            <!-- TAB 3: KEPRIBADIAN, LATAR BELAKANG & RELASI (TIER 2) -->
            <div id="etab_tab_tier2" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--green-health);margin-bottom:4px;font-weight:600;">💚 Hal yang Disukai (Satu per baris)</label>
                  <textarea id="edLikes" rows="4" placeholder="Kamera analog&#10;Kucing liar&#10;Matcha latte" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">💔 Hal yang Dibenci (Satu per baris)</label>
                  <textarea id="edDislikes" rows="4" placeholder="Keramaian berisik&#10;Orang yang memotret tanpa izin" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">🧠 Detail Kepribadian & Gaya Bicara (Tier 2)</label>
                <textarea id="edPersonalityMarkdown" rows="4" placeholder="Sifat permukaan, kebiasaan, dan gaya bicara..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">📖 Latar Belakang & Keluarga (Tier 2)</label>
                <textarea id="edBackgroundMarkdown" rows="4" placeholder="Sejarah keluarga, masa SMP, dan alasan masuk SMA Housen..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">👥 Jaringan Relasi Karakter (Tier 2)</label>
                <textarea id="edRelationshipsMarkdown" rows="4" placeholder="Hubungan dengan rekan sekelas, sahabat, rival, dan guru..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>
            </div>

            <!-- TAB 4: PIKIRAN, RAHASIA & CATATAN DM (TIER 3 & DM) -->
            <div id="etab_tab_tier3" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">💖 Confession DC (Target Dadu Pernyataan Cinta)</label>
                  <input type="number" id="edConfessionDc" value="17" min="5" max="30" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">♥ Level Heart Awal</label>
                  <input type="number" id="edHeartBase" value="1" min="0" max="5" style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">💭 Pikiran Terdalam, Impian & Ketakutan (Tier 3)</label>
                <textarea id="edMindMarkdown" rows="4" placeholder="Kelemahan emosional, impian masa depan, dan syarat meluluhkan hatinya..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">🔒 Rahasia Besar Karakter (Tier 3)</label>
                <textarea id="edSecretsMarkdown" rows="4" placeholder="Rahasia tersembunyi yang baru terungkap di puncak cerita..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="background:rgba(245,158,11,0.08);border:1px solid var(--amber-gold);border-radius:var(--radius-md);padding:1rem;">
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:4px;font-weight:700;">👑 Catatan Eksklusif DM (TIDAK PERNAH DIKIRIM KE PEMAIN)</label>
                <textarea id="edDmNotes" rows="4" placeholder="Catatan skenario DM, pemicu event rahasia, atau panduan akting..." style="width:100%;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>
            </div>

          </form>

          <!-- Modal Footer Actions -->
          <div style="padding:1rem 1.75rem;border-top:1px solid var(--border-subtle);background:rgba(13,17,26,0.8);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <div>
              <button type="button" id="edDeleteCharBtn" class="btn btn-xs btn-secondary" style="display:none;border-color:var(--rose-primary);color:var(--rose-light);">
                🗑️ Hapus Karakter Ini
              </button>
            </div>
            <div style="display:flex;gap:10px;">
              <button type="button" id="cancelCodexEditorBtn" class="btn btn-secondary btn-sm">
                Batal
              </button>
              <button type="button" id="saveCodexEditorBtn" class="btn btn-primary btn-sm" style="background:var(--amber-gold);border-color:var(--amber-gold);color:#0d111a;font-weight:700;">
                💾 Simpan Karakter ke Database
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
  }

  public attachEvents() {
    this.modalEl = document.getElementById("codexCharEditorModal");

    document.getElementById("closeCodexEditorModalBtn")?.addEventListener("click", () => this.hide());
    document.getElementById("cancelCodexEditorBtn")?.addEventListener("click", () => this.hide());

    // Tab switching inside editor
    const tabBtns = document.querySelectorAll(".codex-editor-tab");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabBtns.forEach((b) => {
          b.classList.remove("active");
          (b as HTMLElement).style.background = "";
          (b as HTMLElement).style.color = "";
          (b as HTMLElement).style.borderColor = "";
        });
        btn.classList.add("active");
        (btn as HTMLElement).style.background = "var(--rose-primary)";
        (btn as HTMLElement).style.color = "#fff";
        (btn as HTMLElement).style.borderColor = "var(--rose-primary)";

        const targetId = btn.getAttribute("data-etab");
        document.querySelectorAll(".codex-editor-panel").forEach((p) => {
          (p as HTMLElement).style.display = "none";
        });
        const targetPanel = document.getElementById(`etab_${targetId}`);
        if (targetPanel) targetPanel.style.display = "block";
      });
    });

    // Auto-slug from name when in create mode
    const nameInput = document.getElementById("edCharName") as HTMLInputElement;
    const slugInput = document.getElementById("edCharSlug") as HTMLInputElement;
    nameInput?.addEventListener("input", () => {
      if (!this.isEditMode && slugInput) {
        const clean = nameInput.value
          .toLowerCase()
          .replace(/\([^)]*\)/g, "")
          .trim()
          .replace(/[^a-z0-9]+/g, "_")
          .replace(/^_+|_+$/g, "");
        slugInput.value = clean;
      }
    });

    // Live Avatar URL preview
    const avatarUrlInput = document.getElementById("edAvatarUrl") as HTMLInputElement;
    const avatarPreview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    avatarUrlInput?.addEventListener("input", () => {
      if (avatarPreview && avatarUrlInput.value.trim()) {
        avatarPreview.src = avatarUrlInput.value.trim();
      }
    });

    // File Upload Handler
    const fileInput = document.getElementById("edAvatarFileInput") as HTMLInputElement;
    fileInput?.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const token = dmAuthStore.getToken();
      if (!token) {
        showToast("Sesi DM tidak ditemukan. Silakan login kembali.", "error");
        return;
      }

      const statusEl = document.getElementById("edUploadStatus");
      if (statusEl) statusEl.textContent = "⏳ Mengunggah & mengamankan foto...";

      const res = await dmUploadCharacterImage(token, file);
      if (res.success && res.url) {
        if (avatarUrlInput) avatarUrlInput.value = res.url;
        if (avatarPreview) avatarPreview.src = res.url;
        if (statusEl) statusEl.textContent = "✓ Foto berhasil diproses dan siap disimpan!";
        showToast("Foto potret berhasil diunggah!", "success");
      } else {
        if (statusEl) statusEl.textContent = `❌ Gagal: ${res.error}`;
        showToast(res.error || "Gagal mengunggah foto", "error");
      }
    });

    // Save Button Handler
    document.getElementById("saveCodexEditorBtn")?.addEventListener("click", () => this.handleSave());

    // Delete Button Handler
    document.getElementById("edDeleteCharBtn")?.addEventListener("click", () => this.handleDelete());
  }

  public openForCreate(defaultCategoryId: string = "class_1_1", onSaved?: (slug: string) => void) {
    if (!this.modalEl) this.modalEl = document.getElementById("codexCharEditorModal");
    if (!this.modalEl) return;

    this.isEditMode = false;
    this.editingCharId = null;
    this.onSavedCallback = onSaved || null;

    const titleEl = document.getElementById("codexEditorTitle");
    if (titleEl) titleEl.textContent = "➕ Tambah Karakter Baru (Codex Editor)";

    const delBtn = document.getElementById("edDeleteCharBtn");
    if (delBtn) delBtn.style.display = "none";

    const form = document.getElementById("codexCharEditorForm") as HTMLFormElement;
    form?.reset();

    this.setVal("edCharCategory", defaultCategoryId);
    this.setVal("edCharVisMode", defaultCategoryId === "love_interest" ? "hidden" : "placeholder");
    (document.getElementById("edCharIsLoveInterest") as HTMLInputElement).checked = defaultCategoryId === "love_interest";
    (document.getElementById("edCharSlug") as HTMLInputElement).readOnly = false;

    const preview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    if (preview) preview.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=housen";

    const statusEl = document.getElementById("edUploadStatus");
    if (statusEl) statusEl.textContent = "";

    this.modalEl.style.display = "flex";
  }

  public openForEdit(char: any, onSaved?: (slug: string) => void) {
    if (!this.modalEl) this.modalEl = document.getElementById("codexCharEditorModal");
    if (!this.modalEl) return;

    this.isEditMode = true;
    this.editingCharId = char.id;
    this.onSavedCallback = onSaved || null;

    const sections: any[] = char.sections || [];
    const getSec = (key: string) => sections.find((s) => s.section_key === key)?.content || {};

    const identity = getSec("identity");
    const appearance = getSec("appearance");
    const personality = getSec("personality");
    const background = getSec("background");
    const relationships = getSec("relationships");
    const mind = getSec("mind");
    const secrets = getSec("secrets");
    const dmNotes = getSec("dm_notes");

    const titleEl = document.getElementById("codexEditorTitle");
    if (titleEl) titleEl.textContent = `✏️ Edit Karakter: ${identity.name || char.name || char.slug}`;

    const delBtn = document.getElementById("edDeleteCharBtn");
    if (delBtn) delBtn.style.display = "inline-flex";

    // Populate Tab 1
    this.setVal("edCharName", identity.name || char.name || "");
    this.setVal("edCharSlug", char.slug || "");
    (document.getElementById("edCharSlug") as HTMLInputElement).readOnly = true;
    this.setVal("edCharFurigana", identity.furigana || char.furigana || "");
    this.setVal("edCharCategory", char.category_id || "class_1_1");
    this.setVal("edCharVisMode", char.visibility_mode || "placeholder");
    this.setVal("edCharSortOrder", String(char.sort_order ?? 1));
    (document.getElementById("edCharIsLoveInterest") as HTMLInputElement).checked = Boolean(char.is_love_interest);

    this.setVal("edCharTagline", identity.tagline || char.tagline || "");
    this.setVal("edCharNickname", (identity.nickname || []).join(", "));
    this.setVal("edCharClassRoom", identity.class_room || "");
    this.setVal("edCharClub", identity.club || "");
    this.setVal("edCharRole", identity.role || "Murid");
    this.setVal("edCharAge", String(identity.age ?? 15));
    this.setVal("edCharBirthday", identity.birthday || "");
    this.setVal("edCharZodiac", identity.zodiac || "");
    this.setVal("edCharArchetype", identity.archetype || "");
    this.setVal("edCharMbti", identity.mbti || "");
    this.setVal("edCharHomeRoom", char.home_room_id || "");

    const stats = identity.stats || {};
    this.setVal("edStatPhy", String(stats.physique ?? 10));
    this.setVal("edStatInt", String(stats.intelligent ?? 10));
    this.setVal("edStatLks", String(stats.looks ?? 14));
    this.setVal("edStatMnd", String(stats.mind ?? 12));
    this.setVal("edStatTlt", String(stats.talent ?? 12));
    this.setVal("edStatLck", String(stats.luck ?? 10));

    // Populate Tab 2
    const avatarUrl = appearance.avatar_url || char.avatar_url || "";
    this.setVal("edAvatarUrl", avatarUrl);
    const preview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    if (preview) {
      preview.src = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.slug}`;
    }
    this.setVal("edAppearanceMarkdown", appearance.raw_markdown || "");

    // Populate Tab 3
    this.setVal("edLikes", (personality.likes || []).join("\n"));
    this.setVal("edDislikes", (personality.dislikes || []).join("\n"));
    this.setVal("edPersonalityMarkdown", personality.raw_markdown || "");
    this.setVal("edBackgroundMarkdown", background.raw_markdown || "");
    this.setVal("edRelationshipsMarkdown", relationships.raw_markdown || "");

    // Populate Tab 4
    this.setVal("edConfessionDc", String(mind.confession_dc ?? 17));
    this.setVal("edHeartBase", String(mind.heart_meter_base ?? 1));
    this.setVal("edMindMarkdown", mind.raw_markdown || "");
    this.setVal("edSecretsMarkdown", secrets.raw_markdown || "");
    this.setVal("edDmNotes", dmNotes.notes || "");

    this.modalEl.style.display = "flex";
  }

  public hide() {
    if (this.modalEl) this.modalEl.style.display = "none";
  }

  private setVal(id: string, val: string) {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (el) el.value = val;
  }

  private getVal(id: string): string {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    return el ? el.value.trim() : "";
  }

  private async handleSave() {
    const token = dmAuthStore.getToken();
    if (!token) {
      showToast("Sesi DM tidak aktif. Silakan login kembali.", "error");
      return;
    }

    const name = this.getVal("edCharName");
    const slug = this.getVal("edCharSlug").toLowerCase().replace(/[^a-z0-9_-]/g, "_");

    if (!name || !slug) {
      showToast("Nama karakter dan Slug ID wajib diisi!", "error");
      return;
    }

    const saveBtn = document.getElementById("saveCodexEditorBtn") as HTMLButtonElement;
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = "⏳ Menyimpan...";
    }

    try {
      const nicknames = this.getVal("edCharNickname")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const likes = this.getVal("edLikes")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const dislikes = this.getVal("edDislikes")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const avatarUrl = this.getVal("edAvatarUrl");

      const payload = {
        slug,
        categoryId: this.getVal("edCharCategory") || "class_1_1",
        sortOrder: parseInt(this.getVal("edCharSortOrder") || "1", 10),
        visibilityMode: this.getVal("edCharVisMode") || "placeholder",
        homeRoomId: this.getVal("edCharHomeRoom") || null,
        isLoveInterest: (document.getElementById("edCharIsLoveInterest") as HTMLInputElement)?.checked || false,
        sections: [
          {
            sectionKey: "identity",
            tier: 1,
            lockedHint: "Karakter belum diperkenalkan.",
            content: {
              name,
              furigana: this.getVal("edCharFurigana"),
              nickname: nicknames,
              tagline: this.getVal("edCharTagline"),
              class_room: this.getVal("edCharClassRoom") || "Kelas 1-1",
              club: this.getVal("edCharClub"),
              role: this.getVal("edCharRole") || "Murid",
              age: parseInt(this.getVal("edCharAge") || "15", 10),
              birthday: this.getVal("edCharBirthday"),
              zodiac: this.getVal("edCharZodiac"),
              archetype: this.getVal("edCharArchetype"),
              mbti: this.getVal("edCharMbti"),
              stats: {
                physique: parseInt(this.getVal("edStatPhy") || "10", 10),
                intelligent: parseInt(this.getVal("edStatInt") || "10", 10),
                looks: parseInt(this.getVal("edStatLks") || "14", 10),
                mind: parseInt(this.getVal("edStatMnd") || "12", 10),
                talent: parseInt(this.getVal("edStatTlt") || "12", 10),
                luck: parseInt(this.getVal("edStatLck") || "10", 10)
              }
            }
          },
          {
            sectionKey: "appearance",
            tier: 1,
            lockedHint: "Penampilan karakter belum diketahui.",
            content: {
              avatar_url: avatarUrl,
              images: avatarUrl ? [{ path: avatarUrl, caption: "ID Portrait" }] : [],
              raw_markdown: this.getVal("edAppearanceMarkdown")
            }
          },
          {
            sectionKey: "personality",
            tier: 2,
            lockedHint: "Kenali dia lebih dekat untuk mengetahui sifat aslinya.",
            content: {
              likes,
              dislikes,
              raw_markdown: this.getVal("edPersonalityMarkdown")
            }
          },
          {
            sectionKey: "background",
            tier: 2,
            lockedHint: "Latar belakang dan kisah masa lalunya masih tertutup.",
            content: {
              raw_markdown: this.getVal("edBackgroundMarkdown")
            }
          },
          {
            sectionKey: "relationships",
            tier: 2,
            lockedHint: "Jaringan pertemanan karakter ini belum terungkap.",
            content: {
              raw_markdown: this.getVal("edRelationshipsMarkdown")
            }
          },
          {
            sectionKey: "mind",
            tier: 3,
            lockedHint: "Hanya terbuka bagi mereka yang meraih ikatan kepercayaan terdalam.",
            content: {
              confession_dc: parseInt(this.getVal("edConfessionDc") || "17", 10),
              heart_meter_base: parseInt(this.getVal("edHeartBase") || "1", 10),
              raw_markdown: this.getVal("edMindMarkdown")
            }
          },
          {
            sectionKey: "secrets",
            tier: 3,
            lockedHint: "Rahasia terdalam yang disimpan rapat di lubuk hatinya.",
            content: {
              raw_markdown: this.getVal("edSecretsMarkdown")
            }
          },
          {
            sectionKey: "dm_notes",
            tier: 99,
            lockedHint: "",
            content: {
              notes: this.getVal("edDmNotes")
            }
          }
        ]
      };

      const res = await dmUpsertCharacter(token, payload);
      if (res.success) {
        showToast(`🌸 Karakter "${name}" berhasil disimpan!`, "success");
        this.hide();
        if (this.onSavedCallback) {
          this.onSavedCallback(slug);
        }
      } else {
        showToast(`Gagal menyimpan: ${res.error}`, "error");
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, "error");
    } finally {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "💾 Simpan Karakter ke Database";
      }
    }
  }

  private async handleDelete() {
    if (!this.editingCharId) return;
    const token = dmAuthStore.getToken();
    if (!token) return;

    const confirmed = confirm("PERINGATAN: Apakah Anda yakin ingin menghapus karakter ini secara permanen dari database?");
    if (!confirmed) return;

    try {
      await dmDeleteCharacter(token, this.editingCharId);
      showToast("🗑️ Karakter berhasil dihapus.", "info");
      this.hide();
      window.location.href = "/codex";
    } catch (e: any) {
      showToast(`Gagal menghapus: ${e.message}`, "error");
    }
  }
}

export const codexCharacterEditorModal = new CodexCharacterEditorModal();
