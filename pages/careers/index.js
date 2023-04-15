import {createClient} from 'contentful';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import CareerForm from '../../components/ContactForm/CareerForm';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'careers' });
  const res2 = await client.getEntries({ content_type: 'themeConfig' });

  return {
    props: {
      careers: res.items[0],
      themeConfig: res2.items[0]
    },
    revalidate: 1,
  }
}

const Careers = ({ careers, themeConfig }) => {
  const [isMobile, setIsMobile] = useState(false);

  const setIsMobileState = () => {
    const windowSize = window.innerWidth;
    if (windowSize <= 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  const scrollTo = (indexValue) => {
    const element = document.getElementById(`section-${indexValue + 1}`);
    const getElemDistance = (elem) => {
      let location = 0;
      if (elem.offsetParent) {
        do {
          location += elem.offsetTop;
          elem = elem.offsetParent;
        } while (elem);
      }
      return location >= 0 ? location : 0;
    };

    const distance = getElemDistance(element);
    window.scrollTo({
      top: distance, 
      left: 0,
      behavior: 'smooth'
    });
  }

  useEffect(() =>{
    window.addEventListener('resize', setIsMobileState)

    return () => {
      window.removeEventListener('resize', setIsMobileState)
    }
  })

  useEffect(() => {
    setIsMobileState();
  }, [])

  const {
    coreValues,
    headerBackgroundImage,
    mobileBackgroundImage,
    pageDescription,
    pageTitle,
    textAndImageSections,
  } = careers.fields;

  const coreValueKey = {
    0: '/assets/icons/inclusion-diversityicon@2x.png',
    1: '/assets/icons/professional-growth-icon@2x.png',
    2: '/assets/icons/collaborative-culture-icon@2x.png',
  }

  return (
    <article className="careers-wrapper">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={isMobile ? mobileBackgroundImage : headerBackgroundImage}
      />
      <section className="core-values">
        <div className="content">
          {coreValues.map((value, index) => (
            <button type="button" key={index} className="value" onClick={() => scrollTo(index-1)}>
              <div className="img-wrap">
                <Image 
                  src={coreValueKey[index]}
                  className="icon"
                  alt={`${value} icon`}
                  layout="fill"
                />
              </div>
              <p>{value}</p>
            </button>
          ))}
        </div>
      </section>
      <section className="body-content">
        {textAndImageSections.map((section, index) => {
          const style = {
            backgroundImage: index === 0 
              ? `url(https:${themeConfig.fields.backgroundTexture.fields.file.url})`
              : 'unset'
          }
          const { content, image, linkTitle, linkUrl, sectionTitle } = section.fields;

          return (
            <section className="content-section" style={style} key={index} id={`section-${index}`}>
              <div className="content-margins">
                <div className="content-col">
                  <h2>{sectionTitle}</h2>
                  <div className="body-copy">{documentToReactComponents(content)}</div>
                </div>
                <div className="img-col">
                  <div className="img-wrap">
                    <Image 
                      src={`https:${image.fields.file.url}`}
                      className="cta-img"
                      // width={image.fields.file.details.image.width}
                      // height={image.fields.file.details.image.height}
                      width="730px"
                      height="552px"
                      layout="responsive"
                      alt={sectionTitle}
                    />                  
                  </div>
                  {linkUrl && (
                      <Link href={linkUrl}>
                        <a className="cta">
                          <span>{linkTitle}</span>
                          <div className="icon">
                            <Image 
                              src="/assets/icons/down-arrow-circle-white@2x.png"
                              width="34px"
                              height="34px"
                              alt="Meet our people"
                            />
                          </div>
                        </a>
                      </Link>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </section>
      <section className="career-body">
        <div className="content-margins">
          <CareerForm />
        </div>
      </section>
    </article>
  )
}

export default Careers;
