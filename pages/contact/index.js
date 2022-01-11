import ThreeColumnFeaturedPosts from "../../components/ThreeColumnFeaturedPosts";
import {createClient} from 'contentful';
import safeJsonStringify from 'safe-json-stringify';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
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


const Contact = ({ contactData, themeConfig }) => {
  console.log('contact Data:', contactData);  
  console.log('themeConfig:', themeConfig);  
  const {
    featuredPosts,
    pageDescription,
    pageTitle,
    backgroundImage,
  } = contactData.fields;
  const {
    address,
    telephoneNumber,
    faxNumber,
    linkedInUrl
  } = themeConfig.fields;
  return (
    <article className="contact-page">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <address>
        <div className="content-margins">
          <ul className="links">
            <li className="link">
              <Link href="tel:4074181338">
                <a>P: {telephoneNumber}</a>
              </Link>
              </li>
            <li className="link">
              <Link href="tel:4074181342">
                <a>F: {faxNumber}</a>
              </Link>
              </li>
            <li className="link">
              <Link href="https://goo.gl/maps/2owQTVWmYejBTjdG6">
                <a>{documentToReactComponents(address)}</a>
              </Link>
              </li>
          </ul>
          <Link href={linkedInUrl}>
            <a className="linkedin">
              <Image 
                src="/assets/icons/linkedin-white@2x.png"
                width="15px"
                height="15px"
                alt="Borrelli + Partners LinkedIn"
              />
            </a>
          </Link>
        </div>
      </address>
      <section>
        <h2>Let&rsquo;s Connect</h2>
        <p>Form here...</p>
      </section>
      <ThreeColumnFeaturedPosts info={{
        subTitle: null,
        title: null,
        posts: featuredPosts
      }} />
    </article>
  );
}
 
export default Contact;
