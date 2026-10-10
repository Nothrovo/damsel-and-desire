import { describe, it, expect, vi } from "vitest";
import { uploadAvatar } from "../src/api/storage";

describe("uploadAvatar validation", () => {
  it("rejects unsupported MIME types", async () => {
    const invalidFile = new File(["dummy"], "malicious.exe", { type: "application/x-msdownload" });
    await expect(uploadAvatar(invalidFile, "user123")).rejects.toThrow("Format berkas tidak didukung");
  });

  it("rejects files exceeding 2MB", async () => {
    // 2.5MB payload
    const largeBlob = new Blob([new Uint8Array(2.5 * 1024 * 1024)], { type: "image/png" });
    const largeFile = new File([largeBlob], "huge_avatar.png", { type: "image/png" });
    await expect(uploadAvatar(largeFile, "user123")).rejects.toThrow("Ukuran berkas melebihi batas maksimal 2MB");
  });
});
