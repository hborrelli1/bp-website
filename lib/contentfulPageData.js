export const compactFields = (fields) => Object.fromEntries(
  Object.entries(fields).filter(([, value]) => value !== undefined)
);

export async function fetchContentfulGraphQL(query) {
  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_KEY}`,
      },
      body: JSON.stringify({ query }),
    },
  );
  const result = await response.json();

  if (!response.ok || result.errors) {
    const message = result.errors?.map(error => error.message).join('; ');
    throw new Error(message || `Contentful GraphQL request failed (${response.status})`);
  }

  return result.data;
}

export const mapAsset = (asset) => {
  if (!asset?.fields?.file) return null;

  const { file } = asset.fields;
  const image = file.details?.image;

  return {
    fields: compactFields({
      title: asset.fields.title,
      file: {
        url: file.url,
        ...(image && {
          details: {
            image: {
              width: image.width,
              height: image.height,
            },
          },
        }),
      },
    }),
  };
};

export const mapGraphQLAsset = (asset) => {
  if (!asset?.url) return null;

  return {
    fields: {
      title: asset.title,
      file: {
        url: asset.url.replace(/^https?:/, ''),
        ...(asset.width && asset.height && {
          details: {
            image: {
              width: asset.width,
              height: asset.height,
            },
          },
        }),
      },
    },
  };
};