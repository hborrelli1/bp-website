import Link from 'next/link';
import Image from 'next/image';

const BlogCard = ({blog}) => {
  const {blogTitle, slug, thumbnailImage} = blog.fields;

  return (
    <div className="blog-card">
      <Image  
        src={`https:${thumbnailImage.fields.file.url}`}
        width={thumbnailImage.fields.file.details.image.width}
        height={thumbnailImage.fields.file.details.image.height}
        alt={blogTitle}
      />
      <div className="info">
        <h4>{blogTitle}</h4>
        <p>alksdjflakjsdf</p>
        <Link href={`/blog/${slug}`}><a>Keep Reading...</a></Link>
      </div>
    </div>
  );
}
 
export default BlogCard;
