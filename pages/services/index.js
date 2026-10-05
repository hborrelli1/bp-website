import { useState, useEffect } from 'react';
import TwoColumnHeader from '../../components/TwoColumnHeader/TwoColumnHeader';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';
import FooterCta from '../../components/FooterCta/FooterCta';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Image from "next/image";
import { useRouter } from 'next/router';
import _ from 'lodash';
import { compactFields, fetchContentfulGraphQL, mapGraphQLAsset } from '../../lib/contentfulPageData';

const mapProjectCard = (project) => ({
  fields: compactFields({
    projectTitle: project.projectTitle,
    slug: project.slug,
    shortSummary: project.shortSummary,
    thumbnailImage: mapGraphQLAsset(project.thumbnailImage),
  }),
});

const mapService = (service) => ({
  sys: { id: service.sys.id },
  fields: compactFields({
    service: service.service,
    servicesUrl: service.servicesUrl,
    serviceDescriptionHeading: service.serviceDescriptionHeading,
    serviceDescription: service.serviceDescription?.json,
    mainImage: mapGraphQLAsset(service.mainImage),
    features: service.featuresCollection.items.map(feature => ({ sys: { id: feature.sys.id } })),
    serviceDescriptionHeading2: service.serviceDescriptionHeading2,
    serviceDescription2: service.serviceDescription2?.json,
    mainImage2: mapGraphQLAsset(service.mainImage2),
    features2: service.features2Collection.items.map(feature => ({ sys: { id: feature.sys.id } })),
    featuredProjectsSubtitle: service.featuredProjectsSubtitle,
    featuredProjectsSectionTitle: service.featuredProjectsSectionTitle,
    featuredProjects: service.featuredProjectsCollection.items.map(mapProjectCard),
  }),
});

export const getStaticProps = async () => {
  const data = await fetchContentfulGraphQL(`
    query ServicesAndTheme {
      servicesPageCollection(limit: 1) {
        items {
          pageTitle
          pageDescription
          backgroundImage { url title width height }
          footerCta {
            copy
            ctaText
            ctaLink
            backgroundImage { url title width height }
          }
          servicesCollection(limit: 10) {
            items {
              sys { id }
              service
              servicesUrl
              serviceDescriptionHeading
              serviceDescription { json }
              mainImage { url title width height }
              featuresCollection(limit: 10) { items { sys { id } } }
              serviceDescriptionHeading2
              serviceDescription2 { json }
              mainImage2 { url title width height }
              features2Collection(limit: 10) { items { sys { id } } }
              featuredProjectsSubtitle
              featuredProjectsSectionTitle
              featuredProjectsCollection(limit: 10) {
                items {
                  projectTitle
                  slug
                  shortSummary
                  thumbnailImage { url title width height }
                }
              }
            }
          }
        }
      }
      themeConfigCollection(limit: 1) {
        items { backgroundTexture { url title width height } }
      }
      iconWithTextCollection(limit: 100) {
        items {
          sys { id }
          icon { url title width height }
          iconText
        }
      }
    }
  `);
  const servicesPage = data.servicesPageCollection.items[0];

  return {
    props: {
      servicesPageData: {
        fields: compactFields({
          pageTitle: servicesPage.pageTitle,
          pageDescription: servicesPage.pageDescription,
          services: servicesPage.servicesCollection.items.map(mapService),
          backgroundImage: mapGraphQLAsset(servicesPage.backgroundImage),
          footerCta: {
            fields: compactFields({
              copy: servicesPage.footerCta.copy,
              ctaText: servicesPage.footerCta.ctaText,
              ctaLink: servicesPage.footerCta.ctaLink,
              backgroundImage: mapGraphQLAsset(servicesPage.footerCta.backgroundImage),
            }),
          },
        }),
      },
      themeConfig: {
        fields: {
          backgroundTexture: mapGraphQLAsset(data.themeConfigCollection.items[0].backgroundTexture),
        },
      },
      iconsWithText: data.iconWithTextCollection.items.map(icon => ({
        sys: { id: icon.sys.id },
        fields: compactFields({
          icon: mapGraphQLAsset(icon.icon),
          iconText: icon.iconText,
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
