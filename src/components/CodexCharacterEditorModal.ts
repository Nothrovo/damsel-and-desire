import {
  DEFAULT_CODEX_CATEGORIES,
  getAllSubcategories,
  resolveCharacterAffiliations,
  dmUpsertCharacter,
  dmDeleteCharacter,
  dmUploadCharacterImage,
  resolvePortraitUrl
} from "../api/codex";
import { dmAuthStore } from "../store/dmAuthStore";
import { dmAuthModal } from "./DmAuthModal";
import { invalidateLoveInterestsCache } from "../api/loveInterests";
import { showToast } from "./Toast";

class CodexCharacterEditorModal {
  private modalEl: HTMLElement | null = null;
  private isEditMode: boolean = false;
  private editingCharId: string | null = null;
  private onSavedCallback: ((slug: string) => void) | null = null;

  public render(): string {
    const allSubs = getAllSubcategories();
    const subcategoriesChecklistHtml = allSubs.map(sub => `
      <label style="display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,0.04);border:1px solid var(--border-subtle);padding:5px 9px;border-radius:var(--radius-sm);font-size:0.75rem;cursor:pointer;user-select:none;">
        <input type="checkbox" class="ed-category-cb" value="${sub.id}" style="accent-color:var(--amber-gold);cursor:pointer;width:14px;height:14px;" />
        <span>${sub.icon} ${sub.shortLabel || sub.name}</span>
      </label>
    `).join("");

    return `
      <div id="codexCharEditorModal" class="modal-backdrop" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:10000;align-items:center;justify-content:center;backdrop-filter:blur(6px);padding:1rem;">
        <div class="modal-card" style="background:var(--bg-card);border:1.5px solid var(--amber-gold);box-shadow:0 16px 48px rgba(0,0,0,0.85);border-radius:var(--radius-lg);max-width:920px;width:100%;max-height:92vh;display:flex;flex-direction:column;position:relative;overflow:hidden;">
          
          <!-- Modal Header -->
          <div style="padding:1.25rem 1.75rem;border-bottom:1px solid var(--border-subtle);display:flex;justify-content:space-between;align-items:center;background:rgba(13,17,26,0.6);">
            <div style="display:flex;align-items:center;gap:10px;">
              <span style="font-size:1.4rem;">👑</span>
              <div>
                <h2 id="codexEditorTitle" style="font-family:var(--font-heading);color:var(--amber-gold);margin:0;font-size:1.3rem;">
                  Tambah Karakter Baru (Codex Editor)
                </h2>
                <span style="font-size:0.75rem;color:var(--text-muted);">
                  Eksklusif Game Master: Karakter yang disimpan langsung tersinkronisasi ke server Supabase cloud.
                </span>
              </div>
            </div>
            <button id="closeCodexEditorModalBtn" style="background:none;border:none;color:var(--text-muted);font-size:1.6rem;cursor:pointer;line-height:1;">&times;</button>
          </div>

          <!-- Editor Tabs Bar -->
          <div style="display:flex;gap:6px;padding:0.75rem 1.75rem;background:var(--bg-surface);border-bottom:1px solid var(--border-subtle);overflow-x:auto;">
            <button type="button" class="codex-editor-tab active btn btn-xs" data-etab="tab_meta" style="background:var(--rose-primary);color:#fff;border-color:var(--rose-primary);">
              1. 📋 Identitas &amp; Afiliasi Ganda
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_appearance">
              2. 🎀 Pasfoto ID &amp; Visual
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_stats">
              3. ⚔️ Statistik &amp; Vitals
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_tier2">
              4. 🧠 Persona, Flaws &amp; Hadiah
            </button>
            <button type="button" class="codex-editor-tab btn btn-xs btn-secondary" data-etab="tab_tier3">
              5. 🔒 Pikiran, Rahasia &amp; DM Notes
            </button>
          </div>

          <!-- Scrollable Form Body -->
          <form id="codexCharEditorForm" style="flex:1;overflow-y:auto;padding:1.5rem 1.75rem;">
            
            <!-- TAB 1: METADATA & MULTI-CATEGORY IDENTITY -->
            <div id="etab_tab_meta" class="codex-editor-panel">
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Nama Karakter (Wajib) *</label>
                  <input type="text" id="edCharName" required placeholder="Misal: Yamada Hanako (山田 花子)" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Slug ID Unik (Wajib) *</label>
                  <input type="text" id="edCharSlug" required placeholder="Misal: yamada_hanako" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);font-family:monospace;" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Furigana / Kanji</label>
                  <input type="text" id="edCharFurigana" placeholder="Misal: やまだ はなこ / Yamada Hanako" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <!-- Primary School & Classroom Selectors -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(180px, 1fr));gap:1rem;margin-bottom:1.25rem;background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);padding:1rem;border-radius:var(--radius-md);">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Sekolah / Afiliasi Utama</label>
                  <select id="edCharSchool" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);">
                    <option value="housen">🌸 Housen Academy</option>
                    <option value="touki">👹 SMA Kejuruan Touki</option>
                    <option value="outside">🌆 Luar Sekolah / Kota Kredon</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">Kelas &amp; Angkatan</label>
                  <select id="edCharClassRoom" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);">
                    <option value="10-1">Kelas 10-1 (Housen)</option>
                    <option value="10-2">Kelas 10-2 (Housen)</option>
                    <option value="11-1">Kelas 11-1 (Housen)</option>
                    <option value="11-2">Kelas 11-2 (Housen)</option>
                    <option value="12-1">Kelas 12-1 (Housen)</option>
                    <option value="12-2">Kelas 12-2 (Housen)</option>
                    <option value="Kelas 10 Touki">Kelas 10 SMA Touki</option>
                    <option value="Kelas 11 Touki">Kelas 11 SMA Touki</option>
                    <option value="Kelas 12 Touki">Kelas 12 SMA Touki</option>
                    <option value="Non-Siswa / Guru">Guru / Staf / Non-Siswa</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Gender</label>
                  <select id="edCharGender" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);">
                    <option value="Female">Perempuan (Female)</option>
                    <option value="Male">Laki-laki (Male)</option>
                    <option value="Other">Lainnya / Rahasia</option>
                  </select>
                </div>
                <div style="display:flex;align-items:center;padding-top:1.3rem;">
                  <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.85rem;color:var(--rose-light);font-weight:700;">
                    <input type="checkbox" id="edCharIsLoveInterest" style="width:18px;height:18px;accent-color:var(--rose-primary);cursor:pointer;" />
                    <span>♥ Target Asmara (Love Interest)</span>
                  </label>
                </div>
              </div>

              <!-- Multi-Folder / Multi-Category Checklist -->
              <div style="margin-bottom:1.25rem;background:rgba(245,158,11,0.05);border:1px solid var(--amber-gold);border-radius:var(--radius-md);padding:1rem;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.75rem;flex-wrap:wrap;gap:8px;">
                  <div>
                    <strong style="color:var(--amber-gold);font-size:0.85rem;display:block;">📁 Anggota di Folder Mana Saja? (Multi-Category Membership)</strong>
                    <span style="font-size:0.75rem;color:var(--text-muted);">
                      Centang semua direktori yang sesuai. Karakter akan muncul di setiap folder yang dicentang secara bersamaan.
                    </span>
                  </div>
                </div>
                <div id="edAffiliationsContainer" style="display:flex;gap:6px;flex-wrap:wrap;">
                  ${subcategoriesChecklistHtml}
                </div>
              </div>

              <!-- Club & Role -->
              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:1rem;margin-bottom:1.25rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Klub Ekstrakurikuler</label>
                  <select id="edCharClub" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);">
                    <option value="none">Tanpa Klub / None</option>
                    <option value="cooking">🍳 Klub Tata Boga (Cooking)</option>
                    <option value="gaming">🎮 Klub Gaming &amp; Esports</option>
                    <option value="occult">🔮 Klub Okultisme &amp; Misteri</option>
                    <option value="taekwondo">🥋 Klub Taekwondo &amp; Bela Diri</option>
                    <option value="fencing">🤺 Klub Anggar (Fencing)</option>
                    <option value="kendo">🎋 Klub Kendo &amp; Seni Pedang</option>
                    <option value="art">🎨 Klub Seni Rupa &amp; Manga</option>
                    <option value="music">🎸 Klub Musik &amp; Band</option>
                    <option value="photography">📷 Klub Fotografi</option>
                    <option value="volleyball">🏐 Klub Bola Voli</option>
                    <option value="osis">👑 Presidium OSIS</option>
                    <option value="kokuhou">🦅 Geng Kokuhou</option>
                    <option value="touki_gang">👹 Geng Touki</option>
                  </select>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Jabatan di Klub</label>
                  <input type="text" id="edCharClubRole" placeholder="Misal: Ketua Klub, Wakil Ketua, Anggota" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Peran Umum di Sekolah</label>
                  <input type="text" id="edCharRole" placeholder="Misal: Siswa Housen, Ketua OSIS, Dokter UKS" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <!-- Tagline & Nicknames -->
              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Tagline / Kutipan Khas Karakter</label>
                <input type="text" id="edCharTagline" placeholder="Misal: Selamat pagi! Jangan lupa jadwal piket kelas hari ini ya!" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
              </div>

              <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(140px, 1fr));gap:1rem;">
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Panggilan (Pisahkan Koma)</label>
                  <input type="text" id="edCharNickname" placeholder="Hanako, Yamada" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Usia (Tahun)</label>
                  <input type="number" id="edCharAge" value="16" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Ulang Tahun</label>
                  <input type="text" id="edCharBirthday" placeholder="14 April" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Zodiak</label>
                  <input type="text" id="edCharZodiac" placeholder="Aries" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Arketipe / Dere</label>
                  <input type="text" id="edCharArchetype" placeholder="Tsundere / Deredere" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">MBTI</label>
                  <input type="text" id="edCharMbti" placeholder="ISFP" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.45rem 0.65rem;color:var(--text-main);" />
                </div>
              </div>
            <!-- TAB 2: PASFOTO ID & VISUAL -->
            <div id="etab_tab_appearance" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:180px 1fr;gap:1.5rem;margin-bottom:1.5rem;align-items:start;">
                <div style="background:#0d111a;border:2px solid var(--amber-gold);border-radius:var(--radius-md);aspect-ratio:3/4;overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-sm);">
                  <img id="edAvatarPreview" src="https://api.dicebear.com/7.x/adventurer/svg?seed=housen" alt="Preview" style="width:100%;height:100%;object-fit:cover;" />
                </div>
                <div>
                  <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:6px;font-weight:600;">Unggah Pasfoto ID Siswa (Supabase Storage Cloud)</label>
                  
                  <div style="background:var(--bg-surface);border:1.5px dashed var(--amber-gold);border-radius:var(--radius-md);padding:1.25rem;margin-bottom:1rem;">
                    <label style="display:block;font-size:0.8rem;color:var(--text-main);margin-bottom:6px;font-weight:600;">
                      📤 Pilih File Gambar dari Perangkat Anda (JPG/PNG):
                    </label>
                    <input type="file" id="edAvatarFileInput" accept="image/*" style="font-size:0.85rem;color:var(--text-muted);width:100%;" />
                    <div id="edUploadStatus" style="font-size:0.8rem;color:var(--amber-gold);margin-top:8px;font-weight:600;"></div>
                  </div>

                  <label style="display:block;font-size:0.8rem;color:var(--text-dim);margin-bottom:4px;">Atau Tempel Tautan URL Gambar Langsung:</label>
                  <input type="text" id="edAvatarUrl" placeholder="https://..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <div>
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:6px;font-weight:600;">Deskripsi Penampilan Fisik (Rambut, Mata, Seragam, Ciri Khas)</label>
                <textarea id="edAppearanceMarkdown" rows="6" placeholder="Tuliskan deskripsi visual karakter (gaya rambut, warna mata, seragam sekolah, aksesoris khas)..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.75rem;color:var(--text-main);font-family:inherit;line-height:1.5;"></textarea>
              </div>
            </div>

            <!-- TAB 3: STATISTIK & VITALS -->
            <div id="etab_tab_stats" class="codex-editor-panel" style="display:none;">
              <!-- Dual Vitals -->
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1.5rem;">
                <div style="background:rgba(16,185,129,0.08);border:1px solid #10b981;border-radius:var(--radius-md);padding:1rem;">
                  <label style="display:block;font-size:0.85rem;color:#34d399;margin-bottom:4px;font-weight:700;">💚 HP Fisik Maksimal (Physical HP)</label>
                  <input type="number" id="edCharHpMax" value="10" min="1" max="100" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);font-size:1.1rem;font-weight:700;" />
                  <span style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;display:block;">Ketahanan cedera fisik dalam perkelahian &amp; benturan.</span>
                </div>
                <div style="background:rgba(244,114,182,0.08);border:1px solid #f472b6;border-radius:var(--radius-md);padding:1rem;">
                  <label style="display:block;font-size:0.85rem;color:#f472b6;margin-bottom:4px;font-weight:700;">💖 Composure Maksimal (Ketenangan Batin)</label>
                  <input type="number" id="edCharComposureMax" value="12" min="1" max="100" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.55rem 0.75rem;color:var(--text-main);font-size:1.1rem;font-weight:700;" />
                  <span style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;display:block;">Ketahanan mental saat diintimidasi, digoda, atau panik sosial.</span>
                </div>
              </div>

              <!-- 6 Ability Scores -->
              <div style="background:var(--bg-surface);padding:1.25rem;border-radius:var(--radius-md);border:1px solid var(--border-subtle);">
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:0.75rem;font-family:var(--font-heading);font-weight:700;">
                  6 Atribut Statistik Karakter (D&amp;D 5e Chassis)
                </label>
                <div style="display:grid;grid-template-columns:repeat(6, 1fr);gap:0.75rem;">
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">PHY</span>
                    <input type="number" id="edStatPhy" value="10" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModPhy" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+0)</span>
                  </div>
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">INT</span>
                    <input type="number" id="edStatInt" value="10" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModInt" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+0)</span>
                  </div>
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">LKS</span>
                    <input type="number" id="edStatLks" value="14" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModLks" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+2)</span>
                  </div>
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">MND</span>
                    <input type="number" id="edStatMnd" value="12" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModMnd" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+1)</span>
                  </div>
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">TLT</span>
                    <input type="number" id="edStatTlt" value="12" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModTlt" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+1)</span>
                  </div>
                  <div style="text-align:center;">
                    <span style="font-size:0.75rem;color:var(--text-main);font-weight:700;display:block;margin-bottom:4px;">LCK</span>
                    <input type="number" id="edStatLck" value="10" min="1" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-xs);padding:6px;color:var(--text-main);text-align:center;font-weight:700;" />
                    <span id="edModLck" style="font-size:0.7rem;color:var(--amber-gold);display:block;margin-top:2px;">(+0)</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- TAB 4: PERSONA, FLAWS & HADIAH -->
            <div id="etab_tab_tier2" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:#34d399;margin-bottom:4px;font-weight:600;">💚 Hal yang Disukai (Satu per baris)</label>
                  <textarea id="edLikes" rows="3" placeholder="Kamera analog&#10;Kucing liar&#10;Matcha latte" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">💔 Hal yang Dibenci (Satu per baris)</label>
                  <textarea id="edDislikes" rows="3" placeholder="Keramaian berisik&#10;Orang yang kasar" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
                </div>
              </div>

              <!-- Gift Preferences -->
              <div style="background:rgba(255,255,255,0.02);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:1rem;margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);font-weight:700;margin-bottom:0.5rem;">🎁 Preferensi Hadiah (Gift System)</label>
                <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:0.75rem;">
                  <div>
                    <span style="font-size:0.75rem;color:#34d399;font-weight:600;display:block;">Favorit (Suka Sekali)</span>
                    <input type="text" id="edGiftsFav" placeholder="Kue buatan tangan, buku langka" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem;color:var(--text-main);font-size:0.8rem;" />
                  </div>
                  <div>
                    <span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;display:block;">Biasa (Diterima Sopan)</span>
                    <input type="text" id="edGiftsNorm" placeholder="Teh kemasan, alat tulis sekolah" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem;color:var(--text-main);font-size:0.8rem;" />
                  </div>
                  <div>
                    <span style="font-size:0.75rem;color:#f87171;font-weight:600;display:block;">Dibenci (Ditolak / Kecewa)</span>
                    <input type="text" id="edGiftsDis" placeholder="Barang tiruan murah" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem;color:var(--text-main);font-size:0.8rem;" />
                  </div>
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">🧠 Sifat Dasar, Celah Emosional (Flaws) &amp; Gaya Bicara</label>
                <textarea id="edPersonalityMarkdown" rows="4" placeholder="Sifat permukaan, kepribadian tersembunyi, celah emosional, dan cara bicaranya..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">📖 Latar Belakang &amp; Sejarah Masa Lalu</label>
                <textarea id="edBackgroundMarkdown" rows="4" placeholder="Kisah masa kecil, keluarga, dan alasan bergabung di Housen/Touki..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div>
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">👥 Jaringan Relasi Karakter (Teman, Rival, Sahabat)</label>
                <textarea id="edRelationshipsMarkdown" rows="4" placeholder="Hubungan dengan teman sekelas, faksi lain, dan tokoh penting..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>
            </div>

            <!-- TAB 5: PIKIRAN, RAHASIA & CATATAN DM -->
            <div id="etab_tab_tier3" class="codex-editor-panel" style="display:none;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem;">
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">💖 Confession DC (Target DC Pernyataan Cinta)</label>
                  <input type="number" id="edConfessionDc" value="17" min="5" max="30" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
                <div>
                  <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">♥ Level Heart Awal</label>
                  <input type="number" id="edHeartBase" value="1" min="0" max="5" style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.5rem 0.75rem;color:var(--text-main);" />
                </div>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--amber-gold);margin-bottom:4px;font-weight:600;">💭 Pikiran Terdalam, Impian &amp; Syarat Meluluhkan Hati (Tier 3)</label>
                <textarea id="edMindMarkdown" rows="4" placeholder="Kelemahan emosional terdalam, impian rahasia, dan apa yang harus dilakukan pemain untuk meluluhkan hatinya..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="margin-bottom:1.25rem;">
                <label style="display:block;font-size:0.8rem;color:var(--rose-light);margin-bottom:4px;font-weight:600;">🔒 Rahasia Besar Karakter (Tier 3)</label>
                <textarea id="edSecretsMarkdown" rows="4" placeholder="Rahasia tersembunyi yang baru terungkap di puncak cerita atau hubungan intim..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
              </div>

              <div style="background:rgba(245,158,11,0.08);border:1.5px solid var(--amber-gold);border-radius:var(--radius-md);padding:1rem;">
                <label style="display:block;font-size:0.85rem;color:var(--amber-gold);margin-bottom:4px;font-weight:700;">👑 Catatan Eksklusif DM (TIDAK PERNAH DIKIRIM KE PEMAIN)</label>
                <textarea id="edDmNotes" rows="4" placeholder="Catatan skenario DM, pemicu event tersembunyi, konsekuensi pilihan pemain..." style="width:100%;box-sizing:border-box;background:var(--bg-input);border:1px solid var(--border-card);border-radius:var(--radius-sm);padding:0.6rem;color:var(--text-main);font-family:inherit;"></textarea>
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
                💾 Simpan Karakter ke Database Supabase
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

    // Auto-check categories when classroom changes
    const classRoomSelect = document.getElementById("edCharClassRoom") as HTMLSelectElement;
    classRoomSelect?.addEventListener("change", () => {
      this.syncCheckboxesFromInputs();
    });

    // Auto-check categories when club changes
    const clubSelect = document.getElementById("edCharClub") as HTMLSelectElement;
    clubSelect?.addEventListener("change", () => {
      this.syncCheckboxesFromInputs();
    });

    // Live Stat Modifier Calculation
    const statIds = ["edStatPhy", "edStatInt", "edStatLks", "edStatMnd", "edStatTlt", "edStatLck"];
    statIds.forEach((id) => {
      const input = document.getElementById(id) as HTMLInputElement;
      input?.addEventListener("input", () => {
        const val = parseInt(input.value || "10", 10);
        const mod = Math.floor((val - 10) / 2);
        const modId = id.replace("edStat", "edMod");
        const modEl = document.getElementById(modId);
        if (modEl) {
          modEl.textContent = `(${mod >= 0 ? '+' : ''}${mod})`;
        }
      });
    });

    // Live Avatar URL preview
    const avatarUrlInput = document.getElementById("edAvatarUrl") as HTMLInputElement;
    const avatarPreview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    avatarUrlInput?.addEventListener("input", () => {
      if (avatarPreview && avatarUrlInput.value.trim()) {
        avatarPreview.src = avatarUrlInput.value.trim();
      }
    });

    // File Upload Handler via Supabase Storage
    const fileInput = document.getElementById("edAvatarFileInput") as HTMLInputElement;
    fileInput?.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const token = dmAuthStore.getToken();
      if (!token) {
        showToast("Sesi DM tidak aktif. Silakan login kembali.", "error");
        return;
      }

      const statusEl = document.getElementById("edUploadStatus");
      if (statusEl) statusEl.textContent = "⏳ Mengunggah foto ke storage Supabase...";

      const res = await dmUploadCharacterImage(token, file);
      if (res.success && res.url) {
        if (avatarUrlInput) avatarUrlInput.value = res.url;
        if (avatarPreview) avatarPreview.src = res.url;
        if (statusEl) statusEl.textContent = "✓ Pasfoto ID berhasil diunggah ke storage cloud!";
        showToast("Pasfoto ID berhasil diunggah ke server!", "success");
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

  private syncCheckboxesFromInputs() {
    const room = (document.getElementById("edCharClassRoom") as HTMLSelectElement)?.value || "";
    const club = (document.getElementById("edCharClub") as HTMLSelectElement)?.value || "";
    const school = (document.getElementById("edCharSchool") as HTMLSelectElement)?.value || "housen";

    const checkCb = (val: string, check: boolean) => {
      const cb = document.querySelector(`.ed-category-cb[value="${val}"]`) as HTMLInputElement | null;
      if (cb) cb.checked = check;
    };

    // Class mapping
    if (room.includes("10-1")) checkCb("class_1_1", true);
    if (room.includes("10-2")) checkCb("class_1_2", true);
    if (room.includes("11-1")) checkCb("class_2_1", true);
    if (room.includes("11-2")) checkCb("class_2_2", true);
    if (room.includes("12-1")) checkCb("class_3_1", true);
    if (room.includes("12-2")) checkCb("class_3_2", true);

    if (school === "touki") {
      checkCb("touki_classes", true);
      checkCb("touki_clubs_orgs", true);
    } else if (school === "outside") {
      checkCb("outside_school", true);
    }

    if (club === "osis") checkCb("osis", true);
    if (club === "kokuhou") checkCb("kokuhou", true);
    if (club === "touki_gang") checkCb("touki_clubs_orgs", true);
    if (club !== "none" && club !== "osis" && club !== "kokuhou" && club !== "touki_gang") {
      checkCb("clubs", true);
    }
  }

  public openForCreate(defaultCategoryId: string = "class_1_1", onSaved?: (slug: string) => void) {
    if (!dmAuthStore.isDmActive()) {
      showToast("Akses Game Master diperlukan untuk menambah karakter baru.", "warning");
      dmAuthModal.open(() => {
        if (dmAuthStore.isDmActive()) {
          this.openForCreate(defaultCategoryId, onSaved);
        }
      });
      return;
    }

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

    // Default checkboxes
    document.querySelectorAll(".ed-category-cb").forEach((cb: any) => {
      cb.checked = cb.value === defaultCategoryId;
    });

    (document.getElementById("edCharSlug") as HTMLInputElement).readOnly = false;
    const preview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    if (preview) preview.src = "https://api.dicebear.com/7.x/adventurer/svg?seed=housen";

    const statusEl = document.getElementById("edUploadStatus");
    if (statusEl) statusEl.textContent = "";

    this.syncCheckboxesFromInputs();
    this.modalEl.style.display = "flex";
  }

  public openForEdit(char: any, onSaved?: (slug: string) => void) {
    if (!dmAuthStore.isDmActive()) {
      showToast("Akses Game Master diperlukan untuk mengedit karakter.", "warning");
      dmAuthModal.open(() => {
        if (dmAuthStore.isDmActive()) {
          this.openForEdit(char, onSaved);
        }
      });
      return;
    }

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
    this.setVal("edCharClassRoom", identity.class_room || char.class_room || "10-1");
    this.setVal("edCharClub", identity.club || char.club || "none");
    this.setVal("edCharClubRole", identity.club_role || char.club_role || "");
    this.setVal("edCharRole", identity.role || char.role || "Siswa Housen");
    this.setVal("edCharGender", identity.gender || char.gender || "Female");
    (document.getElementById("edCharIsLoveInterest") as HTMLInputElement).checked = Boolean(char.is_love_interest);

    // Multi-category checkboxes
    const affiliations = new Set(resolveCharacterAffiliations(char));
    document.querySelectorAll(".ed-category-cb").forEach((cb: any) => {
      cb.checked = affiliations.has(cb.value);
    });

    this.setVal("edCharTagline", identity.tagline || char.tagline || "");
    this.setVal("edCharNickname", (identity.nickname || []).join(", "));
    this.setVal("edCharAge", String(identity.age ?? 16));
    this.setVal("edCharBirthday", identity.birthday || "");
    this.setVal("edCharZodiac", identity.zodiac || "");
    this.setVal("edCharArchetype", identity.archetype || "");
    this.setVal("edCharMbti", identity.mbti || "");

    // Populate Tab 2
    const avatarUrl = resolvePortraitUrl(appearance.avatar_url || char.avatar_url, char.slug);
    this.setVal("edAvatarUrl", avatarUrl);
    const preview = document.getElementById("edAvatarPreview") as HTMLImageElement;
    if (preview) {
      preview.src = avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${char.slug}`;
    }
    this.setVal("edAppearanceMarkdown", appearance.raw_markdown || "");

