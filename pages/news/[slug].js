import {createClient} from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';
import safeJsonStringify from 'safe-json-stringify';
import moment from 'moment';

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

  const stringifiedItems = safeJsonStringify(items);
  const data = JSON.parse(stringifiedItems);

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { blog: data[0]},
    revalidate: 1,
  }
}

const BlogPost = ({ blog }) => {
  const {blogTitle, blogContent, featuredPosts, thumbnailImage} = blog.fields;
  const updatedAt = blog.sys.updatedAt

  return (
    <div className="blog-content">
        <div className="header-block"></div>
        <div className="body-content">
          <div className="img-wrap">
            <Image 
              src={`https:${thumbnailImage.fields.file.url}`}
              width={thumbnailImage.fields.file.details.image.width}
              height={thumbnailImage.fields.file.details.image.height}
              alt={`${blogTitle} thumbnail image.`}
            />
          </div>
          <p className="date">{moment(updatedAt).format('MMMM Do YYYY')}</p>
          <h1>{blogTitle}</h1>
          <div className="body-copy">{documentToReactComponents(blogContent)}</div>
        </div>
      <div className="content-margins">
        <h4 className="sub-title">More News</h4>
        <ThreeColumnFeaturedPosts info={{
          subTitle: null,
          title: null,
          posts: featuredPosts,
          type: 'news'
        }}/>
      </div>
    </div>
  );
}
 
export default BlogPost;
