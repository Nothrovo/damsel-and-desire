export function renderNotFoundView(): void {
  const appContainer = document.getElementById("appMain");
  if (!appContainer) return;

  appContainer.innerHTML = `
    <section class="view-section active" style="min-height:60vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:2rem;">
      <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-md);padding:3rem;max-width:500px;width:100%;">
        <div style="font-size:3.5rem;margin-bottom:1rem;">🏮 404</div>
        <h2 style="font-family:var(--font-heading);margin-bottom:0.5rem;">Halaman Tidak Ditemukan</h2>
        <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:1.5rem;">
          Sepertinya kamu tersesat di koridor sekolah sepulang kegiatan ekskul.
        </p>
        <a href="/" class="btn btn-primary">← Kembali ke Beranda</a>
      </div>
    </section>
  `;
}
