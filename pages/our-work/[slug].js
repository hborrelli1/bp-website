import {createClient} from 'contentful';
import Image from 'next/image';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import FooterCta from '../../components/FooterCta/FooterCta';
import CarouselComponent from '../../components/Carousel/CarouselComponent';
import safeJsonStringify from 'safe-json-stringify';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({content_type: 'projects'})

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
  });

  const stringifiedItems = safeJsonStringify(items);
  const data = JSON.parse(stringifiedItems);

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { project: data[0]},
    revalidate: 1,
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
    thumbnailImage,
    featuredProjects,
  } = project.fields;
  console.log('project', project)
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
              {documentToReactComponents(summary)}
            </section>
          </div>
          <section className="gallery project-style">
            <h2>Gallery</h2>
            <div className="gallery-carousel">
              {galleryImages && <CarouselComponent items={galleryImages} type="images" />}
            </div>
          </section>
          <section>Two Column CTA....</section>
        </div>
      </article>
      <ThreeColumnFeaturedPosts info={{
        subTitle: "More Success Stories",
        title: '', 
        posts: featuredProjects
      }} />
      <FooterCta ctaData={{
        copy: footerCta.fields.copy,
        buttonText: footerCta.fields.ctaText,
        buttonUrl: footerCta.fields.ctaLink,
        backgroundImage: footerCta.fields.backgroundImage
      }} />
    </div>
  );
}
 
export default Project;
