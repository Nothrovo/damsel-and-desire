import fs from "fs";
import path from "path";

export function parseMarkdownCharacter(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const errors = [];
  const warnings = [];

  // 1. Check Frontmatter
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fmMatch) {
    errors.push("Missing YAML frontmatter (dibatasi oleh '---' di awal file)");
    return { valid: false, errors, warnings, metadata: {}, sections: {} };
  }

  const fmRaw = fmMatch[1];
  const metadata = {};
  const lines = fmRaw.split("\n");
  let currentKey = null;
  let currentArray = null;
  let currentMap = null;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // Check if it's a list item under a key: "  - item"
    if (trimmed.startsWith("- ")) {
      const itemVal = trimmed.slice(2).trim().replace(/^["']|["']$/g, "");
      if (currentKey && Array.isArray(metadata[currentKey])) {
        metadata[currentKey].push(itemVal);
      }
      continue;
    }

    // Check if it's a nested map item: "  key: val" (indented)
    if (rawLine.startsWith("  ") && currentKey && typeof metadata[currentKey] === "object" && !Array.isArray(metadata[currentKey])) {
      const colonIdx = trimmed.indexOf(":");
      if (colonIdx !== -1) {
        const subKey = trimmed.slice(0, colonIdx).trim();
        let subVal = trimmed.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, "");
        if (!isNaN(Number(subVal)) && subVal !== "") subVal = Number(subVal);
        metadata[currentKey][subKey] = subVal;
      }
      continue;
    }

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx !== -1) {
      const key = trimmed.slice(0, colonIdx).trim();
      let val = trimmed.slice(colonIdx + 1).trim();

      if (val === "") {
        // Look ahead: is the next line an array item (- ) or a sub-key?
        const nextLine = lines[i + 1] ? lines[i + 1].trim() : "";
        if (nextLine.startsWith("- ")) {
          metadata[key] = [];
          currentKey = key;
        } else if (lines[i + 1] && lines[i + 1].startsWith("  ")) {
          metadata[key] = {};
          currentKey = key;
        } else {
          metadata[key] = "";
          currentKey = key;
        }
        continue;
      }

      currentKey = key;
      // Strip inline YAML comments (e.g. '10 # 10 (Kelas 1)' or '"10-1" # comment')
      val = val.replace(/\s+#.*$/, "").trim();

      if (val.startsWith("[") && val.endsWith("]")) {
        try {
          val = JSON.parse(val.replace(/'/g, '"'));
        } catch (e) {
          val = val.slice(1, -1).split(",").map(s => s.trim().replace(/^["']|["']$/g, ""));
        }
      } else if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val === "true") {
        val = true;
      } else if (val === "false") {
        val = false;
      } else if (!isNaN(Number(val)) && val !== "") {
        val = Number(val);
      }
      metadata[key] = val;
    }
  }

  if (!metadata.id) errors.push("Frontmatter 'id' wajib diisi (snake_case slug)");
  if (!metadata.name) errors.push("Frontmatter 'name' wajib diisi");

  // 2. Parse Body Sections
  const body = content.slice(fmMatch[0].length);
  const sections = {};

  // Extract Tagline quote
  const quoteMatch = body.match(/>\s*\*?"([^"\n\r]+)"\*?/);
  if (quoteMatch) {
    sections.tagline = quoteMatch[1].trim();
  }

  // Extract major markdown headings (ONLY level-2 headings: ^## Title, NOT ### Subheading)
  const headingRegex = /(?:^|\r?\n)##(?!#)\s+([^\n\r]+)\r?\n([\s\S]*?)(?=(?:\r?\n##(?!#)\s+|$))/g;
  let match;
  while ((match = headingRegex.exec(body)) !== null) {
    const title = match[1].trim();
    // Clean trailing horizontal rules (---) and whitespace
    const sectionBody = match[2]
      .replace(/(?:\r?\n)+\s*---\s*$/g, "")
      .replace(/^\s*---\s*(?:\r?\n)+/g, "")
      .trim();
    sections[title] = sectionBody;
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    metadata,
    sections
  };
}

// Standalone CLI run
if (process.argv[1] && process.argv[1].endsWith("validateCodex.js")) {
  const targetDir = process.argv[2] || "Characters/Love Interests";
  console.log(`\n🔍 Memvalidasi data karakter di: ${targetDir}`);

  if (!fs.existsSync(targetDir)) {
    console.log(`Folder tidak ditemukan: ${targetDir}`);
    process.exit(1);
  }

  let totalFiles = 0;
  let validCount = 0;

  function traverse(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const ent of entries) {
      const fullPath = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        traverse(fullPath);
      } else if (ent.isFile() && ent.name.endsWith(".md") && !ent.name.startsWith("_") && !ent.name.includes("TEMPLATE") && !ent.name.includes("PROMPTS") && !ent.name.includes("COMPENDIUM")) {
        totalFiles++;
        const res = parseMarkdownCharacter(fullPath);
        if (res.valid) {
          validCount++;
          console.log(`  ✓ [VALID] ${ent.name} (${res.metadata.id} | ${res.metadata.name})`);
        } else {
          console.log(`  ✗ [INVALID] ${ent.name}: ${res.errors.join(", ")}`);
        }
      }
    }
  }

  traverse(targetDir);
  console.log(`\nHasil Validasi: ${validCount}/${totalFiles} berkas valid.\n`);
}
