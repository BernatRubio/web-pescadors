/**
 * Click-to-load YouTube video. Nothing is requested from YouTube/Google until the visitor
 * presses play (privacy + speed), then the privacy-enhanced embed is loaded.
 */
import { useState } from 'react';

interface Props {
  url: string;
  title: string;
  labels: { play: string; note: string };
}

function youtubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
  return match?.[1] ?? null;
}

export default function VideoFacade({ url, title, labels }: Props) {
  const [playing, setPlaying] = useState(false);
  const id = youtubeId(url);

  if (!id) {
    return <a href={url}>{title}</a>;
  }

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="flex aspect-video w-full flex-col items-start justify-end gap-xs bg-secondary p-md text-left text-on-secondary transition-colors hover:bg-secondary-light"
    >
      <span className="headline-md">{title}</span>
      <span className="text-label-md font-semibold">
        {labels.play}. {labels.note}
      </span>
    </button>
  );
}
