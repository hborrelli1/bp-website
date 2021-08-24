import preval from 'next-plugin-preval';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

async function getServices() {
  const res = await fetch('https://graphql.contentful.com/content/v1/spaces/7obzj0odnsj4',
  {
    method: 'POST', // GraphQL *always* uses POST requests!
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_KEY}`, // add our access token header
    },
    // send the query we wrote in GraphiQL as a string
    body: JSON.stringify({
      // all requests start with "query: ", so we'll stringify that for convenience
      query: `
      {
        servicesCollection {
          items {
            service
            serviceShortDescription {
              json
            }
          } 
        }
      }
    `}),
  });
  console.log('res:', res);
  const {data} = await res.json();
  return data;
}

export default preval(getServices());
