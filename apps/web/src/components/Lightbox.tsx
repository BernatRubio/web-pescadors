/**
 * Full-screen photo viewer (React island) for a static thumbnail grid.
 *
 * The grid is plain HTML rendered by AlbumView: each thumbnail is a link to the full-size
 * photo, so it works without JS and with Cmd/middle-click. The photo data lives once, in
 * the links' data attributes, rather than again in this island's props.
 *
 * Built on the native <dialog>: showModal() traps focus and Esc closes it. Arrow keys and
 * horizontal swipes move between photos; focus returns to the thumbnail on close.
 */
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/** Selector of the element that holds both the thumbnail links and this island. */
export const LIGHTBOX_ROOT = '[data-lightbox]';

interface Photo {
  src: string;
  srcset: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
}

interface Props {
  labels: { close: string; prev: string; next: string; position: string };
}

const SWIPE_THRESHOLD = 50;
const EXIT_MS = 150;

const thumbsIn = (root: Element) =>
  Array.from(root.querySelectorAll<HTMLAnchorElement>('a[data-photo]'));

function readPhoto(link: HTMLAnchorElement): Photo {
  const d = link.dataset;
  return {
    src: link.href,
    srcset: d.srcset ?? '',
    width: Number(d.width) || 0,
    height: Number(d.height) || 0,
    alt: d.alt ?? '',
    caption: d.caption || undefined,
  };
}

export default function Lightbox({ labels }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<HTMLAnchorElement[]>([]);
  const lastOpened = useRef(0);
  const swipeStart = useRef<number | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState(0);

  const count = photos.length;
  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const dialog = dialogRef.current;
    const root = dialog?.closest(LIGHTBOX_ROOT);
    if (!dialog || !root) return;

    thumbs.current = thumbsIn(root);
    setPhotos(thumbs.current.map(readPhoto));

    const onClick = (event: MouseEvent) => {
      // Let Cmd/Ctrl/Shift/middle-click open the photo in a new tab as usual.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element).closest<HTMLAnchorElement>('a[data-photo]');
      const i = link ? thumbs.current.indexOf(link) : -1;
      if (i < 0) return;
      event.preventDefault();
      lastOpened.current = i;
      setIndex(i);
      dialog.showModal();
    };
    const onClose = () => thumbs.current[lastOpened.current]?.focus();

    root.addEventListener('click', onClick as EventListener);
    dialog.addEventListener('close', onClose);
    return () => {
      root.removeEventListener('click', onClick as EventListener);
      dialog.removeEventListener('close', onClose);
    };
  }, []);

  /** Plays the exit animation (DESIGN.md → surface-exit) before closing. */
  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return dialog.close();
    dialog.dataset.closing = '';
    window.setTimeout(() => {
      delete dialog.dataset.closing;
      dialog.close();
    }, EXIT_MS);
  };

  const onKeyDown = (event: KeyboardEvent) => {
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
    <dialog
      ref={dialogRef}
      onKeyDown={onKeyDown}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-label={position}
      className="lightbox m-0 h-dvh max-h-none w-dvw max-w-none bg-black p-0 text-white backdrop:bg-black"
    >
      {photo && (
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between gap-md p-md">
            <p className="text-label-md font-semibold" aria-live="polite">
              {position}
            </p>
            <button type="button" onClick={close} className="button-outline">
              {labels.close}
            </button>
          </div>
          <figure
            className="flex min-h-0 flex-1 touch-pan-y flex-col items-center justify-center px-md"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <img
              key={photo.src}
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
              <button type="button" onClick={() => go(-1)} className="button-outline">
                {labels.prev}
              </button>
              <button type="button" onClick={() => go(1)} className="button-outline">
                {labels.next}
              </button>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
