import {createClient} from 'contentful';
import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import FooterCta from '../../components/FooterCta/FooterCta';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import servicesDataPreval from '../../contentfulApi/services-data.preval';
import _ from 'lodash';

const fetcher = (url) => fetch(url).then((res) => res.json())

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
  const router = useRouter();
  const [serviceTabs, setServiceTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [icons, setIcons] = useState([]);
  const [footerLink, setFooterLink] = useState('');

  const {
    pageTitle, 
    pageDescription,
    services,
    servicesCta,
    backgroundImage,
    footerCta
  } = servicesPageData.fields;

  const { url: themeBackgroundImageUrl } = themeConfig.fields.backgroundTexture.fields.file;
  useEffect(() => {
    // Generate Tabs Objects
    const tabs = services.reduce((acc, service, index) => {
      acc[index] = { title: service.fields.service, id: service.fields.servicesUrl }
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

  useEffect(() => {
    const url = router.asPath;
    const paramRegex = /#+.+$/;
    const specificService = url.match(paramRegex);

    console.log('specificServce: ', specificService);
    console.log('serviceTabs:', serviceTabs);

    if (router.asPath.includes('#') && serviceTabs) {
      console.log('true......');

      const indexOfTab = _.findIndex(serviceTabs, (serviceTab => { 
        console.log('specificService[0]:', specificService[0]);
        console.log('serviceTab.id:', serviceTab.id);
        console.log('specificService[0].includes(serviceTab.id):', specificService[0].includes(serviceTab.id));

        return specificService[0] === `#${serviceTab.id}`
      }));

      console.log('indexOfTab:', indexOfTab);
      setActiveTab(indexOfTab)

    } 

  },[router, serviceTabs])

  const handleTabChange = (index) => {
    setActiveTab(index);
    // push id to url
    router.push(`/services#${serviceTabs[index].id}`, null, {shallow:true})
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
          {serviceTabs.map((service, index) => (
            <li
              className={index === activeTab ? 'active' : ''}
              onClick={() => handleTabChange(index)} 
              key={service.title}
            >{service.title}</li>
          ))}
        </ul>
        <section className="services-tab-content">
            {
              services.reduce((acc, service, index) => {
                const secondSection = service.fields.serviceDescriptionHeading2 
                  && service.fields.serviceDescription2 
                  && service.fields.mainImage2 
                  && service.fields.features2;
                
                acc[index] = (
                    <div
                      className="service-content"
                      style={{ display: index === activeTab ? 'flex' : 'none' }} 
                      key={service.sys.id}
                    >
                      <div className="service-content-body">
                        <div className="service-image-col">
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
                      {secondSection && (
                        <div className="service-content-body">
                          <div className="service-image-col">
                            <Image 
                              src={`https:${service.fields.mainImage2.fields.file.url}`} 
                              width={service.fields.mainImage2.fields.file.details.image.width} 
                              height={service.fields.mainImage2.fields.file.details.image.height} />
                          </div>
                          <div className="content-col">
                            <h2>{service.fields.serviceDescriptionHeading2}</h2>
                            {documentToReactComponents(service.fields.serviceDescription2)}
                          </div>
                          <div className="service-icons">
                            {service.fields.features2.map(feature => {
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
                      )}
                    </div>
                      
                    
                );

                return acc;
              },[])
            }


        </section>
      </div>
      <FooterCta ctaData={{
        copy: footerCta.fields.copy,
        buttonText: footerCta.fields.ctaText,
        buttonUrl: footerCta.fields.ctaLink,
        backgroundImage: footerCta.fields.backgroundImage
      }} />
    </article>
  );
}
 
export default Services;
