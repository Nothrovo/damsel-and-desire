import { getCampaign, getCampaignMembers, getUserRoleInCampaign } from "../api/campaigns";
import type { Campaign, CampaignMember } from "../types";

class CampaignStore {
  activeCampaign: Campaign | null = null;
  members: CampaignMember[] = [];
  userRole: 'dm' | 'player' | null = null;
  loading: boolean = false;
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

  async setActiveCampaign(campaignId: string | null) {
    if (!campaignId) {
      this.activeCampaign = null;
      this.members = [];
      this.userRole = null;
      this.notify();
      return;
    }

    this.loading = true;
    this.notify();

    try {
      this.activeCampaign = await getCampaign(campaignId);
      if (this.activeCampaign) {
        this.members = await getCampaignMembers(campaignId);
        this.userRole = await getUserRoleInCampaign(campaignId);
      } else {
        this.members = [];
        this.userRole = null;
      }
    } catch (err) {
      console.error("Gagal memuat detail campaign:", err);
    } finally {
      this.loading = false;
      this.notify();
    }
  }

  isDm(): boolean {
    return this.userRole === 'dm';
  }
}

export const campaignStore = new CampaignStore();
