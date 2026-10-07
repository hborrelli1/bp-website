import ThreeColumnFeaturedPosts from "../../components/ThreeColumnFeaturedPosts";
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import ContactForm from '../../components/ContactForm/ContactForm';
import Image from "next/image";
import Link from 'next/link';
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { compactFields, fetchContentfulGraphQL, mapGraphQLAsset } from '../../lib/contentfulPageData';

export const getStaticProps = async () => {
  const data = await fetchContentfulGraphQL(`
    query ContactAndTheme {
      contactPageCollection(limit: 1) {
        items {
          featuredPostsCollection(limit: 10) {
            items {
              shortSummary
              thumbnailImage { url title width height }
              slug
              blogTitle
              date
            }
          }
          pageDescription
          pageTitle
          backgroundImage { url title width height }
        }
      }
      themeConfigCollection(limit: 1) {
        items {
          address { json }
          googleMapsLink
          telephoneNumber
          linkedInUrl
        }
      }
    }
  `);
  const contactPage = data.contactPageCollection.items[0];
  const theme = data.themeConfigCollection.items[0];

  return {
    props: {
      themeConfig: {
        fields: {
          address: theme.address.json,
          googleMapsLink: theme.googleMapsLink,
          telephoneNumber: theme.telephoneNumber,
          linkedInUrl: theme.linkedInUrl,
        },
      },
      contactData: {
        fields: compactFields({
          featuredPosts: contactPage.featuredPostsCollection.items.map(post => ({
            fields: compactFields({
              shortSummary: post.shortSummary,
              thumbnailImage: mapGraphQLAsset(post.thumbnailImage),
              slug: post.slug,
              blogTitle: post.blogTitle,
              date: post.date,
            }),
          })),
          pageDescription: contactPage.pageDescription,
          pageTitle: contactPage.pageTitle,
          backgroundImage: mapGraphQLAsset(contactPage.backgroundImage),
        }),
      },
    },
    revalidate: 300,
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
