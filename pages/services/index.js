import {createClient} from 'contentful';
import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';

export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'servicesPage' });

  return {
    props: {
      servicesPageData: res.items[0]
    },
    revalidate: 1,
  }
}

const Services = ({ servicesPageData }) => {
  console.log('servicesPageData:', servicesPageData);
  
  const [serviceTabs, setServiceTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  const {
    pageTitle, 
    pageDescription,
    services,
    servicesCta,
    backgroundImage,
  } = servicesPageData.fields;

  useEffect(() => {
    const tabs = services.reduce((acc, service, index) => {
      acc[index] = service.fields.service
      return acc;
    },[]);
    setServiceTabs(tabs)
  }, [])

  const handleTabChange = (index) => {
    setActiveTab(index);
  }

  return (
    <article>
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <ul className='services-tabs'>
        {serviceTabs.map((tab, index) => (
          <li
            className={index === activeTab ? 'active' : ''}
            onClick={() => handleTabChange(index)} 
            key={tab}
          >{tab}</li>
        ))}
      </ul>
      <section className="services-tab-content">
          {
            services.reduce((acc, service, index) => {
              acc[index] = (
                <div style={{ display: index === activeTab ? 'block' : 'none' }}>
                  <Image 
                    src={`https:${service.fields.mainImage.fields.file.url}`} 
                    width={service.fields.mainImage.fields.file.details.image.width} 
                    height={service.fields.mainImage.fields.file.details.image.height} />
                  <h2>{service.fields.serviceDescriptionHeading}</h2>
                  {documentToReactComponents(service.fields.serviceDescription)}
                  
                </div>
              );

              return acc;
            },[])
          }
      </section>
    </article>
  );
}
 
export default Services;
