const DICEBEAR_PIXEL_ART_BASE = 'https://api.dicebear.com/10.x/pixel-art/svg';

export function buildDicebearAvatarUrl(name: string): string {
  const seed = name.trim() || 'usuario';
  const url = new URL(DICEBEAR_PIXEL_ART_BASE);
  url.searchParams.set('seed', seed);
  return url.toString();
}
