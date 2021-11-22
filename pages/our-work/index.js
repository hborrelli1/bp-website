import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useEffect, useState } from 'react';
import FooterCta from '../../components/FooterCta/FooterCta';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';

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
    backgroundImage,
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
          industry,
          location,
          projectTitle,
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
                <p><span>Industry</span>: {industry}</p>
                <p><span>Service</span>: {serviceType}</p>
              </div>
            </div>
          </div>
        )
      })
    }
  }

  return (
    <article className="our-work-wrapper">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
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
