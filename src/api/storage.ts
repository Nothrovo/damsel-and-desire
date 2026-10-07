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

  const fileExt = file.name.split(".").pop() || "png";
  const fileName = `${userId}_${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true
    });

  if (uploadError) {
    // If bucket does not exist or storage is not set up, provide clear error
    console.warn("Storage upload error:", uploadError);
    throw new Error(`Gagal mengunggah foto ke storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
