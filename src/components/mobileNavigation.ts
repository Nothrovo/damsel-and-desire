export function setMobileNavigationOpen(
  navigation: HTMLElement,
  toggle: HTMLButtonElement,
  open: boolean
): void {
  navigation.classList.toggle("is-open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Tutup navigasi" : "Buka navigasi");
}
