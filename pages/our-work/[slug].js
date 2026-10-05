import {createClient} from 'contentful';
import Image from "next/image";
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FooterCta from '../../components/FooterCta/FooterCta';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';
import { compactFields, mapAsset } from '../../lib/contentfulPageData';

const mapProjectCard = (project) => ({
  fields: compactFields({
    projectTitle: project.fields.projectTitle,
    slug: project.fields.slug,
    shortSummary: project.fields.shortSummary,
    thumbnailImage: mapAsset(project.fields.thumbnailImage),
  }),
});

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: 'projects',
    select: 'sys.id,fields.slug',
  });

  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const {items} = await client.getEntries({ 
    content_type: 'projects',
    'fields.slug': params.slug,
    select: 'sys.id,fields.client,fields.cost,fields.footerCta,fields.galleryImages,fields.location,fields.projectTitle,fields.size,fields.summary,fields.specSheet,fields.featuredProjects',
  });

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const project = items[0];
  return {
    props: {
      project: {
        fields: compactFields({
          client: project.fields.client,
          cost: project.fields.cost,
          footerCta: project.fields.footerCta && {
            fields: compactFields({
              copy: project.fields.footerCta.fields.copy,
              ctaText: project.fields.footerCta.fields.ctaText,
              ctaLink: project.fields.footerCta.fields.ctaLink,
              backgroundImage: mapAsset(project.fields.footerCta.fields.backgroundImage),
            }),
          },
          galleryImages: project.fields.galleryImages?.map(mapAsset),
          industry: project.fields.industry,
          location: project.fields.location,
          projectTitle: project.fields.projectTitle,
          size: project.fields.size,
          slug: project.fields.slug,
          summary: project.fields.summary,
          specSheet: mapAsset(project.fields.specSheet),
          featuredProjects: project.fields.featuredProjects?.map(mapProjectCard),
        }),
      },
    },
    revalidate: 300,
  }
}

const Project = ({ project }) => {
  const {
    client,
    cost,
    footerCta,
    galleryImages,
    industry,
    location,
    projectExcerpt,
    projectTitle,
    serviceType,
    size,
    slug,
    summary,
    specSheet,
    thumbnailImage,
    featuredProjects,
  } = project.fields;
  
  return (
    <div className="project-wrapper">
      <header style={{ backgroundImage: `url(https:${galleryImages[0].fields.file.url})`}}>
        <div className="overlay bg-overlay-1"></div>
        <div className="overlay bg-overlay-2"></div>
        <div className="overlay bg-overlay-3"></div>
        <div className="header-content">
          <h1>{projectTitle}</h1>
        </div>
      </header>
      <article className="project-body">
        <div className="project-content">
          <div className="project-info">
            <section className="details project-style">
              <h2>Details</h2>
              {client && <p>Client: {client}</p>}
              {location && <p>Location: {location}</p>}
              {cost && <p>Cost: {cost}</p>}
              {size && <p>Size: {size}</p>}
            </section>
            <section className="summary project-style">
              <h2>Summary</h2>
              <div className="body-copy">{documentToReactComponents(summary)}</div>
              {specSheet && (
                <Link href={`https:${specSheet.fields.file.url}`} className="spec-sheet">
                  Download Spec Sheet
                </Link>
              )}
            </section>
          </div>
          <section className="gallery project-style">
            <h2>Gallery</h2>
            <div className="gallery-carousel">
              {galleryImages && <CarouselComponent items={galleryImages} type="images" />}
            </div>
          </section>
        </div>
      </article>
      {featuredProjects && (
        <ThreeColumnFeaturedPosts info={{
          subTitle: "More Success Stories",
          title: '', 
          posts: featuredProjects,
          type: "our-work"
        }} />
      )}
      {footerCta && (
        <FooterCta ctaData={{
          copy: footerCta.fields.copy,
          buttonText: footerCta.fields.ctaText,
          buttonUrl: footerCta.fields.ctaLink,
          backgroundImage: footerCta.fields.backgroundImage
        }} />
      )}
    </div>
  );
}
 
export default Project;
