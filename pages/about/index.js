import Head from 'next/head';
import {createClient} from 'contentful';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'themeConfig' });

  return {
    props: {
      themeConfig: res.items
    },
    revalidate: 1,
  }
}

const About = ({themeConfig}) => {
  console.log('themeConfig:', themeConfig);
  return (
    <>
      <Head>
        <title>Borrelli + Partners | About</title>
        <meta name="keywords" content="About" />
      </Head>
      <div>
        <h1>About Page</h1>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus turpis massa tincidunt dui ut ornare lectus. Phasellus faucibus scelerisque eleifend donec pretium vulputate. Pellentesque sit amet porttitor eget dolor. Etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Lectus urna duis convallis convallis tellus id. Ac tincidunt vitae semper quis lectus nulla at volutpat diam. Nisi porta lorem mollis aliquam ut porttitor. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat.</p>
      </div>
    </>
  );
}

export default About;
