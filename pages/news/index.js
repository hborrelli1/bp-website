import {createClient} from 'contentful';
import RecipeCard from '../../components/BlogCard';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'newsPage' });

  return {
    props: {
      newsPage: res.items[0]
    },
    revalidate: 1,
  }
}

const News = ({ newsPage }) => {
  console.log('newsPage:', newsPage);
  const {
    backgroundImage,
    featuredNews,
    footerCta,
    pageDescription,
    pageTitle,
  } = newsPage.fields;

  return (
    <article className="blog-list">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <section className="featured-news">
        <div className="content-margins">
          <div className="img-col">
            
          </div>
        </div>
      </section>
      
      
      {/* {blogs.map(blog => (
        <RecipeCard key={blog.sys.id} blog={blog} />
      ))} */}
    </article>
  )
}

export default News;
