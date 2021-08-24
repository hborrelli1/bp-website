import Head from 'next/head';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import homepageData from '../contentfulApi/homepage-data.preval';
import servicesData from '../contentfulApi/services-data.preval';
import themeConfigData from '../contentfulApi/contentful-data.preval'; 
import { useEffect, useState } from 'react';

export default function Home(props) {
  console.log('servicesData:', servicesData);
  const {
    heroImage, 
    heroImageText, 
    heroImageTitle, 
    whyBpDescription, 
    whyBpTitle
  } = homepageData.homePageCollection.items[0];
  const {
    backgroundTexture
  } = themeConfigData.themeConfigCollection.items[0];
  const {
    items 
  } = servicesData.servicesCollection.items;

  useEffect(() => {
    setServices(items);
  },[])
  
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(0);

  return (
    <>
      <Head>
        <title>Borrelli + Partners | Home</title>
        <meta name="keywords" content="Architect" />
        <link rel="stylesheet" href="https://use.typekit.net/rrc4xhb.css"></link>
      </Head>
      <div className={"home"}>
        <div className="home-hero-banner w-screen h-screen flex items-center px-20 py-4" style={{backgroundImage: heroImage.url}}>
          <div className="flex items-top max-w-3/4 center">
            <h1 className="w-1/2 font-din text-5xl text-white font-regular tracking-wide">{heroImageTitle}</h1>
            <div className="w-1/2 font-muli text-white text-sm tracking-wide leading-relaxed">{documentToReactComponents(heroImageText.json)}</div>
          </div>
        </div>
        <div className="services">
          <div>test</div>
        </div>
      </div>
      <style jsx>{`
        .home-hero-banner {
          background-image: url(${heroImage.url});
          background-size: cover;
          background-position: center;
        }
        .services {
          background-image: url(${backgroundTexture.url});
          background-size: cover;
          background-position: center;
        }
      `}</style>
    </>
  )
}
