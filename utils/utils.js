const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_KEY;

const options = 

export const getOurWork = async () => {
  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${space}`,
    {
      method: 'POST', // GraphQL *always* uses POST requests!
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`, // add our access token header
      },
      // send the query we wrote in GraphiQL as a string
      body: JSON.stringify({
        // all requests start with "query: ", so we'll stringify that for convenience
        query: `
        {
          ourWorkCollection(limit: 20) {
            items {
              pageTitle
              backgroundImage {
                url
              }
              footerCta {
                copy 
                ctaText
                backgroundImage {
                  url
                }
              }
            }
          }
        }
      `,
      }),
    },
  );

  const res2 = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${space}`,
    {
      method: 'POST', // GraphQL *always* uses POST requests!
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`, // add our access token header
      },
      // send the query we wrote in GraphiQL as a string
      body: JSON.stringify({
        // all requests start with "query: ", so we'll stringify that for convenience
        query: `
        {
          projectsCollection(limit: 20) {
            items {
              projectTitle
              thumbnailImage {
                url
              }
              location
              industryTag
              serviceTags
              slug
            }
          }
        }
      `,
      }),
    },
  );

  const data = await res.json()
  const data2 = await res2.json()

  return {
    props: {
    	pageData: data.data.ourWorkCollection.items,
      featuredProjects: data2.data.projectsCollection.items,
    },
  }
}