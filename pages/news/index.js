import {createClient} from 'contentful';
import RecipeCard from '../../components/BlogCard';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import FooterCta from '../../components/FooterCta/FooterCta';
import Image from 'next/image';
import Link from 'next/link';
import BlogCard from '../../components/BlogCard';
import { useState } from 'react';
import safeJsonStringify from 'safe-json-stringify';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const newsRes = await client.getEntries({ content_type: 'newsPage', include: 2});
  const blogRes = await client.getEntries({ content_type: 'blog' });

  const stringifiedNews = safeJsonStringify(newsRes);
  const stringifiedBlog = safeJsonStringify(blogRes);
  const newsData = JSON.parse(stringifiedNews);
  const blogData = JSON.parse(stringifiedBlog);

  return {
    props: {
      newsPage: newsData.items[0],
      blogItems: blogData.items,
    },
    revalidate: 1,
  }
}

const News = ({ newsPage, blogItems }) => {
  const {
    backgroundImage,
    featuredNews,
    footerCta,
    pageDescription,
    pageTitle,
  } = newsPage.fields;

  const [itemsToDisplay, setItemsToDisplay] = useState(6);

  const blogItemsDisplay = blogItems.map((blog, index) => <BlogCard key={index} blog={blog} />);

  const increaseItemsToDisplay = () => {
    setItemsToDisplay(itemsToDisplay + 6);
  }

  return (
    <article className="news-list">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <section className="featured-news">
        <div className="content-margins">
          <h3 className="sub-title">Featured News:</h3>
          <div className="img-col">
            <Image 
              src={`https:${featuredNews.fields.thumbnailImage.fields.file.url}`} 
              width={featuredNews.fields.thumbnailImage.fields.file.details.image.width}
              height={featuredNews.fields.thumbnailImage.fields.file.details.image.height}
              alt={featuredNews.fields.blogTitle}
            />
          </div>
          <div className="content-col">
            <h2>{featuredNews.fields.blogTitle}</h2>
            <p>{featuredNews.fields.shortSummary}</p>
            <Link href={`/news/${featuredNews.fields.slug}`}>
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
                  src="/assets/icons/arrow-with-circle@2x.png"
                  width="40px"
                  height="40px"
                  alt="Load More Articles."
                />
              </div>
            </button>
          )}
        </div>
      </section>

      <FooterCta 
        ctaData={{
          copy: footerCta.fields.copy,
          buttonText: footerCta.fields.ctaText,
          buttonUrl: footerCta.fields.ctaLink,
          backgroundImage: footerCta.fields.backgroundImage
        }}
      />
    </article>
  )
}

export default News;
