import Image from 'next/image';
import Link from 'next/link';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const CarouselComponent = ({ items, type }) => {

  if (type === 'projects') {
    return (
      <Carousel
        showThumbs={false}
        showArrows={true}
        showIndicators={false}
        infiniteLoop={true}
        statusFormatter={(currentItem, totalCount) => (<span>{currentItem > 9 ? '' : 0}{currentItem} / {totalCount > 9 ? '' : 0}{totalCount}</span>)}
      >
        {items.map(item => (
          <div className="featured-project" key={item.id}>
            <div className="image-col">
              <Image 
                src={`https:${item.thumbnail.fields.file.url}`} 
                width="726" 
                height="486" 
                alt={item.thumbnail.fields.title}
                layout="responsive"
              />
            </div>
            <div className="content-col">
              <span>{item.industry}</span>
              <h3>{item.title}</h3>
              <p className="body-copy">{item.excerpt}</p>
              <Link href={`/our-work/${item.slug}`}>
                <a className="project-link">Keep Reading</a>
              </Link>
            </div>
          </div>
        ))}
      </Carousel>
    )
  } else if (type === 'testimonials') {
    return (
      <Carousel
        showThumbs={false}
        showArrows={true}
        showIndicators={false}
        infiniteLoop={true}
        statusFormatter={(currentItem, totalCount) => (<span>{currentItem > 9 ? '' : 0}{currentItem} / {totalCount > 9 ? '' : 0}{totalCount}</span>)}
      >
        {items.map(item => (
          <blockquote className="testimonials-wrap" key={item.sys.id}>
            <div className="copy body-copy">{documentToReactComponents(item.fields.testimonial)}</div>
            <div className="info-block">
              <p className="name">{item.fields.name}</p>
              <p className="title">{item.fields.title}</p>
              {item.fields.projectReference && (
                <Link href={`/our-work/${item.fields.projectReference.fields.slug}`}>
                  <a className="project-link">View Project</a>
                </Link>
              )}
            </div>
          </blockquote>
        ))}
      </Carousel>
    )
  } else {
    return (
      <Carousel
        showThumbs={false}
        showArrows={true}
        showIndicators={false}
        infiniteLoop={true}
        statusFormatter={(currentItem, totalCount) => (<span>{currentItem > 9 ? '' : 0}{currentItem} / {totalCount > 9 ? '' : 0}{totalCount}</span>)}
      >
        {items.map(item => (
          <Image 
            key={item.id}
            src={`https:${item.fields.file.url}`} 
            width="1109" 
            height="624" 
            alt={item.fields.title}
          />
        ))}
      </Carousel>
    )
  }

}

export default CarouselComponent;
