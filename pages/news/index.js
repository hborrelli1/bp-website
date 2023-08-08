import {createClient} from 'contentful';
import TwoColumnHeaderGQL from '../../components/TwoColumnHeaderGQL/TwoColumnHeaderGQL';
import FooterCtaGQL from '../../components/FooterCtaGQL/FooterCtaGQL';
import Image from 'next/image';
import Link from 'next/link';
import BlogCardGQL from '../../components/BlogCardGQL';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';
import moment from 'moment';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_KEY;

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
          newsPageCollection(limit:1) {
            items {
              pageTitle
              pageDescription
              backgroundImage {
                url
              }
              featuredNews {
                blogTitle
                shortSummary
                thumbnailImage {
                  url
                  width
                  height
                }
                slug
              }
              footerCta {
                copy 
                ctaText
                ctaLink
                backgroundImage {
                  url
                }
              }
              newsPostsCollection(where:{sys:{id_exists:true}}) {
                items {
                  shortSummary
                  thumbnailImage {
                    url
                  }
                  slug
                }
              }
            }
          }
        }
      `,
      }),
    },
  );

  const data = await res.json()
  // const data2 = await res2.json()

  return {
    props: {
    	pageData: data.data.newsPageCollection.items,
      // featuredProjects: data2.data.projectsCollection.items,
    },
  }

  // const client = createClient({
  //   space: process.env.CONTENTFUL_SPACE_ID,
  //   accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  // });

  // const newsRes = await client.getEntries({ content_type: 'newsPage'});
  // const stringifiedNews = safeJsonStringify(newsRes);

  // const newsData = JSON.parse(stringifiedNews);

  // return {
  //   props: {
  //     newsPage: newsData.items[0],
  //   },
  //   revalidate: 1,
  // }
}

const News = ({ pageData }) => {
  const {
    backgroundImage,
    featuredNews,
    footerCta,
    pageDescription,
    pageTitle,
    date,
    newsPostsCollection
  } = pageData[0]

  const [itemsToDisplay, setItemsToDisplay] = useState(6);

  const blogItemsDisplay = newsPostsCollection.items?.map((blog, index) => <BlogCardGQL key={index} blog={blog} type={'news'} />);

  const increaseItemsToDisplay = () => {
    setItemsToDisplay(itemsToDisplay + 6);
  }

  return (
    <article className="news-list">
      <TwoColumnHeaderGQL 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <section className="featured-news">
        <div className="content-margins">
          <h3 className="sub-title">Featured News:</h3>
          <div className="img-col">
            <Image 
              src={featuredNews.thumbnailImage.url} 
              width={featuredNews.thumbnailImage.width}
              height={featuredNews.thumbnailImage.height}
              alt={featuredNews.blogTitle}
            />
          </div>
          <div className="content-col">
            <h2>{featuredNews.blogTitle}</h2>
            <h5 className="date">{moment(date).format('MMMM Do YYYY')}</h5>
            <p className="body-copy">{featuredNews.shortSummary}</p>
            <Link href={`/news/${featuredNews.slug}`}>
              <a className="blog-link">Keep reading +</a>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="all-news">
        <div className="content-margins">
          <h3 className="sub-title">All News</h3>
          {blogItemsDisplay.filter((blog, index) => index < itemsToDisplay)}
          {blogItemsDisplay.length > itemsToDisplay && (
            <button 
              type="button" 
              className="load-more-button"
              onClick={increaseItemsToDisplay}
            >
              <span>Load More</span>
              <div className="icon">
                <Image 
                  src="/assets/icons/circle-icon-dark@2x.png"
                  width="40px"
                  height="40px"
                  alt="Load More Articles."
                />
                <div className='chevron-icon'>
                  <Image src="/assets/icons/chevron-icon-dark@2x.png" width="10" height="6" layout="fixed" alt="" />
                </div>
              </div>
            </button>
          )}
        </div>
      </section>

      <FooterCtaGQL 
        ctaData={{
          copy: footerCta.copy,
          buttonText: footerCta.ctaText,
          buttonUrl: footerCta.ctaLink,
          backgroundImage: footerCta.backgroundImage
        }}
      />
    </article>
  )
}

export default News;
