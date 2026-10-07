import { HandbookChapter } from "./types";
import { ch0_cover_intro as CHAPTER_0_COVER_INTRO } from "./ch0_cover_intro";
import { ch1_character_creation as CHAPTER_1_CHARACTER_CREATION } from "./ch1_character_creation";
import { ch2_abilities_skills as CHAPTER_2_ABILITIES_SKILLS } from "./ch2_abilities_skills";
import { CHAPTER_3_ARCHETYPES } from "./ch3_archetypes";
import { CHAPTER_4_EKSKUL } from "./ch4_ekskul";
import { CHAPTER_5_SOCIAL_FINANCES } from "./ch5_social_finances";
import { CHAPTER_6_EQUIPMENT_INVENTORY } from "./ch6_equipment_inventory";
import { CHAPTER_7_DUAL_VITALS } from "./ch7_dual_vitals";
import { CHAPTER_8_ENCOUNTER_RULES } from "./ch8_encounter_rules";
import { CHAPTER_9_REST_SCHOOL_LIFE } from "./ch9_rest_school_life";
import { CHAPTER_10_ROMANCE_SECRETS } from "./ch10_romance_secrets";
import { CHAPTER_11_DM_APPENDIX } from "./ch11_dm_appendix";

export * from "./types";

export const HANDBOOK_CHAPTERS: HandbookChapter[] = [
  CHAPTER_0_COVER_INTRO,
  CHAPTER_1_CHARACTER_CREATION,
  CHAPTER_2_ABILITIES_SKILLS,
  CHAPTER_3_ARCHETYPES,
  CHAPTER_4_EKSKUL,
  CHAPTER_5_SOCIAL_FINANCES,
  CHAPTER_6_EQUIPMENT_INVENTORY,
  CHAPTER_7_DUAL_VITALS,
  CHAPTER_8_ENCOUNTER_RULES,
  CHAPTER_9_REST_SCHOOL_LIFE,
  CHAPTER_10_ROMANCE_SECRETS,
  CHAPTER_11_DM_APPENDIX,
];

export function getHandbookChapterById(id: string): HandbookChapter | undefined {
  return HANDBOOK_CHAPTERS.find((ch) => ch.id === id);
}

export function searchHandbook(query: string): { chapter: HandbookChapter; matchSnippet: string }[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: { chapter: HandbookChapter; matchSnippet: string }[] = [];

  for (const ch of HANDBOOK_CHAPTERS) {
    if (ch.title.toLowerCase().includes(q) || ch.summary.toLowerCase().includes(q)) {
      results.push({ chapter: ch, matchSnippet: ch.summary });
      continue;
    }
    for (const sec of ch.sections) {
      if (sec.title.toLowerCase().includes(q) || (sec.leadParagraph && sec.leadParagraph.toLowerCase().includes(q))) {
        results.push({ chapter: ch, matchSnippet: `${sec.title}: ${sec.leadParagraph || ""}` });
        break;
      }
      if (sec.contentHtml.toLowerCase().includes(q)) {
        // Find snippet
        const idx = sec.contentHtml.toLowerCase().indexOf(q);
        const snippet = sec.contentHtml.substring(Math.max(0, idx - 40), Math.min(sec.contentHtml.length, idx + 100)).replace(/<[^>]*>?/gm, "");
        results.push({ chapter: ch, matchSnippet: `...${snippet}...` });
        break;
      }
    }
  }
  return results;
}

/**
 * Compiles chapters into authentic D&D 5e Player's Handbook HTML format.
 * Includes parchment textures, drop caps, authentic headers, callout boxes,
 * 2-column layout, stat-blocks, and print styles ready for PDF conversion.
 */
