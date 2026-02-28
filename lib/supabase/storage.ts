import { createClient } from "./client";

const BUCKET = "project-media";

function convertToWebP(file: File, quality = 0.85): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context unavailable"));
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("WebP conversion failed"))),
        "image/webp",
        quality
      );
    };
    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export async function uploadProjectImage(
  file: File,
  projectSlug: string
): Promise<string> {
  const supabase = createClient();
  const webpBlob = await convertToWebP(file);
  const path = `${projectSlug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, webpBlob, {
    contentType: "image/webp",
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(error.message);
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

export async function deleteProjectImage(publicUrl: string): Promise<void> {
  const supabase = createClient();

  // Extract the path after the bucket name from the public URL
  const url = new URL(publicUrl);
  const pathParts = url.pathname.split(`/${BUCKET}/`);
  if (pathParts.length < 2) return;

  const filePath = pathParts[1];
  await supabase.storage.from(BUCKET).remove([filePath]);
}
