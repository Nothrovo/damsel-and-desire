export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9
};

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

export function calculateAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function calculateProficiencyBonus(level: number): number {
  return level >= 5 ? 3 : 2;
}

export function calculatePointBuyTotal(scores: number[]): number {
  return scores.reduce((sum, score) => {
    const cost = POINT_BUY_COSTS[score];
    if (cost === undefined) throw new Error(`Nilai ${score} di luar rentang Point Buy (8-15).`);
    return sum + cost;
  }, 0);
}

export function isValidStandardArray(scores: number[]): boolean {
  if (scores.length !== 6) return false;
  const sorted = [...scores].sort((a, b) => a - b);
  const expected = [...STANDARD_ARRAY].sort((a, b) => a - b);
  return sorted.every((val, idx) => val === expected[idx]);
}

export function yenToRupiah(yen: number): number {
  return yen * 100;
}

export function rupiahToYen(rupiah: number): number {
  return Math.floor(rupiah / 100);
}
