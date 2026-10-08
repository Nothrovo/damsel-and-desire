import fs from "fs";
import path from "path";
import { createServer } from "vite";

async function main() {
  const rootDir = process.cwd();
  
  // Use Vite SSR to load TypeScript module directly
  const server = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    optimizeDeps: { noDiscovery: true }
  });

  const { compileFullHandbookHtml } = await server.ssrLoadModule("./src/data/handbook/index.ts");
  await server.close();

  const stylesCss = fs.readFileSync(path.join(rootDir, "css/styles.css"), "utf-8");

  // Extract the PHB styles from styles.css
  const phbMarker = "D&D 5e PLAYER'S HANDBOOK (PHB) AUTHENTIC STYLING";
  const phbCssIdx = stylesCss.indexOf(phbMarker);
  let phbCss = "";
  if (phbCssIdx !== -1) {
    phbCss = stylesCss.substring(phbCssIdx);
  } else {
    phbCss = stylesCss;
  }

  const compiledContent = compileFullHandbookHtml();

  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Damsel & Desire — Player's Handbook (PHB v2.0)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Yuji+Mai&display=swap" rel="stylesheet">
  <style>
    /* Reset & Base */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #1a1614;
      background-image: radial-gradient(circle at 50% 50%, #2b1f1a 0%, #151110 100%);
      color: #2e261f;
      font-family: 'Book Antiqua', 'Palatino Linotype', 'Palatino', 'Georgia', serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem 5rem 1rem;
    }

    /* Floating Print / PDF Toolbar */
    .handbook-floating-bar {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #58180d;
      color: #fff;
      padding: 12px 20px;
      border-radius: 9999px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 2px #c53135;
      display: flex;
      align-items: center;
      gap: 12px;
      z-index: 9999;
      font-family: 'Cinzel', serif;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
      border: none;
    }

    .handbook-floating-bar:hover {
      background: #782213;
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6), 0 0 0 3px #ea580c;
    }

    .handbook-top-banner {
      width: 100%;
      max-width: 960px;
      background: rgba(88, 24, 13, 0.9);
      border: 1px solid #c53135;
      border-radius: 6px;
      padding: 12px 20px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fdfbf7;
    }

    .handbook-top-banner a {
      color: #fef08a;
      text-decoration: none;
      font-weight: bold;
    }

    .handbook-top-banner a:hover {
      text-decoration: underline;
    }

    /* Embedded Handbook CSS */
    ${phbCss}
  </style>
</head>
<body>

  <!-- Top Banner for Offline / Online Viewers -->
  <div class="handbook-top-banner no-print">
    <div>
      <span style="font-family:'Cinzel',serif;font-weight:bold;font-size:1.1rem;letter-spacing:0.05em;color:#fef08a;">DAMSEL & DESIRE</span>
      <span style="margin-left:8px;font-size:0.85rem;color:#fcd34d;">Official Player's Handbook (PHB v2.0)</span>
    </div>
    <div style="display:flex;gap:12px;align-items:center;">
      <a href="index.html" class="no-print">← Buka Web App</a>
      <button onclick="window.print()" style="background:#f59e0b;color:#18181b;border:none;padding:6px 14px;border-radius:4px;font-weight:bold;cursor:pointer;font-family:'Cinzel',serif;">
        🖨️ Cetak / Simpan PDF (A4)
      </button>
    </div>
  </div>

  <!-- Main Rendered Document -->
  ${compiledContent}

  <!-- Floating Print Trigger Button -->
  <button class="handbook-floating-bar no-print" onclick="window.print()">
    <span>🖨️</span>
    <span>Cetak / Simpan ke PDF (A4)</span>
  </button>

</body>
</html>
`;

  fs.writeFileSync(path.join(rootDir, "PLAYERS_HANDBOOK.html"), fullHtml, "utf-8");
  if (fs.existsSync(path.join(rootDir, "dist"))) {
    fs.writeFileSync(path.join(rootDir, "dist/PLAYERS_HANDBOOK.html"), fullHtml, "utf-8");
  }

  console.log("Successfully generated PLAYERS_HANDBOOK.html (Size: " + (fullHtml.length / 1024).toFixed(1) + " KB)!");
}

main().catch(err => {
  console.error("Error generating handbook:", err);
  process.exit(1);
});
