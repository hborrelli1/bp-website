import Link from 'next/link';
import Image from 'next/image';

const BlogCard = ({blog}) => {
  console.log('blog...:', blog);
  const {blogContent, blogExcerpt, blogTitle, slug, thumbnailImage} = blog.fields;

  const excerptText = blogExcerpt.length > 150 
    ? `${blogExcerpt.substring(0, 150)}...` 
    : blogExcerpt;

  

  return (
    <Link href={`/news/${slug}`}>
      <a className="blog-card">
        <div className="img-wrap">
          <div className="img-hover-circle">
            <div className="icon">
              <Image 
                src="/assets/icons/circle-with-plus@2x.png"
                width="40px"
                height="40px"
                alt={`${blogTitle} Thumbnail Image.`}
              />
            </div>
          </div>
          <div className="img-hover-filter-bg"></div>
          <div className="img-el">
            <Image  
              src={`https:${thumbnailImage.fields.file.url}`}
              width={thumbnailImage.fields.file.details.image.width}
              height={thumbnailImage.fields.file.details.image.height}
              alt={blogTitle}
            />
          </div>
        </div>
        <div className="info">
          <h4>{blogTitle}</h4>
          <p>{excerptText}</p>
        </div>
        <p className="link">Keep Reading +</p>
      </a>
    </Link>
  );
}
 
export default BlogCard;
