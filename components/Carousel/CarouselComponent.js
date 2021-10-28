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
      // renderIndicator={(
      //   onClickHandler,
      //   isSelected,
      //   index,
      //   label
      // ) => (
      //   // it will render inside an ul element
      //   <li
      //     onClick={onClickHandler}
      //     onKeyDown={onClickHandler}
      //     value={index}
      //     key={index}
      //     role="button"
      //     tabIndex={0}
      //     aria-label={`${label} ${index + 1}`}
      //   >
      //     {/* render the number instead of a box*/}
      //     {`0${index + 1}`}
      //   </li>
      // )}
    >
      {items.map(item => (
        <div className="featured-project">
          <div className="image-col">
            <img src={`https://${item.thumbnail.fields.file.url}`} />
          </div>
          <div className="content-col">
            <span>{item.tags[0].fields.tagTitle}</span>
            <h3>{item.title}</h3>
            <p>{item.excerpt}</p>
          </div>
        </div>
      ))}
    </Carousel>
  )
}

export default CarouselComponent;
