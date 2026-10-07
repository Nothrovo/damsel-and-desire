import { supabase } from "./supabase";
import type { Campaign, CampaignMember } from "../types";

function generateJoinCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function listMyCampaigns(): Promise<Campaign[]> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return [];

  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil daftar campaign:", error);
    throw error;
  }
  return (data || []) as Campaign[];
}

export async function getCampaign(campaignId: string): Promise<Campaign | null> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  if (error) {
    console.error("Campaign tidak ditemukan:", error);
    return null;
  }
  return data as Campaign;
}

export async function createCampaign(name: string): Promise<Campaign> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) throw new Error("Anda harus login untuk membuat campaign.");

  const joinCode = generateJoinCode();

  const { data: campaign, error: campError } = await supabase
    .from("campaigns")
    .insert({
      name: name.trim(),
      join_code: joinCode,
      owner_id: user.user.id
    })
    .select()
    .single();

  if (campError) throw campError;

  // Add owner as DM in campaign_members
  const { error: memberError } = await supabase
    .from("campaign_members")
    .insert({
      campaign_id: campaign.id,
      user_id: user.user.id,
      role: "dm"
    });

  if (memberError) console.warn("Peringatan saat mendaftarkan DM:", memberError);

  return campaign as Campaign;
}

export async function joinCampaignByCode(joinCode: string): Promise<{ campaignId: string; name: string; role: string }> {
  const { data, error } = await supabase.rpc("join_campaign_by_code", {
    p_join_code: joinCode.trim().toUpperCase()
  });

  if (error) throw error;
  return data;
}

export async function getCampaignMembers(campaignId: string): Promise<CampaignMember[]> {
  const { data, error } = await supabase
    .from("campaign_members")
    .select("campaign_id, user_id, role, joined_at, profile:profiles(*)")
    .eq("campaign_id", campaignId);

  if (error) throw error;

  return (data || []).map((row: any) => ({
    campaign_id: row.campaign_id,
    user_id: row.user_id,
    role: row.role,
    joined_at: row.joined_at,
    profile: row.profile
  })) as CampaignMember[];
}

export async function getUserRoleInCampaign(campaignId: string): Promise<'dm' | 'player' | null> {
  const { data: user } = await supabase.auth.getUser();
  if (!user?.user) return null;

  const { data, error } = await supabase
    .from("campaign_members")
    .select("role")
    .eq("campaign_id", campaignId)
    .eq("user_id", user.user.id)
    .single();

  if (error || !data) return null;
  return data.role as 'dm' | 'player';
}
