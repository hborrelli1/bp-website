import Head from 'next/head';
import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import CarouselComponent from '../components/Carousel/CarouselComponent';

// import homepageData from '../contentfulApi/homepage-data.preval';
// import servicesData from '../contentfulApi/services-data.preval';
// import themeConfigData from '../contentfulApi/contentful-data.preval'; 


// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  // const res = await fetch(/** contentful api here */);
  // const data = await res.json();

  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const homePageData = await client.getEntries({ content_type: 'homePage' });
  const themeConfig = await client.getEntries({ content_type: 'themeConfig' });
  const projects = await client.getEntries({ content_type: 'projects' });
  console.log('homePageData:', homePageData);
  console.log('themeConfig:', themeConfig);

  return {
    props: {
      homePageData: homePageData.items,
      themeConfig: themeConfig.items,
      projects: projects.items,
    },
    revalidate: 1,
  }
}

export default function Home({homePageData, themeConfig, projects}) {
  console.log('themeConfig:', themeConfig);
  console.log('homePageData:', homePageData);
  console.log('projects:', projects);
  const {fields} = homePageData[0];
  const [navHeight, setNavHeight] = useState(60);
  const [heroHeight, setHeroHeight] = useState(0);

  useEffect(() => {
    // Set navbar height on load
    const navElement = document.getElementById('Navbar');
    const navHeight = navElement.clientHeight;
    setNavHeight(navHeight);

    // Set hero height on load
    const heroElement = document.getElementById('heroBanner');
    const heroHeight = heroElement.clientHeight;
    setHeroHeight(heroHeight);
  },[]);

  const heroSectionStyles = {
    backgroundImage: `url(https:${fields.heroImage.fields.file.url})`,
    height: `calc(100vh - ${navHeight}px)`,
  }

  const backgroundSectionStyles = {
    backgroundImage: `url(https:${themeConfig[0].fields.backgroundTexture.fields.file.url})`,
  }

  const featuredProjectItems = projects.reduce((acc, item, index) => {
    acc[index] = {
      thumbnail: item.fields.thumbnailImage,
      title: item.fields.projectTitle,
      excerpt: item.fields.projectExcerpt,
      tags: item.fields.tags,
    }

    return acc;
  }, []);

  const scrollDown = () => {
    window.scrollTo({
      top: heroHeight - navHeight, 
      left: 0,
      behavior: 'smooth'
    });
  }

  return (
    <>
      <Head>
        <title>Borrelli + Partners | Home</title>
        <meta name="keywords" content="Architect" />
        <link rel="stylesheet" href="https://use.typekit.net/rrc4xhb.css"></link>
      </Head>
      <div className={"home"}>
        <div className="home-hero-banner" id="heroBanner" style={heroSectionStyles}>
          <div className="content">
            <h1>{fields.heroImageTitle}</h1>
            <div className="description">{documentToReactComponents(fields.heroImageText)}</div>
          </div>
          <button type="button" className="view-more" onClick={() => scrollDown()}>
            <Image src="/assets/icons/down-arrow-circle-white@2x.png" width="34" height="34" layout="fixed" />
          </button>
        </div>
        <div className="services" style={backgroundSectionStyles}>
          <div className="content">
            <div className="content-column">
              <h2>{fields.ourServicesTitle}</h2>
              {documentToReactComponents(fields.ourServicesDescription)}
            </div>
            <div className="services-column">
              <h3>Our Services</h3>
              <div className="links">
                {fields.ourServicesLinks.map(link => (
                  <Link href={`${link.fields.servicesUrl}`} key={link.sys.id}><a>{link.fields.service}</a></Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="featured-projects">
          <div className="background-block"></div>
          <div className="project-slider">
            <h4>Featured Projects</h4>
            <CarouselComponent items={featuredProjectItems} />
            <a className="view-all-projects" href="/projects">View All Projects +</a>
          </div>
        </div>
        <div className="why-bp" style={backgroundSectionStyles}>
          <div className="why-bp-title">WHY B+P</div>
          <div className="content">
            <div className="content-column">
              <h2>{fields.whyBpTitle}</h2>
              {documentToReactComponents(fields.whyBpDescription)}
            </div>
            <div className="image-column">
              <Image 
                src={`https:${fields.whyBpImage.fields.file.url}`}
                width={fields.whyBpImage.fields.file.details.image.width}
                height={fields.whyBpImage.fields.file.details.image.height}
              />
              <Link href={fields.whyBpLink.fields.slug}>
                <a className="image-button">
                  <span className="link-text">{fields.whyBpLinkTitle}</span>
                  <span className="link-icon">
                    <Image 
                      src="/assets/icons/arrow-with-circle@2x.png" 
                      width="34" 
                      height="34" 
                      layout="fixed"
                    />
                  </span>
                </a>
              </Link>
            </div>
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
