/** The 11-character video id of a YouTube URL (watch, youtu.be, embed or shorts), or null. */
export function youtubeId(url: string | null | undefined): string | null {
  const match = url?.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return match?.[1] ?? null;
}
