import { timingSafeEqual } from 'crypto';

const WEBHOOK_SECRET_HEADER = 'x-contentful-webhook-secret';
const CONTENTFUL_TOPIC_HEADER = 'x-contentful-topic';
const SUPPORTED_TOPICS = new Set([
  'ContentManagement.Entry.publish',
  'ContentManagement.Entry.unpublish',
]);
const MAX_SLUG_LENGTH = 200;

function hasValidSecret(providedSecret, expectedSecret) {
  if (typeof providedSecret !== 'string' || !providedSecret || !expectedSecret) {
    return false;
  }

  const provided = Buffer.from(providedSecret, 'utf8');
  const expected = Buffer.from(expectedSecret, 'utf8');
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

function getSlugs(entry) {
  const slugField = entry?.fields?.slug;
  const candidates = typeof slugField === 'string'
    ? [slugField]
    : slugField && typeof slugField === 'object'
      ? Object.values(slugField)
      : [];
  const slugs = [...new Set(candidates.filter(value => typeof value === 'string'))];

  if (
    slugs.length === 0
    || slugs.some(slug => (
      !slug
      || slug.length > MAX_SLUG_LENGTH
      || slug === '.'
      || slug === '..'
      || /[/\\?#%\u0000-\u001f\u007f]/u.test(slug)
      || slug.trim() !== slug
    ))
  ) {
    throw new Error('Webhook entry must include a valid slug');
  }

  return slugs;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const expectedSecret = process.env.CONTENTFUL_REVALIDATION_SECRET;
  if (!expectedSecret) {
    console.error('Contentful revalidation endpoint is missing CONTENTFUL_REVALIDATION_SECRET');
    return res.status(500).json({ message: 'Revalidation endpoint is not configured' });
  }

  if (!hasValidSecret(req.headers[WEBHOOK_SECRET_HEADER], expectedSecret)) {
    return res.status(401).json({ message: 'Invalid webhook credentials' });
  }

  const topic = req.headers[CONTENTFUL_TOPIC_HEADER];
  if (typeof topic !== 'string' || !SUPPORTED_TOPICS.has(topic)) {
    return res.status(400).json({ message: 'Unsupported or missing Contentful event topic' });
  }

  const contentType = req.body?.sys?.contentType?.sys?.id;
  if (contentType !== 'blog') {
    return res.status(400).json({ message: 'Unsupported Contentful content type' });
  }

  let slugs;
  try {
    slugs = getSlugs(req.body);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }

  const paths = [
    '/news',
    '/',
    ...slugs.map(slug => `/news/${encodeURIComponent(slug)}`),
  ];
  const results = await Promise.allSettled(paths.map(path => res.revalidate(path)));
  const failedPaths = results.flatMap((result, index) => (
    result.status === 'rejected' ? [paths[index]] : []
  ));

  if (failedPaths.length > 0) {
    console.error('Contentful path revalidation failed', {
      topic,
      contentType,
      slugs,
      failedPaths,
    });
    return res.status(500).json({
      message: 'One or more paths could not be revalidated',
      failedPaths,
    });
  }

  console.info('Contentful paths revalidated', { topic, contentType, slugs, paths });
  return res.status(200).json({ revalidated: true, paths });
}
