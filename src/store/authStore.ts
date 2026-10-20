// Auth store disederhanakan: semua visitor adalah "player" — tidak perlu akun Supabase.
// DM auth ditangani secara terpisah oleh dmAuthStore.ts (password DM).
import type { Profile } from "../types";

class AuthStore {
  user: any = null;
  profile: Profile | null = null;
  loading: boolean = false;
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Selalu true — semua visitor adalah player yang valid, tanpa perlu login
  isAuthenticated(): boolean {
    return true;
  }
}

export const authStore = new AuthStore();
