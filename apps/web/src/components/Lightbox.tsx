/**
 * Photo grid + full-screen viewer (React island).
 * Built on the native <dialog>: showModal() traps focus and Esc closes it.
 * Arrow keys and horizontal swipes move between photos; focus returns to the thumbnail.
 */
import { type PointerEvent, useCallback, useEffect, useRef, useState } from 'react';

export interface LightboxPhoto {
  key: string;
  src: string;
  srcset: string;
  thumbSrc: string;
  thumbSrcset: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  lqip?: string;
}

interface Props {
  photos: LightboxPhoto[];
  labels: { close: string; prev: string; next: string; position: string };
}

const SWIPE_THRESHOLD = 50;

export default function Lightbox({ photos, labels }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lastOpened = useRef(0);
  const swipeStart = useRef<number | null>(null);
  const [index, setIndex] = useState(0);

  const count = photos.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  const open = (i: number) => {
    lastOpened.current = i;
    setIndex(i);
    dialogRef.current?.showModal();
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => thumbRefs.current[lastOpened.current]?.focus();
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, []);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowRight') go(1);
    if (event.key === 'ArrowLeft') go(-1);
  };

  const onPointerDown = (event: PointerEvent) => {
    swipeStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(dx) > SWIPE_THRESHOLD) go(dx < 0 ? 1 : -1);
  };

  const photo = photos[index];
  const position = labels.position.replace('{n}', `${index + 1} / ${count}`);

  return (
    <>
      <ul className="grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((p, i) => (
          <li key={p.key}>
            <button
              type="button"
              ref={(el) => {
                thumbRefs.current[i] = el;
              }}
              onClick={() => open(i)}
              className="block w-full cursor-zoom-in"
              aria-label={p.alt || labels.position.replace('{n}', String(i + 1))}
            >
              <img
                src={p.thumbSrc}
                srcSet={p.thumbSrcset}
                sizes="(min-width: 64rem) 25vw, (min-width: 40rem) 33vw, 50vw"
                alt=""
                loading="lazy"
                decoding="async"
                width={480}
                height={480}
                className="aspect-square w-full bg-neutral object-cover"
                style={
                  p.lqip
                    ? { backgroundImage: `url(${p.lqip})`, backgroundSize: 'cover' }
                    : undefined
                }
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        onKeyDown={onKeyDown}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        aria-label={position}
        className="lightbox m-0 h-dvh max-h-none w-dvw max-w-none bg-black p-0 text-white backdrop:bg-black"
      >
        {photo && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-md p-md">
              <p className="text-label-md font-semibold" aria-live="polite">
                {position}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="lightbox-button"
              >
                {labels.close}
              </button>
            </div>
            <figure
              className="flex min-h-0 flex-1 touch-pan-y flex-col items-center justify-center px-md"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <img
                key={photo.key}
                src={photo.src}
                srcSet={photo.srcset}
                sizes="100vw"
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                className="max-h-full w-auto max-w-full object-contain select-none"
                draggable={false}
              />
              {photo.caption && (
                <figcaption className="mt-sm text-center">{photo.caption}</figcaption>
              )}
            </figure>
            {count > 1 && (
              <div className="flex justify-between gap-md p-md">
                <button type="button" onClick={() => go(-1)} className="lightbox-button">
                  {labels.prev}
                </button>
                <button type="button" onClick={() => go(1)} className="lightbox-button">
                  {labels.next}
                </button>
              </div>
            )}
          </div>
        )}
      </dialog>
    </>
  );
}
