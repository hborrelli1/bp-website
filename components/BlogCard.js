import Link from 'next/link';
import Image from 'next/image';
import moment from 'moment';
import {useRouter} from 'next/router'

const BlogCard = ({blog, type = "news"}) => {
  const router = useRouter();
  const {shortSummary = '', blogTitle, slug, projectTitle, thumbnailImage, date} = blog?.fields || {};

  const shortSummaryText = shortSummary.length > 150 
    ? `${shortSummary.substring(0, 150)}...` 
    : shortSummary;

  const postTitle = type === "news" ? blogTitle : projectTitle;
  
  return (
    <div className='blog-card' onClick={() => router.push(`/${type}/${slug}`)}>
      {/* <Link href={`/${type}/${slug}`}>
        <a> */}
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
              {thumbnailImage && thumbnailImage.fields && (
                <Image  
                  src={`https:${thumbnailImage.fields.file.url}`}
                  // width={thumbnailImage.fields.file.details.image.width}
                  // height={thumbnailImage.fields.file.details.image.height}
                  alt={postTitle || ''}
                  className="img"
                  layout="fill"
                  fill={true}
                />
              )}
            </div>
          </div>
          <div className="info">
            <h4>{postTitle || ''}</h4>
            {date && <h5 className="date">{moment(date).format('MMMM Do YYYY')}</h5>}
            <p className="body-copy">{shortSummaryText || ''}</p>
          <p className="link">Keep Reading +</p>
          </div>
        {/* </a>
      </Link> */}
    </div>
  );
}
 
export default BlogCard;
