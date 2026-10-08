import { supabase } from "../api/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

export type CodexRealtimePayload = {
  eventType: "INSERT" | "UPDATE" | "DELETE";
  new: {
    character_id?: string;
    section_key?: string;
    revealed_at?: string;
    revealed_by?: string;
  };
  old: {
    character_id?: string;
    section_key?: string;
  };
};

type CodexRevealListener = (payload: CodexRealtimePayload) => void;

class CodexRealtimeManager {
  private channel: RealtimeChannel | null = null;
  private listeners: Set<CodexRevealListener> = new Set();
  private isSubscribed: boolean = false;

  public subscribe(listener: CodexRevealListener): () => void {
    this.listeners.add(listener);
    this.ensureConnection();

    return () => {
      this.listeners.delete(listener);
      if (this.listeners.size === 0) {
        this.teardown();
      }
    };
  }

  private ensureConnection() {
    if (this.isSubscribed && this.channel) return;

    try {
      this.channel = supabase
        .channel("public_codex_reveals_feed")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "codex_reveals"
          },
          (payload: any) => {
            this.notifyListeners(payload as CodexRealtimePayload);
          }
        )
        .subscribe((status) => {
          if (status === "SUBSCRIBED") {
            this.isSubscribed = true;
          }
        });
    } catch (e) {
      console.warn("Gagal mengaktifkan Supabase Realtime untuk codex_reveals:", e);
    }
  }

  private notifyListeners(payload: CodexRealtimePayload) {
    this.listeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error("Error dalam realtime listener:", err);
      }
    });
  }

  private teardown() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.isSubscribed = false;
    }
  }
}

export const codexRealtime = new CodexRealtimeManager();

/**
 * Memicu animasi pendaran sakura dan aura emas pada elemen yang baru terbuka.
 * Otomatis menghormati prefers-reduced-motion pengguna.
 */
export function triggerSakuraUnlockAnimation(element: HTMLElement | null) {
  if (!element) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) {
    element.style.borderColor = "var(--rose-primary)";
    return;
  }

  element.classList.remove("sakura-unlock-glow");
  // Reflow to restart animation if already applied
  void element.offsetWidth;
  element.classList.add("sakura-unlock-glow");

  // Buat partikel kelopak bunga sakura melayang sebentar di sekitar kartu
  createSakuraPetals(element);

  setTimeout(() => {
    element.classList.remove("sakura-unlock-glow");
  }, 3500);
}

function createSakuraPetals(container: HTMLElement) {
  const count = 7;
  const petalContainer = document.createElement("div");
  petalContainer.className = "sakura-particles-container";
  petalContainer.style.position = "absolute";
  petalContainer.style.inset = "0";
  petalContainer.style.pointerEvents = "none";
  petalContainer.style.overflow = "hidden";
  petalContainer.style.zIndex = "20";

  for (let i = 0; i < count; i++) {
    const petal = document.createElement("span");
    petal.innerHTML = "🌸";
    petal.style.position = "absolute";
    petal.style.fontSize = `${Math.floor(Math.random() * 8 + 12)}px`;
    petal.style.left = `${Math.floor(Math.random() * 80 + 10)}%`;
    petal.style.top = "80%";
    petal.style.opacity = "0.9";
    petal.style.transition = `all ${1.5 + Math.random() * 1.5}s cubic-bezier(0.25, 1, 0.5, 1)`;

    petalContainer.appendChild(petal);

    setTimeout(() => {
      petal.style.top = `${Math.floor(Math.random() * 20 - 30)}%`;
      petal.style.transform = `translateX(${(Math.random() - 0.5) * 80}px) rotate(${Math.random() * 360}deg)`;
      petal.style.opacity = "0";
    }, 50 + i * 80);
  }

  container.appendChild(petalContainer);
  setTimeout(() => {
    petalContainer.remove();
  }, 3000);
}
