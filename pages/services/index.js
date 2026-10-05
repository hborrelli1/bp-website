import {createClient} from 'contentful';
import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';
import FooterCta from '../../components/FooterCta/FooterCta';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from "next/image";
import { useRouter } from 'next/router';
import _ from 'lodash';
import { compactFields, mapAsset } from '../../lib/contentfulPageData';

const mapProjectCard = (project) => ({
  fields: compactFields({
    projectTitle: project.fields.projectTitle,
    slug: project.fields.slug,
    shortSummary: project.fields.shortSummary,
    thumbnailImage: mapAsset(project.fields.thumbnailImage),
  }),
});

const mapService = (service) => ({
  sys: { id: service.sys.id },
  fields: compactFields({
    service: service.fields.service,
    servicesUrl: service.fields.servicesUrl,
    serviceDescriptionHeading: service.fields.serviceDescriptionHeading,
    serviceDescription: service.fields.serviceDescription,
    mainImage: mapAsset(service.fields.mainImage),
    features: service.fields.features.map(feature => ({ sys: { id: feature.sys.id } })),
    serviceDescriptionHeading2: service.fields.serviceDescriptionHeading2,
    serviceDescription2: service.fields.serviceDescription2,
    mainImage2: mapAsset(service.fields.mainImage2),
    features2: service.fields.features2?.map(feature => ({ sys: { id: feature.sys.id } })),
    featuredProjectsSubtitle: service.fields.featuredProjectsSubtitle,
    featuredProjectsSectionTitle: service.fields.featuredProjectsSectionTitle,
    featuredProjects: service.fields.featuredProjects?.map(mapProjectCard),
  }),
});

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const servicesData = await client.getEntries({ content_type: 'servicesPage', include: 2 });
  const themeConfig = await client.getEntries({ content_type: 'themeConfig' });
  const iconsWithText = await client.getEntries({ content_type: 'iconWithText' });
  const servicesPage = servicesData.items[0];

  return {
    props: {
      servicesPageData: {
        fields: compactFields({
          pageTitle: servicesPage.fields.pageTitle,
          pageDescription: servicesPage.fields.pageDescription,
          services: servicesPage.fields.services.map(mapService),
          backgroundImage: mapAsset(servicesPage.fields.backgroundImage),
          footerCta: {
            fields: compactFields({
              copy: servicesPage.fields.footerCta.fields.copy,
              ctaText: servicesPage.fields.footerCta.fields.ctaText,
              ctaLink: servicesPage.fields.footerCta.fields.ctaLink,
              backgroundImage: mapAsset(servicesPage.fields.footerCta.fields.backgroundImage),
            }),
          },
        }),
      },
      themeConfig: {
        fields: {
          backgroundTexture: mapAsset(themeConfig.items[0].fields.backgroundTexture),
        },
      },
      iconsWithText: iconsWithText.items.map(icon => ({
        sys: { id: icon.sys.id },
        fields: compactFields({
          icon: mapAsset(icon.fields.icon),
          iconText: icon.fields.iconText,
        }),
      })),
    },
    revalidate: 300,
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
                          height={service.fields.mainImage.fields.file.details.image.height}
                          alt={service.fields.serviceDescriptionHeading}
                          style={{
                            maxWidth: "100%",
                            height: "auto"
                          }} />
                      </div>
                      <div className="content-col">
                        <h2>{service.fields.serviceDescriptionHeading}</h2>
                        <div className="body-copy">{documentToReactComponents(service.fields.serviceDescription)}</div>
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
                                  style={{
                                    maxWidth: "100%",
                                    height: "auto"
                                  }} />
                              </div>
                              <h3>{featureData.fields.iconText}</h3>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {secondSection && (
                      <div className="service-content-body">
                        <div className="service-image-col">
                          <Image
                            src={`https:${service.fields.mainImage2.fields.file.url}`}
                            width={service.fields.mainImage2.fields.file.details.image.width}
                            height={service.fields.mainImage2.fields.file.details.image.height}
                            alt={service.fields.serviceDescriptionHeading2}
                            style={{
                              maxWidth: "100%",
                              height: "auto"
                            }} />
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
                                    style={{
                                      maxWidth: "100%",
                                      height: "auto"
                                    }} />
                                </div>
                                <h3>{featureData.fields.iconText}</h3>
                              </div>
                            );
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
