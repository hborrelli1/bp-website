import NextImage from 'next/image';

const CONTENTFUL_IMAGE_HOSTS = new Set([
  'images.ctfassets.net',
  'images.eu.ctfassets.net',
]);
const TRANSFORMABLE_IMAGE_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

const getContentfulImageUrl = (src) => {
  if (
    typeof src !== 'string'
    || (!/^https?:\/\//i.test(src) && !src.startsWith('//'))
  ) {
    return null;
  }

  try {
    const url = new URL(src, 'https://images.ctfassets.net');
    return CONTENTFUL_IMAGE_HOSTS.has(url.hostname) ? url : null;
  } catch {
    return null;
  }
};

const isTransformableContentfulImage = (src) => {
  const url = getContentfulImageUrl(src);
  return Boolean(url && TRANSFORMABLE_IMAGE_EXTENSION.test(url.pathname));
};

const contentfulImageLoader = ({ src, width, quality }) => {
  const url = getContentfulImageUrl(src);
  if (!url || !TRANSFORMABLE_IMAGE_EXTENSION.test(url.pathname)) {
    throw new Error(`Unsupported Contentful image URL: ${src}`);
  }

  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 75));
  url.searchParams.set('fm', 'webp');

  return url.toString();
};

export default function ContentfulImage({ src, loader, unoptimized, ...props }) {
  const useContentfulLoader = isTransformableContentfulImage(src);
  const isLocalAsset = typeof src === 'string' && src.startsWith('/');
  const isUnsupportedContentfulAsset = Boolean(getContentfulImageUrl(src)) && !useContentfulLoader;

  return (
    <NextImage
      {...props}
      src={src}
      loader={useContentfulLoader ? contentfulImageLoader : loader}
      unoptimized={unoptimized ?? (isLocalAsset || isUnsupportedContentfulAsset)}
    />
  );
}
