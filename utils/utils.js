import { createClient } from 'contentful';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

// Retrieve the list of blog posts from Contentful
// const getOurWork = async () => {
//   const response = await client.getEntries({
//     content_type: 'ourWork',
//     limit: 2
//   });

//   return response.items;
// };

// export default getOurWork;
