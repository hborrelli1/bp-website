import {createClient} from 'contentful';
import { useEffect, useState } from 'react';
import FooterCta from '../../components/FooterCta/FooterCta';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';
import safeJsonStringify from 'safe-json-stringify';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'ourWork' });

  const stringifiedItems = safeJsonStringify(res);
  const data = JSON.parse(stringifiedItems);

  return {
    props: {
      pageData: data.items[0]
    },
    revalidate: 1,
  }
}

const OurWork = ({pageData}) => {
  const {
    backgroundImage,
    featuredProjects,
    footerCta,
    pageDescription,
    pageTitle,
  } = pageData.fields;

  const industryKey = {
    'all': 'All',
    'aviation+transportation': 'Aviation + Transportation',
    'government/municipal': 'Government / Municipal',
    'education': 'Education',
    'commercial+corporate': 'Commercial + Corporate',
    'civic+cultural': 'Civic + Cultural',
    'parks+recreation': 'Parks + Recreation',
    'hospitality': 'Hospitality',
    'residential': 'Residential',
  }

  const servicesKey = {
    'all': 'All',
    'architecture': 'Architecture',
    'construction-management': 'Construction Management',
    'interior-design': 'Interior Design',
    'landscape+recreation': 'Landscape + Recreation',
    'design': 'Design',
    'restoration/adaptive-re-use': 'Restoration/Adaptive Re-Use',
  }

  const [projects, setProjects] = useState(null);
  const [industryTags, setIndustryTags] = useState(null);
  const [serviceTags, setServiceTags] = useState(null);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [displayIndustryMenu, setDisplayIndustryMenu] = useState(false);
  const [displayServiceMenu, setDisplayServiceMenu] = useState(false);
  
  useEffect(() => {
    setProjects(featuredProjects);
  },[featuredProjects, projects])

  const renderProjects = (projects) => {
    let projectsToRender = [];

    if (!projects) {
      return (<p>no projects...</p>)
    } 

    if (industryFilter !== 'all' && serviceFilter !== 'all') {
      const filteredProjects = projects.filter(proj => (
        proj.fields.industry === industryKey[industryFilter] 
        && proj.fields.serviceType === servicesKey[serviceFilter])
      );
      projectsToRender.push(...filteredProjects);
    } else if (industryFilter !== 'all') {
      const filteredProjects = projects.filter(proj => 
        proj.fields.industry === industryKey[industryFilter]);
      projectsToRender.push(...filteredProjects);
    } else if (serviceFilter !== 'all') {
      const filteredProjects = projects.filter(proj => 
        proj.fields.serviceType === servicesKey[serviceFilter]);
      projectsToRender.push(...filteredProjects);
    } else {
      projectsToRender.push(...projects);
    }

    return projectsToRender.map(project => {
      const { 
        industry,
        location,
        projectTitle,
        serviceType,
        thumbnailImage,
        slug,
      } = project.fields;

      return (
        <Link href={`/our-work/${slug}`} key={project.sys.id}>
          <a className="project" style={{backgroundImage: `url(https:${thumbnailImage.fields.file.url})`}}>
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
          </a>
        </Link>
      )
    });
  }

  const toggleMenu = (filterType) => {
    if (filterType === 'industry') {
      setDisplayIndustryMenu(!displayIndustryMenu);
    } else {
      setDisplayServiceMenu(!displayServiceMenu);
    }
  }

  const changeFilter = (item, filter) => {
    if (filter === 'industry') {
      setIndustryFilter(item)
      setDisplayIndustryMenu(false)
    } else {
      setServiceFilter(item)
      setDisplayServiceMenu(false)
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
        <div className="filters-content">
          <span>Filter Projects:</span>
          <div className={`filter ${displayIndustryMenu ? 'open' : ''}`}>
            <button 
              type="button" 
              className="filter-button" 
              onClick={() => toggleMenu('industry')}
            >
              {industryFilter === 'all' ? 'Industry' : industryKey[industryFilter]} <span className="filter-button-icon">
                <Image 
                  src="/assets/icons/down-chevron@2x.png" 
                  width="15px" 
                  height="8px" 
                  alt="Industry Filter Arrow"
                />
              </span>
            </button>
            <div className="menu">
              {_.map(industryKey, (item, index) => 
                <div key={index} className="filter-item" onClick={() => changeFilter(index, 'industry')}>{item}</div>)}
            </div>
          </div>
          <div className={`filter ${displayServiceMenu ? 'open' : ''}`}>
            <button 
              type="button" 
              className="filter-button" 
              onClick={() => toggleMenu('service')}
            >
              {serviceFilter === 'all' ? 'Service' : servicesKey[serviceFilter]} <span className="filter-button-icon">
                <Image 
                  src="/assets/icons/down-chevron@2x.png" 
                  width="15px" 
                  height="8px" 
                  alt="Industry Filter Arrow"
                />
              </span>
            </button>
            <div className="menu">
              {_.map(servicesKey, (item, index) => 
                <div key={index} className="filter-item" onClick={() => changeFilter(index, 'service')}>{item}</div>)}
            </div>
          </div>
        </div>
      </div>
      <section className="featured-projects">
        {renderProjects(projects)}
        
          {/* {industryFilter === 'all' 
            ? renderProjects(projects)
            : renderProjects(projects.filter(proj => proj.fields.industry === industryKey[industryFilter]))
          } */}
        
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
