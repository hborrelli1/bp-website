import {createClient} from 'contentful';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import Image from 'next/image';
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
  const {
    coreValues,
    headerBackgroundImage,
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
        image={headerBackgroundImage}
      />
      <section className="core-values">
        <div className="content">
          {coreValues.map((value, index) => (
            <div key={index} className="value">
              <div className="img-wrap">
                <Image 
                  src={coreValueKey[index]}
                  width="45px"
                  height="45px"
                  alt={`${value} icon`}
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

          return (
            <section className="content-section" style={style}>
              <div className="content-margins">
                <div className="content-col">
                  <h2>{section.fields.sectionTitle}</h2>
                  {documentToReactComponents(section.fields.content)}
                </div>
                <div className="img-col">
                  <Image 
                    src={`https:${section.fields.image.fields.file.url}`}
                    width={section.fields.image.fields.file.details.image.width}
                    height={section.fields.image.fields.file.details.image.height}
                    alt={section.fields.sectionTitle}
                  />
                </div>
              </div>
            </section>
          );
        })}
      </section>
    </article>
  )
}

export default Careers;
