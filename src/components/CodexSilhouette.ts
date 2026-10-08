/**
 * CodexSilhouette: Vector SVG generator untuk kartu dan profil karakter yang masih terkunci.
 * Menjamin 100% keamanan: menggunakan siluet generik misterius bernuansa anime sekolah,
 * BUKAN versi blur atau manipulasi dari gambar asli!
 */

export function renderCodexSilhouetteSvg(width: number = 180, height: number = 220): string {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 200 240" fill="none" xmlns="http://www.w3.org/2000/svg" class="codex-silhouette-svg" style="max-width:100%;height:auto;display:block;margin:0 auto;">
      <defs>
        <radialGradient id="silGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#e11d48" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#0b0f19" stop-opacity="0.95"/>
        </radialGradient>
        <linearGradient id="silGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2a1f2d"/>
          <stop offset="50%" stop-color="#181e2b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>
      
      <!-- Background aura -->
      <rect width="200" height="240" rx="12" fill="url(#silGlow)"/>
      
      <!-- Mystery Head Silhouette -->
      <path d="M100 40 C82 40 70 54 70 72 C70 92 84 106 100 106 C116 106 130 92 130 72 C130 54 118 40 100 40 Z" fill="url(#silGrad)" stroke="#374151" stroke-width="1.5"/>
      
      <!-- Anime Hair Fringe Silhouette Hint -->
      <path d="M72 65 Q90 55 100 58 Q115 55 128 65 Q115 50 100 48 Q85 50 72 65 Z" fill="#1e1826" opacity="0.8"/>
      
      <!-- Mystery Shoulders & School Uniform Collar Silhouette -->
      <path d="M45 190 C45 145 68 120 100 120 C132 120 155 145 155 190 L160 230 L40 230 Z" fill="url(#silGrad)" stroke="#374151" stroke-width="1.5"/>
      
      <!-- Sailor Collar / Tie V-Shape Outline Hint -->
      <path d="M85 125 L100 155 L115 125" stroke="#475569" stroke-width="2" fill="none" opacity="0.5"/>
      
      <!-- Golden Mystery Padlock Crest in Center -->
      <g transform="translate(85, 145)">
        <rect x="3" y="10" width="24" height="20" rx="4" fill="#f59e0b" stroke="#78350f" stroke-width="1.5"/>
        <path d="M7 10 V6 C7 2 23 2 23 6 V10" stroke="#f59e0b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <circle cx="15" cy="18" r="2.5" fill="#451a03"/>
        <path d="M15 20.5 V24" stroke="#451a03" stroke-width="2" stroke-linecap="round"/>
      </g>
      
      <!-- Question Mark Crest -->
      <text x="100" y="80" text-anchor="middle" font-family="'Cinzel', serif" font-size="28" font-weight="bold" fill="#f59e0b" opacity="0.4">?</text>
    </svg>
  `;
}
