export function renderCardSkeleton(count: number = 3): string {
  let html = "";
  for (let i = 0; i < count; i++) {
    html += `
      <div class="roster-card skeleton-card">
        <div class="skeleton-shimmer" style="height: 120px; border-radius: 8px; margin-bottom: 12px;"></div>
        <div class="skeleton-shimmer" style="height: 20px; width: 60%; margin-bottom: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 14px; width: 40%; margin-bottom: 14px;"></div>
        <div class="skeleton-shimmer" style="height: 36px; width: 100%; border-radius: 6px;"></div>
      </div>
    `;
  }
  return html;
}

export function renderSheetSkeleton(): string {
  return `
    <div class="sheet-container skeleton-sheet">
      <div class="skeleton-shimmer" style="height: 180px; border-radius: 12px; margin-bottom: 24px;"></div>
      <div style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; margin-bottom: 24px;">
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
        <div class="skeleton-shimmer" style="height: 90px; border-radius: 8px;"></div>
      </div>
      <div class="skeleton-shimmer" style="height: 340px; border-radius: 12px;"></div>
    </div>
  `;
}
