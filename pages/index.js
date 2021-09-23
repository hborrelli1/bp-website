import Head from 'next/head';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
// import homepageData from '../contentfulApi/homepage-data.preval';
// import servicesData from '../contentfulApi/services-data.preval';
// import themeConfigData from '../contentfulApi/contentful-data.preval'; 
import { useEffect, useState } from 'react';
import _ from 'lodash';

export default function Home(props) {
  // const {
  //   heroImage, 
  //   heroImageText, 
  //   heroImageTitle, 
  //   ourServicesTitle,
  //   ourServicesDescription,
  //   whyBpDescription, 
  //   whyBpTitle
  // } = homepageData.homePageCollection.items[0];

  // const {
  //   backgroundTexture
  // } = themeConfigData.themeConfigCollection.items[0];

  // const {
  //   items, 
  // } = servicesData.servicesCollection;

  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState({});

  // console.log('ourServicesTitle:', ourServicesTitle);
  // console.log('ourServicesDescription:', ourServicesDescription);
  // console.log('homepageData:', homepageData);

  // useEffect(() => {
  //   setServices(items);
  //   setActiveService(items[0]);
  // },[])

  // useEffect(() => {
  //   if (services) {
  //     setActiveService(services[0])
  //   }
  // }, services)

  // console.log('services: ', services);

  // const handleServiceUpdate = (id) => {
  //   const newActiveService = services.find(service => service.sys.id === id);
  //   setActiveService(newActiveService);
  // }
  // console.log('activeService:', activeService);

  return (
    <>
      <Head>
        <title>Borrelli + Partners | Home</title>
        <meta name="keywords" content="Architect" />
        <link rel="stylesheet" href="https://use.typekit.net/rrc4xhb.css"></link>
      </Head>
      <div className={"home"}>
        {/* <div className="home-hero-banner w-screen h-screen flex items-center justify-center px-20 py-4" style={{backgroundImage: heroImage.url}}>
          <div className="flex items-top max-w-900 center">
            <h1 className="w-1/2 font-din text-5xl text-white font-regular tracking-wide">{heroImageTitle}</h1>
            <div className="w-1/2 font-muli text-white text-sm tracking-wide leading-relaxed">{documentToReactComponents(heroImageText.json)}</div>
          </div>
        </div> */}
        <div className="services w-screen flex justify-center p-20">
          <div className="w-screen flex justify-center max-w-900">
            <div className="content-column w-1/2">
              {/* <h3 className="font-din">{ourServicesTitle}</h3>
              {documentToReactComponents(ourServicesDescription.json)} */}
            </div>
            <div className="services-column w-1/2 flex flex-col items-start pl-10">{
              // services && services.map(service => (
              //   <button 
              //     type="button" 
              //     className={service === activeService ? 'active' : ''}
              //     key={service.sys.id}
              //     onClick={() => handleServiceUpdate(service.sys.id)}
              //   >{service.service}</button>
              // ))
            }</div>
          </div>
        </div>
      </div>
      {/* <style jsx>{`
        .home-hero-banner {
          background-image: url(${heroImage.url});
          background-size: cover;
          background-position: center;
        }
        .services {
          background-image: url(${backgroundTexture.url});
          background-size: cover;
          background-position: bottom;
        }
      `}</style> */}
    </>
  )
}
