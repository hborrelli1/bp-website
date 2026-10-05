import Head from 'next/head';
import Link from 'next/link';
import Image from "next/image";
import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FooterCta from '../../components/FooterCta/FooterCta';
import styles from './about.module.scss'
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import { compactFields, mapAsset } from '../../lib/contentfulPageData';

const mapAboutData = (entry) => {
  const { fields } = entry;

  return {
    fields: compactFields({
      aboutSubTitle: fields.aboutSubTitle,
      descriptionPhoto: mapAsset(fields.descriptionPhoto),
      footerCta: {
        fields: {
          copy: fields.footerCta.fields.copy,
          ctaText: fields.footerCta.fields.ctaText,
          backgroundImage: mapAsset(fields.footerCta.fields.backgroundImage),
        },
      },
      headerPhoto: mapAsset(fields.headerPhoto),
      mainDescription: fields.mainDescription,
      mainTitle: fields.mainTitle,
      ourTeam: fields.ourTeam.map(person => ({
        sys: { id: person.sys.id },
        fields: {
          fullBioPage: person.fields.fullBioPage,
          slug: person.fields.slug,
          photo: mapAsset(person.fields.photo),
          name: person.fields.name,
          jobTitle: person.fields.jobTitle,
        },
      })),
      pageTitle: fields.pageTitle,
      qualityTitle1: fields.qualityTitle1,
      qualityTitle2: fields.qualityTitle2,
      qualityTitle3: fields.qualityTitle3,
      qualityTitle4: fields.qualityTitle4,
      qualityDescription1: fields.qualityDescription1,
      qualityDescription2: fields.qualityDescription2,
      qualityDescription3: fields.qualityDescription3,
      qualityDescription4: fields.qualityDescription4,
      shortDescription: fields.shortDescription,
      testimonials: fields.testimonials?.map(testimonial => ({
        sys: { id: testimonial.sys.id },
        fields: {
          testimonial: testimonial.fields.testimonial,
          name: testimonial.fields.name,
          title: testimonial.fields.title,
          projectReference: testimonial.fields.projectReference && {
            fields: { slug: testimonial.fields.projectReference.fields.slug },
          },
        },
      })),
    }),
  };
};

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const themeConfigData = await client.getEntries({ content_type: 'themeConfig' });
  const aboutDataRes = await client.getEntries({ content_type: 'about', include: 2 });
  const aboutData = mapAboutData(aboutDataRes.items[0]);
  const themeBackgroundUrl = themeConfigData.items[0].fields.backgroundTexture.fields.file.url;

  return {
    props: {
      themeBackgroundUrl,
      aboutData,
    },
    revalidate: 300,
  }
}

const About = ({themeBackgroundUrl, aboutData}) => {
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
    shortDescription,
    testimonials
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
        <section className={styles['main-content']} style={{ backgroundImage: `url(https:${themeBackgroundUrl})` }}>
          <div className={styles['margin-container']}>
            <div className={styles['content-col']}>
              <h2>{mainTitle}</h2>
              <div className="body-copy">{documentToReactComponents(mainDescription)}</div>
            </div>
            <div className={styles['image-col']}>
              <Image
                src={`https:${descriptionPhoto.fields.file.url}`}
                width={descriptionPhoto.fields.file.details.image.width}
                height={descriptionPhoto.fields.file.details.image.height}
                alt="About Borrelli + Partners"
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </div>
          </div>
        </section>
        <section className={styles['our-qualities']}>
          <div className={styles['our-qualities-content']}>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image
                  src="/assets/icons/sustainability-icon@2x.png"
                  width="100"
                  height="100"
                  alt={qualityTitle1}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle1}</h5>
                <div className="body-copy">{documentToReactComponents(qualityDescription1)}</div>
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image
                  src="/assets/icons/minority-owned-icon@2x.png"
                  width="100"
                  height="100"
                  alt={qualityTitle2}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle2}</h5>
                <div className="body-copy">{documentToReactComponents(qualityDescription2)}</div>
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image
                  src="/assets/icons/technology-icon@2x.png"
                  width="100"
                  height="100"
                  alt={qualityTitle3}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle3}</h5>
                <div className="body-copy">{documentToReactComponents(qualityDescription3)}</div>
              </div>
            </div>
            <div className={styles.quality}>
              <div className={styles['quality-image']}>
                <Image
                  src="/assets/icons/crime-prevention-icon@2x.png"
                  width="100"
                  height="100"
                  alt={qualityTitle4}
                  style={{
                    maxWidth: "100%",
                    height: "auto"
                  }} />
              </div>
              <div className={styles['quality-content']}>
                <h5>{qualityTitle4}</h5>
                <div className="body-copy">{documentToReactComponents(qualityDescription4)}</div>
              </div>
            </div>
          </div>
        </section>
        {testimonials && (
          <section className="testimonials">
            <div className="content">
              <CarouselComponent items={testimonials} type="testimonials" />
            </div>
          </section>
        )}
        <section className={styles['our-team']}>
          <div className={styles['content']}>
            <h2>Our Team</h2>
            <div className={styles['people-wrapper']}>
              {ourTeam.map(person => {
                if (person.fields.fullBioPage) {
                  return (
                    <Link href={`/our-team/${person.fields.slug}`} className={styles['person']} key={person.sys.id}>
                      <Image
                        className={styles['headshot']}
                        src={`https:${person.fields.photo.fields.file.url}`}
                        alt={person.fields.name}
                        fill
                        sizes="100vw" />
                      <div className={styles['card']}>
                        <h5>{person.fields.name}</h5>
                        <p>{person.fields.jobTitle}</p>
                      </div>
                    </Link>
                  );
                } else {
                  return (
                    <div className={styles['person']} key={person.sys.id} >
                      <Image
                        className={styles['headshot']}
                        src={`https:${person.fields.photo.fields.file.url}`}
                        alt={person.fields.name}
                        fill
                        sizes="100vw" />
                      <div className={styles['card']}>
                        <h5>{person.fields.name}</h5>
                        <p>{person.fields.jobTitle}</p>
                      </div>
                    </div>
                  );
                }
                
              })}
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