    // Populate Tab 3 (Stats & Vitals)
    const stats = identity.stats || char.stats || {};
    this.setVal("edStatPhy", String(stats.physique ?? 10));
    this.setVal("edStatInt", String(stats.intelligent ?? 10));
    this.setVal("edStatLks", String(stats.looks ?? 14));
    this.setVal("edStatMnd", String(stats.mind ?? 12));
    this.setVal("edStatTlt", String(stats.talent ?? 12));
    this.setVal("edStatLck", String(stats.luck ?? 10));

    // Update Mod labels
    ["Phy", "Int", "Lks", "Mnd", "Tlt", "Lck"].forEach((k) => {
      const val = parseInt(this.getVal(`edStat${k}`) || "10", 10);
      const mod = Math.floor((val - 10) / 2);
      const modEl = document.getElementById(`edMod${k}`);
      if (modEl) modEl.textContent = `(${mod >= 0 ? '+' : ''}${mod})`;
    });

    const vitals = identity.vitals || char.vitals || {};
    this.setVal("edCharHpMax", String(vitals.physical_hp_max ?? 10));
    this.setVal("edCharComposureMax", String(vitals.composure_max ?? 12));

    // Populate Tab 4 (Persona & Gifts)
    this.setVal("edLikes", (personality.likes || []).join("\n"));
    this.setVal("edDislikes", (personality.dislikes || []).join("\n"));
    this.setVal("edPersonalityMarkdown", personality.raw_markdown || "");
    this.setVal("edBackgroundMarkdown", background.raw_markdown || "");
    this.setVal("edRelationshipsMarkdown", relationships.raw_markdown || "");

