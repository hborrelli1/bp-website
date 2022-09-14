import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';

const BlogCard = ({blog, type = "news"}) => {
  const {shortSummary, blogTitle, slug = '/', thumbnailImage, date} = blog.fields;

  const shortSummaryText = shortSummary.length > 150 
    ? `${shortSummary.substring(0, 150)}...` 
    : shortSummary;

    console.log('blog:', blog);
  return (
    <Link href={`/${type}/${slug}`}>
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
              // width={thumbnailImage.fields.file.details.image.width}
              // height={thumbnailImage.fields.file.details.image.height}
              alt={blogTitle}
              className="img"
              layout="fill"
            />
          </div>
        </div>
        <div className="info">
          <h4>{blogTitle}</h4>
          <h5 className="date">{moment(date).format('MMMM Do YYYY')}</h5>
          <p className="body-copy">{shortSummaryText}</p>
        </div>
        <p className="link">Keep Reading +</p>
      </a>
    </Link>
  );
}
 
export default BlogCard;
