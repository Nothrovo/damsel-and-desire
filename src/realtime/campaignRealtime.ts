import { supabase } from "../api/supabase";
import type { Character, RollLogEntry, CharacterSecret } from "../types";

export interface CampaignRealtimeHandlers {
  onCharacterChange?: (event: 'INSERT' | 'UPDATE' | 'DELETE', character: Character, oldId?: string) => void;
  onRollLog?: (entry: RollLogEntry) => void;
  onSecretChange?: (secret: CharacterSecret) => void;
}

export class CampaignRealtimeManager {
  private channel: any = null;
  private campaignId: string | null = null;

  subscribe(
    campaignId: string,
    isDm: boolean,
    handlers: CampaignRealtimeHandlers
  ) {
    this.unsubscribe();
    this.campaignId = campaignId;

    const channelName = `campaign:${campaignId}:events`;
    this.channel = supabase.channel(channelName);

    // 1. Listen to Characters changes in this campaign
    this.channel.on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "characters",
        filter: `campaign_id=eq.${campaignId}`
      },
      (payload: any) => {
        if (!handlers.onCharacterChange) return;
        if (payload.eventType === "INSERT") {
          handlers.onCharacterChange("INSERT", payload.new as Character);
        } else if (payload.eventType === "UPDATE") {
          handlers.onCharacterChange("UPDATE", payload.new as Character);
        } else if (payload.eventType === "DELETE") {
          handlers.onCharacterChange("DELETE", payload.old as Character, payload.old?.id);
        }
      }
    );

    // 2. Listen to shared dice rolls in this campaign
    this.channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "roll_log",
        filter: `campaign_id=eq.${campaignId}`
      },
      (payload: any) => {
        if (handlers.onRollLog && payload.new) {
          handlers.onRollLog(payload.new as RollLogEntry);
        }
      }
    );

    // 3. ONLY if authenticated user is DM: listen to character_secrets updates
    if (isDm) {
      this.channel.on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "character_secrets",
          filter: `campaign_id=eq.${campaignId}`
        },
        (payload: any) => {
          if (handlers.onSecretChange && payload.new) {
            handlers.onSecretChange(payload.new as CharacterSecret);
          }
        }
      );
    }

    this.channel.subscribe((status: string) => {
      console.log(`[Realtime] Campaign ${campaignId} subscription status:`, status);
    });
  }

  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.campaignId = null;
    }
  }
}

export const campaignRealtime = new CampaignRealtimeManager();
