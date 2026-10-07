import type { Character } from "../types";

export function exportCharacterJson(character: Character) {
  const exportPayload = {
    _schema: "damsel_and_desire_v2",
    exportedAt: new Date().toISOString(),
    character
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${character.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_DamselAndDesire.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function validateCharacterJson(jsonObj: any): { valid: boolean; error?: string; data?: any } {
  if (!jsonObj) return { valid: false, error: "File JSON kosong atau tidak terbaca." };

  // Handle v2 format
  if (jsonObj._schema === "damsel_and_desire_v2" && jsonObj.character) {
    const c = jsonObj.character;
    if (!c.name || !c.abilities) return { valid: false, error: "Karakter tidak memiliki nama atau kemampuan dasar." };
    return { valid: true, data: c };
  }

  // Handle v1 format (legacy)
  if (jsonObj.name && (jsonObj.baseAbilities || jsonObj.abilities)) {
    return { valid: true, data: jsonObj };
  }

  return { valid: false, error: "Format berkas JSON bukan karakter Damsel & Desire yang valid." };
}

export function triggerPrintCharacterSheet() {
  window.print();
}
