/** Public HTTPS URL of this deployment (Circles playground, Garage, share links). */
export function getAppOrigin(): string {
  const fromEnv = import.meta.env.VITE_APP_URL as string | undefined;
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "http://localhost:5173";
}

export function getCirclesPlaygroundUrl(): string {
  const origin = getAppOrigin();
  const appUrl = `${origin}/`;
  return `https://circles.gnosis.io/playground?url=${encodeURIComponent(appUrl)}`;
}
