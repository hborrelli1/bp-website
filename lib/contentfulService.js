import { createClient } from 'contentful';

const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_KEY;

const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

export async function fetchEntries() {
  const response = await client.getEntries({ content_type: 'themeConfig' });
  return response.items;
}

