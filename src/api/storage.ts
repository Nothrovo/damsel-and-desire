import { supabase } from "./supabase";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Format berkas tidak didukung. Harap gunakan format JPG, PNG, WEBP, atau GIF.");
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Ukuran berkas melebihi batas maksimal 2MB.");
  }

  const fileExt = (file.name.split(".").pop() || "png").toLowerCase();
  const fileName = `player_${userId}_${Date.now()}.${fileExt}`;

  // Coba unggah ke bucket codex-assets (default di Supabase) atau avatars
  const primaryBucket = "codex-assets";
  const primaryPath = `player-avatars/${fileName}`;

  let finalBucket = primaryBucket;
  let finalPath = primaryPath;

  const { error: primaryError } = await supabase.storage
    .from(primaryBucket)
    .upload(primaryPath, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type
    });

  if (primaryError) {
    // Jika bucket primary gagal (misal bucket not found), fallback ke bucket 'avatars'
    const fallbackBucket = "avatars";
    const fallbackPath = `${fileName}`;
    const { error: fallbackError } = await supabase.storage
      .from(fallbackBucket)
      .upload(fallbackPath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      });

    if (fallbackError) {
      console.warn("Storage upload error:", primaryError, fallbackError);
      throw new Error(`Gagal mengunggah foto ke storage: ${primaryError.message || fallbackError.message}`);
    }

    finalBucket = fallbackBucket;
    finalPath = fallbackPath;
  }

  const { data } = supabase.storage
    .from(finalBucket)
    .getPublicUrl(finalPath);

  return data.publicUrl;
}

