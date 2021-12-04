import Image from 'next/image';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

const CarouselComponent = ({ items }) => {
  console.log('items:', items);

  return (
    <Carousel
      showThumbs={false}
      showArrows={true}
      showIndicators={false}
      infiniteLoop={true}
      statusFormatter={(currentItem, totalCount) => (<span>0{currentItem} / 0{totalCount}</span>)}
    >
      {items.map(item => (
        <div className="featured-project" key={item.id}>
          <div className="image-col">
            <Image 
              src={`https:${item.thumbnail.fields.file.url}`} 
              width="726" 
              height="486" 
              alt=""
            />
          </div>
          <div className="content-col">
            <span>{item.industry}</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

export default CarouselComponent;
