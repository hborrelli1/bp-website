import {createClient} from 'contentful';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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
  console.log('careers:', careers);
  const [isMobile, setIsMobile] = useState(false);

  const setIsMobileState = () => {
    const windowSize = window.innerWidth;
    if (windowSize <= 600) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
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
            <div key={index} className="value">
              <div className="img-wrap">
                <Image 
                  src={coreValueKey[index]}
                  className="icon"
                  // width="45px"
                  // height="45px"
                  alt={`${value} icon`}
                  layout="fill"
                />
              </div>
              <p>{value}</p>
            </div>
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
            <section className="content-section" style={style} key={index}>
              <div className="content-margins">
                <div className="content-col">
                  <h2>{sectionTitle}</h2>
                  {documentToReactComponents(content)}
                </div>
                <div className="img-col">
                  <div className="img-wrap">
                    <Image 
                      src={`https:${image.fields.file.url}`}
                      className="cta-img"
                      // width={image.fields.file.details.image.width}
                      // height={image.fields.file.details.image.height}
                      layout="fill"
                      alt={sectionTitle}
                    />                  </div>
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
      <section>
        Contact Form
      </section>
    </article>
  )
}

export default Careers;
