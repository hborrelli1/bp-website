import Head from 'next/head';
import Link from 'next/link';
import Image from "next/image";
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FooterCta from '../../components/FooterCta/FooterCta';
import styles from './about.module.scss'
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import { compactFields, fetchContentfulGraphQL, mapGraphQLAsset } from '../../lib/contentfulPageData';

const mapAboutData = (entry) => {
  return {
    fields: compactFields({
      aboutSubTitle: entry.aboutSubTitle,
      descriptionPhoto: mapGraphQLAsset(entry.descriptionPhoto),
      footerCta: {
        fields: {
          copy: entry.footerCta.copy,
          ctaText: entry.footerCta.ctaText,
          backgroundImage: mapGraphQLAsset(entry.footerCta.backgroundImage),
        },
      },
      headerPhoto: mapGraphQLAsset(entry.headerPhoto),
      mainDescription: entry.mainDescription.json,
      mainTitle: entry.mainTitle,
      ourTeam: entry.ourTeamCollection.items.map(person => ({
        sys: { id: person.sys.id },
        fields: {
          fullBioPage: person.fullBioPage,
          slug: person.slug,
          photo: mapGraphQLAsset(person.photo),
          name: person.name,
          jobTitle: person.jobTitle,
        },
      })),
      pageTitle: entry.pageTitle,
      qualityTitle1: entry.qualityTitle1,
      qualityTitle2: entry.qualityTitle2,
      qualityTitle3: entry.qualityTitle3,
      qualityTitle4: entry.qualityTitle4,
      qualityDescription1: entry.qualityDescription1.json,
      qualityDescription2: entry.qualityDescription2.json,
      qualityDescription3: entry.qualityDescription3.json,
      qualityDescription4: entry.qualityDescription4.json,
      shortDescription: entry.shortDescription.json,
      testimonials: entry.testimonialsCollection.items.map(testimonial => ({
        sys: { id: testimonial.sys.id },
        fields: {
          testimonial: testimonial.testimonial.json,
          name: testimonial.name,
          title: testimonial.title,
          projectReference: testimonial.projectReference && {
            fields: { slug: testimonial.projectReference.slug },
          },
        },
      })),
    }),
  };
};

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  const data = await fetchContentfulGraphQL(`
    query AboutAndTheme {
      aboutCollection(limit: 1) {
        items {
          aboutSubTitle
          descriptionPhoto { url title width height }
          footerCta { copy ctaText backgroundImage { url title width height } }
          headerPhoto { url title width height }
          mainDescription { json }
          mainTitle
          ourTeamCollection(limit: 30) {
            items { sys { id } fullBioPage slug photo { url title width height } name jobTitle }
          }
          pageTitle
          qualityTitle1
          qualityTitle2
          qualityTitle3
          qualityTitle4
          qualityDescription1 { json }
          qualityDescription2 { json }
          qualityDescription3 { json }
          qualityDescription4 { json }
          shortDescription { json }
          testimonialsCollection(limit: 20) {
            items {
              sys { id }
              testimonial { json }
              name
              title
              projectReference { __typename ... on Projects { slug } }
            }
          }
        }
      }
      themeConfigCollection(limit: 1) {
        items { backgroundTexture { url } }
      }
    }
  `);
  const aboutData = mapAboutData(data.aboutCollection.items[0]);
  const themeBackgroundUrl = data.themeConfigCollection.items[0].backgroundTexture.url.replace(/^https?:/, '');

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
