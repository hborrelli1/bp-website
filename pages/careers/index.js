import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import Image from "next/image";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import CareerForm from '../../components/ContactForm/CareerForm';
import { compactFields, fetchContentfulGraphQL, mapGraphQLAsset } from '../../lib/contentfulPageData';

export const getStaticProps = async () => {
  const data = await fetchContentfulGraphQL(`
    query CareersAndTheme {
      careersCollection(limit: 1) {
        items {
          coreValues
          headerBackgroundImage { url title width height }
          mobileBackgroundImage { url title width height }
          pageDescription
          pageTitle
          textAndImageSectionsCollection(limit: 20) {
            items {
              content { json }
              image { url title width height }
              linkTitle
              linkUrl
              sectionTitle
            }
          }
        }
      }
      themeConfigCollection(limit: 1) {
        items { backgroundTexture { url title width height } }
      }
    }
  `);
  const career = data.careersCollection.items[0];

  return {
    props: {
      careers: {
        fields: compactFields({
          coreValues: career.coreValues,
          headerBackgroundImage: mapGraphQLAsset(career.headerBackgroundImage),
          mobileBackgroundImage: mapGraphQLAsset(career.mobileBackgroundImage),
          pageDescription: career.pageDescription,
          pageTitle: career.pageTitle,
          textAndImageSections: career.textAndImageSectionsCollection.items.map(section => ({
            fields: compactFields({
              content: section.content.json,
              image: mapGraphQLAsset(section.image),
              linkTitle: section.linkTitle,
              linkUrl: section.linkUrl,
              sectionTitle: section.sectionTitle,
            }),
          })),
        }),
      },
      themeConfig: {
        fields: {
          backgroundTexture: mapGraphQLAsset(data.themeConfigCollection.items[0].backgroundTexture),
        },
      },
    },
    revalidate: 300,
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
                  fill
                  sizes="100vw" />
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
                      fill
                      alt={sectionTitle}
                      sizes="100vw"
                      style={{
                        objectFit: 'cover',
                      }} />                  
                  </div>
                  {linkUrl && (
                      <Link href={linkUrl} className="cta">

                        <span>{linkTitle}</span>
                        <div className="icon">
                          <Image
                            src="/assets/icons/down-arrow-circle-white@2x.png"
                            width="34"
                            height="34"
                            alt="Meet our people"
                            style={{
                              maxWidth: "100%",
                              height: "auto"
                            }} />
                        </div>

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
  );
}

export default Careers;
