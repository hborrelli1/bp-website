import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FooterCta from '../../components/FooterCta/FooterCta';
import styles from './about.module.scss'

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const themeConfigData = await client.getEntries({ content_type: 'themeConfig' });
  const aboutData = await client.getEntries({ content_type: 'about' });

  return {
    props: {
      themeConfig: themeConfigData.items,
      aboutData: aboutData.items[0],
    },
    revalidate: 1,
  }
}

const About = ({themeConfig, aboutData}) => {
  console.log('aboutdata:', aboutData);

  const {
    aboutSubTitle,
    descriptionPhoto,
    footerCta,
    headerPhoto,
    mainDescription,
    mainTitle,
    ourTeam,
    pageTitle,
    qualityTitle1,
    qualityTitle2,
    qualityTitle3,
    qualityTitle4,
    qualityDescription1,
    qualityDescription2,
    qualityDescription3,
    qualityDescription4,
    servicesCta,
    shortDescription,
    slug,
    testitmonials
  } = aboutData.fields;
  return (
    <>
      <Head>
        <title>{`Borrelli + Partners | ${pageTitle}`}</title>
        <meta name="keywords" content="About" />
      </Head>
      <article className={styles.about}>
        <header>
          <div className={styles['header-content']}>
            <div className={styles['header-image']} style={{ backgroundImage: `url(https:${headerPhoto.fields.file.url})` }}></div>
            <div className={styles['header-copy']}>
              <h1>{aboutSubTitle}</h1>
              {documentToReactComponents(shortDescription)}
            </div>
          </div>
        </header>
        <section className={styles['main-content']} style={{ backgroundImage: `url(https:${themeConfig[0].fields.backgroundTexture.fields.file.url})` }}>
          <div className={styles['margin-container']}>
            <div className={styles['content-col']}>
              <h2>{mainTitle}</h2>
              {documentToReactComponents(mainDescription)}
            </div>
            <div className={styles['image-col']}>
              <Image 
                src={`https:${descriptionPhoto.fields.file.url}`} 
                width={descriptionPhoto.fields.file.details.image.width} 
                height={descriptionPhoto.fields.file.details.image.height} 
              />
            </div>
          </div>
        </section>
        <section className={styles['our-qualities']}>
          <div className={styles['our-qualities-content']}>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image 
                  src="/assets/icons/sustainability-icon@2x.png" 
                  width="122" 
                  height="122"
                />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle1}</h5>
                {documentToReactComponents(qualityDescription1)}
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image 
                  src="/assets/icons/minority-owned-icon@2x.png" 
                  width="122" 
                  height="122"
                />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle2}</h5>
                {documentToReactComponents(qualityDescription2)}
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image 
                  src="/assets/icons/technology-icon@2x.png" 
                  width="122" 
                  height="122"
                />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle3}</h5>
                {documentToReactComponents(qualityDescription3)}
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image 
                  src="/assets/icons/crime-prevention-icon@2x.png" 
                  width="122" 
                  height="122"
                />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle4}</h5>
                {documentToReactComponents(qualityDescription4)}
              </div>
            </div>
          </div>
        </section>
        <section className="testimonials">
          <div className="content">
            {/* Add Testimonials Carousel Here.... */}
          </div>
        </section>
        <section className={styles['our-team']}>
          <div className={styles['content']}>
            <h2>Our Team</h2>
            <div className={styles['people-wrapper']}>
              {ourTeam.map(person => (
                <div className={styles['person']} key={person.sys.id}>
                  <Image 
                    className={styles['headshot']}
                    src={`https:${person.fields.photo.fields.file.url}`} 
                    width={person.fields.photo.fields.file.details.image.width} 
                    height={person.fields.photo.fields.file.details.image.height} 
                  />
                  <div className={styles['card']}>
                    <h5>{person.fields.name}</h5>
                    <p>{person.fields.jobTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <FooterCta 
          ctaData={{
            copy: footerCta.fields.copy,
            buttonText: footerCta.fields.ctaText,
            buttonUrl: '/services',
            backgroundImage: footerCta.fields.backgroundImage
          }}
        />
      </article>
    </>
  );
}

export default About;
