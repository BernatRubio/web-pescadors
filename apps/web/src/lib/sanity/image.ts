import { createImageUrlBuilder, isImageWithAsset } from '@sanity/image-url';
import { sanityProject } from './client';

const builder = createImageUrlBuilder(sanityProject);

type ImageSource = Parameters<typeof builder.image>[0];
type ImageLike = Parameters<typeof isImageWithAsset>[0];

const WIDTHS = [400, 640, 960, 1280, 1600, 2000];

export interface ResponsiveImage {
  src: string;
  srcset: string;
  width: number;
  height: number;
}

/**
 * Responsive image URLs from the Sanity image CDN (WebP/AVIF via `auto('format')`),
 * respecting the editor's crop and hotspot. `ratio` is width / height, e.g. 16 / 9.
 */
export function responsiveImage(
  source: unknown,
  { width = 1280, ratio }: { width?: number; ratio?: number } = {},
): ResponsiveImage | null {
  if (!source || !isImageWithAsset(source as ImageLike)) return null;
  const image = source as ImageSource;
  const sized = (w: number) => {
    const b = builder.image(image).width(w).auto('format').quality(80).fit('crop');
    return ratio ? b.height(Math.round(w / ratio)) : b;
  };
  const height = ratio ? Math.round(width / ratio) : Math.round(width * 0.66);
  return {
    src: sized(width).url(),
    srcset: WIDTHS.filter((w) => w <= width * 2)
      .map((w) => `${sized(w).url()} ${w}w`)
      .join(', '),
    width,
    height,
  };
}

/** Display width for an image shown `height` px tall, from its stored proportions. */
export function widthAtHeight(source: unknown, height: number): number | undefined {
  const ratio = (source as { asset?: { metadata?: { dimensions?: { aspectRatio?: number } } } })
    ?.asset?.metadata?.dimensions?.aspectRatio;
  return ratio ? Math.round(height * ratio) : undefined;
}

/** A single URL, e.g. for logos or Open Graph images. */
export function imageUrl(source: unknown, width: number): string | null {
  if (!source || !isImageWithAsset(source as ImageLike)) return null;
  return builder
    .image(source as ImageSource)
    .width(width)
    .auto('format')
    .url();
}
