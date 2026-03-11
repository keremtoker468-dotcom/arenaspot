"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VideoUpload() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);

      const res = await fetch("/api/videos/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Yükleme başarısız");
      }

      setTitle("");
      setFile(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleUpload}
      className="mt-4 rounded-[12px] border border-dashed border-border p-4"
    >
      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video başlığı"
          required
          className="w-full rounded-[8px] border border-border px-3 py-2 font-body text-sm outline-none focus:border-accent"
        />
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
          className="block w-full font-body text-sm text-muted file:mr-3 file:rounded-[8px] file:border-0 file:bg-accent file:px-3 file:py-[6px] file:text-sm file:font-semibold file:text-white hover:file:bg-accent-dark"
        />
      </div>

      {error && (
        <p className="mt-2 font-body text-sm text-accent">{error}</p>
      )}

      <button
        type="submit"
        disabled={uploading || !file || !title}
        className="mt-3 rounded-[8px] bg-accent px-4 py-2 font-heading text-sm font-bold text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
      >
        {uploading ? "Yükleniyor..." : "Video Yükle"}
      </button>
    </form>
  );
}