    const gifts = mind.gifts || {};
    this.setVal("edGiftsFav", Array.isArray(gifts.favorite) ? gifts.favorite.join(", ") : "");
    this.setVal("edGiftsNorm", Array.isArray(gifts.normal) ? gifts.normal.join(", ") : "");
    this.setVal("edGiftsDis", Array.isArray(gifts.disliked) ? gifts.disliked.join(", ") : "");

    // Populate Tab 5 (Mind & Secrets)
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
      saveBtn.textContent = "⏳ Menyimpan ke Supabase...";
    }

    try {
      // Collect selected categories from checklist
      const selectedCategories: string[] = [];
      document.querySelectorAll(".ed-category-cb:checked").forEach((cb: any) => {
        selectedCategories.push(cb.value);
      });
      if (selectedCategories.length === 0) {
        selectedCategories.push("class_1_1");
      }

      const primaryCategory = selectedCategories[0] || "class_1_1";

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

      const giftsFav = this.getVal("edGiftsFav").split(",").map(s => s.trim()).filter(Boolean);
      const giftsNorm = this.getVal("edGiftsNorm").split(",").map(s => s.trim()).filter(Boolean);
      const giftsDis = this.getVal("edGiftsDis").split(",").map(s => s.trim()).filter(Boolean);

      const avatarUrl = this.getVal("edAvatarUrl");
      const isLoveInterest = (document.getElementById("edCharIsLoveInterest") as HTMLInputElement)?.checked || false;

      const payload = {
        slug,
        categoryId: primaryCategory,
        categories: selectedCategories,
        sortOrder: 1,
        visibilityMode: "placeholder",
        isLoveInterest,
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
              class_room: this.getVal("edCharClassRoom") || "10-1",
              club: this.getVal("edCharClub"),
              club_role: this.getVal("edCharClubRole"),
              role: this.getVal("edCharRole") || "Siswa Housen",
              school: this.getVal("edCharSchool"),
              gender: this.getVal("edCharGender") || "Female",
              categories: selectedCategories,
              age: parseInt(this.getVal("edCharAge") || "16", 10),
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
              },
              vitals: {
                physical_hp_max: parseInt(this.getVal("edCharHpMax") || "10", 10),
                composure_max: parseInt(this.getVal("edCharComposureMax") || "12", 10)
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
              gifts: {
                favorite: giftsFav,
                normal: giftsNorm,
                disliked: giftsDis
              },
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
        invalidateLoveInterestsCache();
        showToast(`🌸 Karakter "${name}" berhasil disimpan ke Supabase!`, "success");
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
        saveBtn.textContent = "💾 Simpan Karakter ke Database Supabase";
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
      invalidateLoveInterestsCache();
      showToast("🗑️ Karakter berhasil dihapus.", "info");
      this.hide();
      window.location.href = "/codex";
    } catch (e: any) {
      showToast(`Gagal menghapus: ${e.message}`, "error");
    }
  }
}

export const codexCharacterEditorModal = new CodexCharacterEditorModal();
