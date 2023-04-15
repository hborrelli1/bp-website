import { useState } from 'react';
import TwoColumnHeaderGQL from '../../components/TwoColumnHeaderGQL/TwoColumnHeaderGQL';
import FooterCtaGQL from '../../components/FooterCtaGQL/FooterCtaGQL';
import _ from 'lodash';
import Image from 'next/image';
import Link from 'next/link';

export const getStaticProps = async () => {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_KEY;

  const res = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${space}`,
    {
      method: 'POST', // GraphQL *always* uses POST requests!
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`, // add our access token header
      },
      // send the query we wrote in GraphiQL as a string
      body: JSON.stringify({
        // all requests start with "query: ", so we'll stringify that for convenience
        query: `
        {
          ourWorkCollection(limit: 20) {
            items {
              pageTitle
              backgroundImage {
                url
              }
              footerCta {
                copy 
                ctaText
                backgroundImage {
                  url
                }
              }
            }
          }
        }
      `,
      }),
    },
  );

  const res2 = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${space}`,
    {
      method: 'POST', // GraphQL *always* uses POST requests!
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${accessToken}`, // add our access token header
      },
      // send the query we wrote in GraphiQL as a string
      body: JSON.stringify({
        // all requests start with "query: ", so we'll stringify that for convenience
        query: `
        {
          projectsCollection {
            items {
              projectTitle
              thumbnailImage {
                url
              }
              location
              industryTag
              serviceTags
              slug
            }
          }
        }
      `,
      }),
    },
  );

  const data = await res.json()
  const data2 = await res2.json()

  return {
    props: {
    	pageData: data.data.ourWorkCollection.items,
      featuredProjects: data2.data.projectsCollection.items,
    },
  }
}

const OurWork = ({pageData, featuredProjects}) => {

  const {
    backgroundImage,
    footerCta,
    pageDescription,
    pageTitle,
  } = pageData[0];

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

  const [projects, setProjects] = useState(featuredProjects);
  const [industryFilter, setIndustryFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [displayIndustryMenu, setDisplayIndustryMenu] = useState(false);
  const [displayServiceMenu, setDisplayServiceMenu] = useState(false);

  const renderProjects = (projects) => {
    let projectsToRender = [];

    if (industryFilter !== 'all' && serviceFilter !== 'all') {
      const filteredProjects = projects.filter(proj => (
        proj.industryTag.includes(industryKey[industryFilter])  
        && proj.serviceTags.includes(servicesKey[serviceFilter]) )
      );
      projectsToRender.push(...filteredProjects);
    } else if (industryFilter !== 'all') {
      const filteredProjects = projects.filter(proj => 
        proj.industryTag.includes(industryKey[industryFilter]));
      projectsToRender.push(...filteredProjects);
    } else if (serviceFilter !== 'all') {
      const filteredProjects = projects.filter(proj => 
        proj.serviceTags.includes(servicesKey[serviceFilter]));
      projectsToRender.push(...filteredProjects);
    } else {
      projectsToRender.push(...projects);
    }

    if (!projectsToRender.length) {
      return (<p>no projects to display.</p>)
    } 

    return (projectsToRender).map(project => {
      const { 
        industryTag,
        location,
        projectTitle,
        serviceTags,
        thumbnailImage,
        slug,
      } = project;

      return (
        <Link href={`/our-work/${slug}`} key={slug}>
          <a className="project" style={{backgroundImage: `url(${thumbnailImage.url})`}}>
            <div className="project-thumb-bg"></div>
            <div className="meta-data">
              <div className="title">
                <h2>{projectTitle}</h2>
                <p>{location}</p>
              </div>
              <div className="tags">
                <p><span className="industry-label">Industry</span> {industryTag.map(item => <span key={item} className="industry-item">{item}</span>)}</p>
                <p><span className="service-label">Service</span> {serviceTags.map(item => <span key={item} className="service-item">{item}</span>)}</p>
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
      <TwoColumnHeaderGQL 
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
                  width="12px" 
                  height="6px" 
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
                  width="12px" 
                  height="6px"  
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
        {/** create pagination for projects... */}
        {renderProjects(projects)}
      </section>

      <FooterCtaGQL 
          ctaData={{
            copy: footerCta.copy,
            buttonText: footerCta.ctaText,
            buttonUrl: '/services',
            backgroundImage: footerCta.backgroundImage
          }}
        />
    </article>
  );
}
 
export default OurWork;
