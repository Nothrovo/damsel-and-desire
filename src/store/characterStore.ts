import type { Character } from "../types";

class CharacterStore {
  currentCharacter: Character | null = null;
  loading: boolean = false;
  hasConflict: boolean = false;
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  setCurrentCharacter(char: Character | null) {
    this.currentCharacter = char;
    this.hasConflict = false;
    this.notify();
  }

  async runOptimisticUpdate(
    optimisticMutator: (draft: Character) => void,
    remoteCall: () => Promise<any>
  ) {
    if (!this.currentCharacter) return;

    // Snapshot for rollback
    const snapshot = JSON.parse(JSON.stringify(this.currentCharacter));

    try {
      // 1. Optimistic local mutation
      optimisticMutator(this.currentCharacter);
      this.notify();

      // 2. Execute remote call
      const updatedData = await remoteCall();

      // 3. Reconcile with remote server response
      if (updatedData && updatedData.vitals) {
        this.currentCharacter.vitals = updatedData.vitals;
      }
      if (updatedData && updatedData.finances) {
        this.currentCharacter.finances = updatedData.finances;
      }
      if (updatedData && updatedData.newVersion) {
        this.currentCharacter.version = updatedData.newVersion;
      } else if (updatedData && updatedData.version) {
        this.currentCharacter = updatedData;
      }
      this.hasConflict = false;
      this.notify();
    } catch (err: any) {
      console.error("Optimistic update error, rolling back:", err);
      // Rollback
      this.currentCharacter = snapshot;
      if (err.message && err.message.includes("ERR_CONCURRENCY_CONFLICT")) {
        this.hasConflict = true;
      }
      this.notify();
      throw err;
    }
  }
}

export const characterStore = new CharacterStore();
