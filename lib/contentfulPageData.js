export const compactFields = (fields) => Object.fromEntries(
  Object.entries(fields).filter(([, value]) => value !== undefined)
);

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