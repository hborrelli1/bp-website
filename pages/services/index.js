import {createClient} from 'contentful';
import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import servicesDataPreval from '../../contentfulApi/services-data.preval';

export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const servicesData = await client.getEntries({ content_type: 'servicesPage' });
  const themeConfig = await client.getEntries({ content_type: 'themeConfig' });
  const iconsWithText = await client.getEntries({ content_type: 'iconWithText' });

  return {
    props: {
      servicesPageData: servicesData.items[0],
      themeConfig: themeConfig.items[0],
      iconsWithText: iconsWithText.items,
    },
    revalidate: 1,
  }
}

const Services = ({ servicesPageData, themeConfig, iconsWithText }) => {
  console.log('servicesPageData:', servicesPageData);
  console.log('themeConfig:', themeConfig);
  console.log('iconsWithText:', iconsWithText);
  
  const [serviceTabs, setServiceTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [icons, setIcons] = useState([]);

  const {
    pageTitle, 
    pageDescription,
    services,
    servicesCta,
    backgroundImage,
  } = servicesPageData.fields;

  const { url: themeBackgroundImageUrl } = themeConfig.fields.backgroundTexture.fields.file;

  useEffect(() => {
    // Generate Tabs Objects
    const tabs = services.reduce((acc, service, index) => {
      acc[index] = service.fields.service
      return acc;
    },[]);
    setServiceTabs(tabs)
  }, []);

  // useEffect(() => {
  //   const client = createClient({
  //     accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  //     space: process.env.CONTENTFUL_SPACE_ID,
  //   });
    
  //   // Generate Icons with Text objects
  //   // const iconObjects = [];
  //   servicesPageData.fields.services.forEach(service => {
  //     service.fields.features.forEach(feature => {
  //       client.getEntry(feature.sys.id)
  //         .then((entry) => console.log(entry))
  //         .catch(console.error)
        
  //     })
  //   })
  // }, [])

  const handleTabChange = (index) => {
    setActiveTab(index);
  }

  return (
    <article className="services">
      <TwoColumnHeader 
        title={pageTitle}
        copy={pageDescription}
        image={backgroundImage}
      />
      <div className="services-container" style={{backgroundImage: `url(https:${themeBackgroundImageUrl})`}}>
        {/* <div> */}
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
                console.log('service:', service);
                acc[index] = (
                  <div
                    className="service-content"
                    style={{ display: index === activeTab ? 'flex' : 'none' }} 
                    key={service.sys.id}
                  >
                    <div 
                      className="service-image-col"
                    >
                      <Image 
                        src={`https:${service.fields.mainImage.fields.file.url}`} 
                        width={service.fields.mainImage.fields.file.details.image.width} 
                        height={service.fields.mainImage.fields.file.details.image.height} />
                    </div>
                    <div className="content-col">
                      <h2>{service.fields.serviceDescriptionHeading}</h2>
                      {documentToReactComponents(service.fields.serviceDescription)}
                    </div>
                    <div className="service-icons">
                      {service.fields.features.map(feature => {
                        const featureData = iconsWithText.find(icon => icon.sys.id === feature.sys.id);
                        return (
                          <div className="icon" key={feature.sys.id}>
                            <div className="img-wrap"> 
                              <Image 
                                src={`https:${featureData.fields.icon.fields.file.url}`} 
                                width="50" 
                                height="50"
                              />
                            </div>
                            <h3>{featureData.fields.iconText}</h3>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );

                return acc;
              },[])
            }


        </section>
      </div>
    </article>
  );
}
 
export default Services;
