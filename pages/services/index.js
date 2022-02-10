import {createClient} from 'contentful';
import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';
import FooterCta from '../../components/FooterCta/FooterCta';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from 'next/image';
import { useRouter } from 'next/router';
import safeJsonStringify from 'safe-json-stringify';
import _ from 'lodash';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const servicesData = await client.getEntries({ content_type: 'servicesPage', include: 2 });
  const themeConfig = await client.getEntries({ content_type: 'themeConfig' });
  const iconsWithText = await client.getEntries({ content_type: 'iconWithText' });

  const stringifiedItems = safeJsonStringify(servicesData);
  const servicesDataItems = JSON.parse(stringifiedItems);

  return {
    props: {
      servicesPageData: servicesDataItems.items[0],
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
  }, [services]);

  useEffect(() => {
    const url = router.asPath;
    const paramRegex = /#+.+$/;
    const specificService = url.match(paramRegex);

    if (router.asPath.includes('#') && serviceTabs) {
      const indexOfTab = _.findIndex(serviceTabs, (serviceTab => { 
        return specificService[0] === `#${serviceTab.id}`
      }));

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
                            height={service.fields.mainImage.fields.file.details.image.height} alt={service.fields.serviceDescriptionHeading} />
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
                                    alt={`${featureData.fields.iconText} icon`}
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
                              height={service.fields.mainImage2.fields.file.details.image.height} alt={service.fields.serviceDescriptionHeading2} />
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
                                      alt={featureData.fields.iconText}
                                    />
                                  </div>
                                  <h3>{featureData.fields.iconText}</h3>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                      <ThreeColumnFeaturedPosts info={{
                        type: "our-work",
                        subTitle: service.fields.featuredProjectsSubtitle,
                        title: service.fields.featuredProjectsSectionTitle,
                        posts: service.fields.featuredProjects
                      }} />
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
