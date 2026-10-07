import Head from 'next/head';
import {createClient} from 'contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { useEffect, useState } from 'react';
import _ from 'lodash';
import Link from 'next/link';
import Image from "next/image";
import CarouselComponent from '../components/Carousel/CarouselComponent';
import ThreeColumnFeaturedPosts from '../components/ThreeColumnFeaturedPosts';
import { compactFields, fetchContentfulGraphQL, mapGraphQLAsset } from '../lib/contentfulPageData';

// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  const data = await fetchContentfulGraphQL(`
    query HomeAndTheme {
      homePageCollection(limit: 1) {
        items {
          heroImage { url title width height }
          heroImageTitle
          heroImageText { json }
          ourServicesTitle
          ourServicesDescription { json }
          ourServicesLinksCollection(limit: 100) {
            items { sys { id } service servicesUrl }
          }
          featuredProjectsCollection(limit: 100) {
            items {
              sys { id }
              projectTitle
              shortSummary
              industryTag
              slug
              thumbnailImage { url title width height }
            }
          }
          whyBpTitle
          whyBpDescription { json }
          whyBpImage { url title width height }
          whyBpLink {
            __typename
            ... on About { slug }
          }
          whyBpLinkTitle
          featuredPostSubtitle
          featuredPostTitle
          featuredPostsCollection(limit: 100) {
            items {
              sys { id }
              shortSummary
              blogTitle
              slug
              date
              thumbnailImage { url title width height }
            }
          }
        }
      }
      themeConfigCollection(limit: 1) {
        items { backgroundTexture { url title width height } }
      }
    }
  `);
  const fields = data.homePageCollection.items[0];
  const homeData = {
    fields: compactFields({
      heroImage: mapGraphQLAsset(fields.heroImage),
      heroImageTitle: fields.heroImageTitle,
      heroImageText: fields.heroImageText.json,
      ourServicesTitle: fields.ourServicesTitle,
      ourServicesDescription: fields.ourServicesDescription.json,
      ourServicesLinks: fields.ourServicesLinksCollection.items.map(link => ({
        sys: { id: link.sys.id },
        fields: compactFields({
          servicesUrl: link.servicesUrl,
          service: link.service,
        }),
      })),
      featuredProjects: fields.featuredProjectsCollection.items.map(project => ({
        sys: { id: project.sys.id },
        fields: compactFields({
          thumbnailImage: mapGraphQLAsset(project.thumbnailImage),
          projectTitle: project.projectTitle,
          shortSummary: project.shortSummary,
          industry: project.industryTag?.join(', '),
          slug: project.slug,
        }),
      })),
      whyBpTitle: fields.whyBpTitle,
      whyBpDescription: fields.whyBpDescription.json,
      whyBpImage: mapGraphQLAsset(fields.whyBpImage),
      whyBpLink: {
        fields: compactFields({ slug: fields.whyBpLink.slug }),
      },
      whyBpLinkTitle: fields.whyBpLinkTitle,
      featuredPostSubtitle: fields.featuredPostSubtitle,
      featuredPostTitle: fields.featuredPostTitle,
      featuredPosts: fields.featuredPostsCollection.items.map(post => ({
        fields: compactFields({
          shortSummary: post.shortSummary,
          blogTitle: post.blogTitle,
          slug: post.slug,
          thumbnailImage: mapGraphQLAsset(post.thumbnailImage),
          date: post.date,
        }),
      })),
    }),
  };
  const themeData = [{
    fields: {
      backgroundTexture: mapGraphQLAsset(data.themeConfigCollection.items[0].backgroundTexture),
    },
  }];

  return {
    props: {
      homePageData: [homeData],
      themeConfig: themeData,
    },
    revalidate: 300,
  }
}

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
        <link rel="stylesheet" href="https://use.typekit.net/rrc4xhb.css" />
      </Head>
      <div className={"home"}>
        <div className="home-hero-banner" id="heroBanner" style={heroSectionStyles}>
          <div className="content">
            <h1>{fields.heroImageTitle}</h1>
            <div className="description">{documentToReactComponents(fields.heroImageText)}</div>
          </div>
          <button type="button" className="view-more" onClick={() => scrollDown()}>
            <Image
              src="/assets/icons/circle-icon-white@2x.png"
              width="34"
              height="34"
              alt="" />
            <div className='chevron-icon'>
              <Image
                src="/assets/icons/chevron-icon-white@2x.png"
                width="10"
                height="6"
                alt="" />
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
                  <Link href={`/services#${link.fields.servicesUrl}`} scroll={true} key={link.sys.id}>{link.fields.service}</Link>
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
            <Link href="/our-work" className="view-all-projects">
              View All Projects +
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
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
              <Link href={`/${fields.whyBpLink.fields.slug}`} className="image-button">

                <span className="link-text">{fields.whyBpLinkTitle}</span>
                <span className="link-icon">
                  <Image src="/assets/icons/circle-icon-dark@2x.png" width="34" height="34" alt="" />
                  <div className='chevron-icon'>
                    <Image src="/assets/icons/chevron-icon-dark@2x.png" width="10" height="6" alt="" />
                  </div>
                </span>

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
  );
}
