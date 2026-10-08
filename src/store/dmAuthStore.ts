import { dmLogin, dmLogout, dmVerifySession } from "../api/codex";

const SESSION_STORAGE_KEY = "codex_dm_session_token";
const SESSION_EXPIRES_KEY = "codex_dm_session_expires";

type Listener = () => void;

class DmAuthStore {
  private token: string | null = null;
  private expiresAt: string | null = null;
  private listeners: Listener[] = [];
  public isPlayerPreview: boolean = false; // DM feature: "Lihat sebagai pemain"

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedToken = sessionStorage.getItem(SESSION_STORAGE_KEY);
      const storedExpires = sessionStorage.getItem(SESSION_EXPIRES_KEY);
      if (storedToken) {
        // Cek apakah sudah expired
        if (storedExpires && new Date(storedExpires).getTime() <= Date.now()) {
          this.clearStorage();
        } else {
          this.token = storedToken;
          this.expiresAt = storedExpires;
        }
      }
    } catch (e) {
      this.token = null;
    }
  }

  private saveToStorage(token: string, expiresAt: string) {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, token);
      sessionStorage.setItem(SESSION_EXPIRES_KEY, expiresAt);
      this.token = token;
      this.expiresAt = expiresAt;
    } catch (e) {
      console.warn("Gagal menyimpan token ke sessionStorage:", e);
    }
  }

  private clearStorage() {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_EXPIRES_KEY);
    } catch (e) {
      // ignore
    }
    this.token = null;
    this.expiresAt = null;
    this.isPlayerPreview = false;
  }

  public isAuthenticated(): boolean {
    if (!this.token) return false;
    if (this.expiresAt && new Date(this.expiresAt).getTime() <= Date.now()) {
      this.clearStorage();
      return false;
    }
    return true;
  }

  public isDmActive(): boolean {
    return this.isAuthenticated() && !this.isPlayerPreview;
  }

  public getToken(): string | null {
    return this.isAuthenticated() ? this.token : null;
  }

  public togglePlayerPreview(): boolean {
    this.isPlayerPreview = !this.isPlayerPreview;
    this.notify();
    return this.isPlayerPreview;
  }

  public async login(password: string): Promise<{ success: boolean; error?: string }> {
    const res = await dmLogin(password);
    if (res.success && res.session_token) {
      const expires = res.expires_at || new Date(Date.now() + 12 * 3600 * 1000).toISOString();
      this.saveToStorage(res.session_token, expires);
      this.notify();
      return { success: true };
    }
    return { success: false, error: res.error || "Kata sandi salah" };
  }

  public async logout(): Promise<void> {
    if (this.token) {
      await dmLogout(this.token);
    }
    this.clearStorage();
    this.notify();
  }

  public async verify(): Promise<boolean> {
    if (!this.token) return false;
    const isValid = await dmVerifySession(this.token);
    if (!isValid) {
      this.clearStorage();
      this.notify();
      return false;
    }
    return true;
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }
}

export const dmAuthStore = new DmAuthStore();
