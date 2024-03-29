import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';

const BlogCard = ({blog, type = "news"}) => {
  const {shortSummary = '', blogTitle, slug, projectTitle, thumbnailImage, date} = blog || {};

  const shortSummaryText = shortSummary.length > 150 
    ? `${shortSummary.substring(0, 150)}...` 
    : shortSummary;

  const postTitle = type === "news" ? blogTitle : projectTitle;
  
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
                alt={`${postTitle || ''} Thumbnail Image.`}
                />
            </div>
          </div>
          <div className="img-hover-filter-bg"></div>
          <div className="img-el">
            {thumbnailImage && thumbnailImage.url && (
              <Image  
                src={thumbnailImage.url}
                // width={thumbnailImage.fields.file.details.image.width}
                // height={thumbnailImage.fields.file.details.image.height}
                alt={postTitle || ''}
                className="img"
                layout="fill"
              />
            )}
          </div>
        </div>
        <div className="info">
          <h4>{postTitle || ''}</h4>
          {date && <h5 className="date">{moment(date).add(1, 'days').format('MMMM Do YYYY')}</h5>}
          <p className="body-copy">{shortSummaryText || ''}</p>
        </div>
        <p className="link">Keep Reading +</p>
      </a>
    </Link>
  );
}
 
export default BlogCard;
