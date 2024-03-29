import Head from 'next/head';
import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import CarouselComponent from '../components/Carousel/CarouselComponent';
import ThreeColumnFeaturedPosts from '../components/ThreeColumnFeaturedPosts';
import safeJsonStringify from 'safe-json-stringify';

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
  // const projects = await client.getEntries({ content_type: 'projects', limit: 10 });

  const stringifiedHomePageData = safeJsonStringify(homePageData);
  const homeData = JSON.parse(stringifiedHomePageData);
  // const stringifiedProjectData = safeJsonStringify(projects);
  // const projectData = JSON.parse(stringifiedProjectData);

  return {
    props: {
      homePageData: homeData.items,
      themeConfig: themeConfig.items,
      // projects: projectData.items,
    },
    revalidate: 1,
  }
}

// export default function Home({homePageData, themeConfig, projects}) {
export default function Home({homePageData, themeConfig}) {
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
    height: '100vh',
  }

  const backgroundSectionStyles = {
    backgroundImage: `url(https:${themeConfig[0].fields.backgroundTexture.fields.file.url})`,
  }

  const featuredProjectItems = fields.featuredProjects.reduce((acc, item, index) => {
    acc[index] = {
      thumbnail: item.fields.thumbnailImage,
      title: item.fields.projectTitle,
      excerpt: item.fields.shortSummary,
      industry: item.fields.industry,
      id: item.sys.id,
      slug: item.fields.slug,
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
            <Image src="/assets/icons/circle-icon-white@2x.png" width="34" height="34" layout="fixed" alt="" />
            <div className='chevron-icon'>
              <Image src="/assets/icons/chevron-icon-white@2x.png" width="10" height="6" layout="fixed" alt="" />
            </div>
          </button>
        </div>
        <div className="services" style={backgroundSectionStyles}>
          <div className="content">
            <div className="content-column">
              <h2>{fields.ourServicesTitle}</h2>
              <div className="body-copy">{documentToReactComponents(fields.ourServicesDescription)}</div>
            </div>
            <div className="services-column">
              <h3>Our Services</h3>
              <div className="links">
                {fields.ourServicesLinks.map(link => (
                  <Link href={`/services#${link.fields.servicesUrl}`} scroll={true} key={link.sys.id}><a>{link.fields.service}</a></Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="featured-projects">
          <div className="background-block"></div>
          <div className="project-slider">
            <h4>Featured Projects</h4>
            <CarouselComponent items={featuredProjectItems} type='projects' />
            <Link href="/our-work">
              <a className="view-all-projects">View All Projects +</a>
            </Link>
            
          </div>
        </div>
        <div className="why-bp">
          <div className="why-bp-title">WHY B+P</div>
          <div className="content">
            <div className="content-column">
              <h2>{fields.whyBpTitle}</h2>
              <div className="body-copy">{documentToReactComponents(fields.whyBpDescription)}</div>
            </div>
            <div className="image-column">
              <Image 
                src={`https:${fields.whyBpImage.fields.file.url}`}
                width={fields.whyBpImage.fields.file.details.image.width}
                height={fields.whyBpImage.fields.file.details.image.height}
                alt="Why Borrelli + Partners"
              />
              <Link href={`/${fields.whyBpLink.fields.slug}`}>
                <a className="image-button">
                  <span className="link-text">{fields.whyBpLinkTitle}</span>
                  <span className="link-icon">
                    <Image 
                      src="/assets/icons/circle-icon-dark@2x.png" 
                      width="34" 
                      height="34" 
                      layout="fixed"
                      alt=""
                    />
                    <div className='chevron-icon'>
                      <Image src="/assets/icons/chevron-icon-dark@2x.png" width="10" height="6" layout="fixed" alt="" />
                    </div>
                  </span>
                </a>
              </Link>
            </div>
          </div>
        </div>
        <ThreeColumnFeaturedPosts info={{
          subTitle: fields.featuredPostSubtitle,
          title: fields.featuredPostTitle,
          posts: fields.featuredPosts,
          type: 'news'
        }}/>
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
