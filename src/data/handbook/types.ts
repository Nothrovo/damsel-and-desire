export interface HandbookCallout {
  type: "note" | "rule" | "tip" | "danger" | "example";
  title: string;
  content: string; // Markdown or HTML snippet
}

export interface HandbookTable {
  caption?: string;
  headers: string[];
  rows: string[][];
}

export interface HandbookStatBlock {
  title: string;
  subtitle?: string;
  metaBadge?: string;
  description: string;
  details?: Record<string, string>;
}

export interface HandbookSection {
  id: string;
  title: string;
  subtitle?: string;
  leadParagraph?: string;
  contentHtml: string;
  callouts?: HandbookCallout[];
  tables?: HandbookTable[];
  statBlocks?: HandbookStatBlock[];
}

export interface HandbookChapter {
  id: string;
  number: number; // 0 for intro/cover, 1..11 for chapters
  japaneseTitle?: string;
  title: string;
  subtitle: string;
  summary: string;
  leadParagraph: string;
  sections: HandbookSection[];
}
