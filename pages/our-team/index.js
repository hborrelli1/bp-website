import {createClient} from 'contentful';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'people' });

  return {
    props: {
      people: res.items
    },
    revalidate: 1,
  }
}

const OurTeam = ({ people }) => {
  const {
    fields,
  } = people;

  return (
    <div className="blog-list">
      hi...
    </div>
  )
}

export default OurTeam;
