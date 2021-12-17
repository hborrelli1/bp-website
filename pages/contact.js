import ThreeColumnFeaturedPosts from "../components/ThreeColumnFeaturedPosts";
import {createClient} from 'contentful';
import safeJsonStringify from 'safe-json-stringify';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'contactPage' });

  const stringifiedItems = safeJsonStringify(res);
  const data = JSON.parse(stringifiedItems);

  return {
    props: {
      contactData: data.items[0],
    },
    revalidate: 1,
  }
}


const Contact = ({ contactData }) => {
  console.log('contact Data:', contactData);  
  const {
    featuredPosts,
    pageTitle,
  } = contactData.fields;
  return (
    <div>
      <h1>{pageTitle}</h1>
      <h3 className="sub-title">News</h3>
      <ThreeColumnFeaturedPosts info={{
        subTitle: null,
        title: null,
        posts: featuredPosts
      }} />
    </div>
  );
}
 
export default Contact;
