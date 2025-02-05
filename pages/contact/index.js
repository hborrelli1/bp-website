import ThreeColumnFeaturedPosts from "../../components/ThreeColumnFeaturedPosts";
import {createClient} from 'contentful';
import safeJsonStringify from 'safe-json-stringify';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import ContactForm from '../../components/ContactForm/ContactForm';
import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const themeConfigData = await client.getEntries({ content_type: 'themeConfig' });
  const res = await client.getEntries({ content_type: 'contactPage' });

  const stringifiedItems = safeJsonStringify(res);
  const data = JSON.parse(stringifiedItems);

  return {
    props: {
      themeConfig: themeConfigData.items[0],
      contactData: data.items[0],
    },
    revalidate: 1,
  }
}

// https://flaviocopes.com/nextjs-recaptcha/
// Try this article for recaptcha with nextjs.

const Contact = ({ contactData, themeConfig }) => {
  const {
    featuredPosts,
    pageDescription,
    pageTitle,
    backgroundImage,
  } = contactData.fields;
  const {
    address,
    googleMapsLink,
    telephoneNumber,
    linkedInUrl
  } = themeConfig.fields;

  return (
    <article className="contact-page">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
        contactInfo={{telephoneNumber, googleMapsLink, address, linkedInUrl}}
      />
      <section className="contact-body">
        <div className="content-margins">
          <ContactForm />
        </div>
      </section>
      <ThreeColumnFeaturedPosts info={{
        subTitle: "News",
        title: null,
        posts: featuredPosts,
        type: 'news'
      }} />
    </article>
  );
}
 
export default Contact;
