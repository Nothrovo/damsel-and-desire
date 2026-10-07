import { getCurrentUser, getProfile, onAuthStateChange } from "../api/auth";
import type { Profile } from "../types";

class AuthStore {
  user: any = null;
  profile: Profile | null = null;
  loading: boolean = true;
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  async init() {
    this.loading = true;
    try {
      this.user = await getCurrentUser();
      if (this.user) {
        this.profile = await getProfile(this.user.id);
      }
    } catch (err) {
      console.warn("Auth initialization warning:", err);
    } finally {
      this.loading = false;
      this.notify();
    }

    onAuthStateChange(async (_event, session) => {
      this.user = session?.user || null;
      if (this.user) {
        this.profile = await getProfile(this.user.id);
      } else {
        this.profile = null;
      }
      this.loading = false;
      this.notify();
    });
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  isAuthenticated(): boolean {
    return !!this.user;
  }
}

export const authStore = new AuthStore();