export function compileFullHandbookHtml(chapters: HandbookChapter[] = HANDBOOK_CHAPTERS): string {
  const chaptersHtml = chapters
    .map((chapter) => {
      const isCover = chapter.number === 0;

      let sectionsHtml = "";
      chapter.sections.forEach((sec, sIdx) => {
        let calloutsHtml = "";
        if (sec.callouts && sec.callouts.length > 0) {
          calloutsHtml = sec.callouts
            .map(
              (c) => `
            <div class="phb-callout phb-callout-${c.type}">
              <div class="phb-callout-header">${escapeHtml(c.title)}</div>
              <div class="phb-callout-content">${c.content}</div>
            </div>`
            )
            .join("\n");
        }

        let tablesHtml = "";
        if (sec.tables && sec.tables.length > 0) {
          tablesHtml = sec.tables
            .map(
              (t) => `
            <div class="phb-table-wrapper">
              ${t.caption ? `<div class="phb-table-caption">${escapeHtml(t.caption)}</div>` : ""}
              <table class="phb-table">
                <thead>
                  <tr>
                    ${t.headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${t.rows
                    .map(
                      (row) => `
                    <tr>
                      ${row.map((cell) => `<td>${cell}</td>`).join("")}
                    </tr>`
                    )
                    .join("")}
                </tbody>
              </table>
            </div>`
            )
            .join("\n");
        }

        let statBlocksHtml = "";
        if (sec.statBlocks && sec.statBlocks.length > 0) {
          statBlocksHtml = `
          <div class="phb-stat-grid">
            ${sec.statBlocks
              .map((sb) => {
                let detailsRows = "";
                if (sb.details) {
                  detailsRows = Object.entries(sb.details)
                    .map(
                      ([k, v]) => `
                    <div class="phb-stat-detail">
                      <span class="phb-stat-key">${escapeHtml(k)}:</span>
                      <span class="phb-stat-val">${escapeHtml(v)}</span>
                    </div>`
                    )
                    .join("");
                }
                return `
              <div class="phb-stat-card">
                <div class="phb-stat-header">
                  <div class="phb-stat-title">${escapeHtml(sb.title)}</div>
                  ${sb.metaBadge ? `<span class="phb-stat-badge">${escapeHtml(sb.metaBadge)}</span>` : ""}
                </div>
                ${sb.subtitle ? `<div class="phb-stat-subtitle">${escapeHtml(sb.subtitle)}</div>` : ""}
                <div class="phb-stat-desc">${escapeHtml(sb.description)}</div>
                ${detailsRows ? `<div class="phb-stat-details-list">${detailsRows}</div>` : ""}
              </div>`;
              })
              .join("\n")}
          </div>`;
        }

        // Apply drop cap to the first paragraph of the first section if not cover
        let leadHtml = "";
        if (sec.leadParagraph) {
          if (!isCover && sIdx === 0) {
            const firstChar = sec.leadParagraph.charAt(0);
            const restText = sec.leadParagraph.slice(1);
            leadHtml = `<p class="phb-lead"><span class="phb-drop-cap">${firstChar}</span>${restText}</p>`;
          } else {
            leadHtml = `<p class="phb-lead">${sec.leadParagraph}</p>`;
          }
        }

        sectionsHtml += `
          <section id="${sec.id}" class="phb-section">
            <h2 class="phb-section-title">${escapeHtml(sec.title)}</h2>
            ${sec.subtitle ? `<div class="phb-section-subtitle">${escapeHtml(sec.subtitle)}</div>` : ""}
            ${leadHtml}
            <div class="phb-section-body">
              ${sec.contentHtml}
            </div>
            ${calloutsHtml}
            ${tablesHtml}
            ${statBlocksHtml}
          </section>
        `;
      });

      return `
      <article id="${chapter.id}" class="phb-chapter ${isCover ? "phb-cover-chapter" : ""}">
        <header class="phb-chapter-header">
          ${chapter.japaneseTitle ? `<div class="phb-kanji-sub">${escapeHtml(chapter.japaneseTitle)}</div>` : ""}
          <div class="phb-chapter-number">${isCover ? "PROLOGUE & INTRODUCTION" : `CHAPTER ${chapter.number}`}</div>
          <h1 class="phb-chapter-title">${escapeHtml(chapter.title)}</h1>
          <div class="phb-chapter-subtitle">${escapeHtml(chapter.subtitle)}</div>
          <div class="phb-header-divider"></div>
        </header>

        <div class="phb-chapter-content">
          ${sectionsHtml}
        </div>
      </article>
      `;
    })
    .join("\n\n");

  return `
  <div class="phb-document">
    ${chaptersHtml}
  </div>
  `;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
