// Maps the runtime "./challenge/..." image paths to embedded data: URLs in the
// offline (single-file) build, where those local files can't be read through a
// <canvas> over file://. In every other build this is a no-op (empty map), so the
// generated module is tree-shaken out.
export async function getEmbeddedChallengeImages(): Promise<Record<string, string>> {
  if (!import.meta.env.VITE_OFFLINE_BUILD) return {};
  const m = await import('./embeddedAssets.generated');
  return m.challengeImages;
}
