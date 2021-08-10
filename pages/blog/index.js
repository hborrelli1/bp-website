import {createClient} from 'contentful';
import RecipeCard from '../../components/BlogCard';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'blog' });

  return {
    props: {
      blogs: res.items
    },
    revalidate: 1,
  }
}

const Blog = ({ blogs }) => {
  console.log('blogs:', blogs);
  const {
    fields,
  } = blogs;

  return (
    <div className="blog-list">
      {blogs.map(blog => (
        <RecipeCard key={blog.sys.id} blog={blog} />
      ))}
    </div>
  )
}

export default Blog;
