import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useEffect, useState } from 'react';
import FooterCta from '../../components/FooterCta/FooterCta';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'ourWork' });

  return {
    props: {
      pageData: res.items[0]
    },
    revalidate: 1,
  }
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

}

const OurWork = ({pageData}) => {
  console.log('pageData:', pageData);
  const {
    featuredProjects,
    footerCta,
    pageDescription,
    pageTitle,
  } = pageData.fields;

  const [projects, setProjects] = useState(null);
  const [industryTags, setIndustryTags] = useState(null);
  const [serviceTags, setServiceTags] = useState(null);
  
  useEffect(() => {
    setProjects(featuredProjects);
  },[featuredProjects, projects])

  const renderProjects = (projects) => {
    
    if (!projects) {
      return (<p>no projects...</p>)
    } else {
      return projects.map(project => {
        const { 
          location,
          projectTitle,
          tags,
          serviceType,
          thumbnailImage,
        } = project.fields;
        
        return (
          <div className="project" key={project.sys.id} style={{backgroundImage: `url(https:${thumbnailImage.fields.file.url})`}}>
            <div className="project-thumb-bg"></div>
            <div className="meta-data">
              <div className="title">
                <h2>{projectTitle}</h2>
                <p>{location}</p>
              </div>
              <div className="tags">
                {`Service: ${serviceType}`}
              </div>
            </div>
          </div>
        )
      })
    }
  }

  return (
    <article className="our-work-wrapper">
      <header>
        <div className="title-col">
          <h1>{pageTitle}</h1>
        </div>
        <div className="info-col">
          {documentToReactComponents(pageDescription)}
        </div>
      </header>
      <div className="filter-bar">
        <p>Filters here...</p>
      </div>
      <section className="featured-projects">
        {projects ? renderProjects(projects) : <div>no projects...</div>}
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
  );
}
 
export default OurWork;
