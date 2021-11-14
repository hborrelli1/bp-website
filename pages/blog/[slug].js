import {createClient} from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({content_type: 'blog'})

  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const {items} = await client.getEntries({ 
    content_type: 'blog',
    'fields.slug': params.slug,
  });

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { blog: items[0]},
    revalidate: 1,
  }
}

const BlogPost = ({ blog }) => {
  const {blogTitle, heroImage, blogContent, } = blog.fields;
  return (
    <div className="blog-content">
      <Image  
        src={`https:${heroImage.fields.file.url}`}
        width={heroImage.fields.file.details.image.width}
        height={heroImage.fields.file.details.image.height}
      />
      <h2>{blogTitle}</h2>
      {documentToReactComponents(blogContent)}
    </div>
  );
}
 
export default BlogPost;
