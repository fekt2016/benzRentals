export const getPublicUrl = (path) => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  if (import.meta.env.MODE === "development") {
    return `/${cleanPath}`;
  }

  const vercelUrl = import.meta.env.VITE_VERCEL_URL;
  const publicUrl = import.meta.env.VITE_PUBLIC_URL;

  if (vercelUrl) return `https://${vercelUrl}/${cleanPath}`;
  if (publicUrl) return `${publicUrl}/${cleanPath}`;

  return `/${cleanPath}`;
};
