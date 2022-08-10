import {createClient} from 'contentful';
import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import safeJsonStringify from 'safe-json-stringify';
import ThreeColumnFeaturedPosts from '../../components/ThreeColumnFeaturedPosts';

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({content_type: 'people'})

  const paths = res.items.map(item => {
    return {
      params: { slug: item.fields.slug }
    }
  })

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps = async ({ params }) => {
  const {items} = await client.getEntries({ 
    content_type: 'people',
    'fields.slug': params.slug,
  });

  const stringifiedItems = safeJsonStringify(items)
  const data = JSON.parse(stringifiedItems)

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { person: data[0]},
    revalidate: 1,
  }
}

const Person = ({ person }) => {
  if (!person.fields.fullBioPage) {
    return (<p>No bio page.</p>);
  }
  
  const {
    certifications,
    email,
    jobTitle,
    leadershipBio,
    linkedInUrl,
    name,
    photo,
    slug,
    quote1,
    quote2,
    featuredProjects,
    involvement,

  } = person.fields;
  return (
    <article className="leadership-wrapper">
      <div className="header"></div>
      <section className="leadership-bio">
        <div className="image-col">
          <div className="bio-img">
            <Image 
              src={`https:${photo.fields.file.url}`}
              width={photo.fields.file.details.image.width}
              height={photo.fields.file.details.image.height}
              layout="responsive"
              alt={`${name} leadership photo.`}
            />
          </div>
          <div className="socials">
            {(linkedInUrl && email) && (
              <span>Connect</span>
            )}
            {linkedInUrl && (
              <Link href={linkedInUrl}>
                <a>
                  <Image 
                    src="/assets/icons/linkedin-icon@2x.png" 
                    width="24px" 
                    height="18px" 
                    alt={`${name} LinkedIn.`}
                  />
                </a>
              </Link>

            )}
            {email && (
              <a href={`mailto:${email}`}>
                <Image 
                  src="/assets/icons/email-icon@2x.png" 
                  width="24px" 
                  height="18px" 
                  alt={`${name} email`}
                />
              </a>
            )}
          </div>
        </div>
        <div className="bio-col">
          <h1>{name}</h1>
          {certifications && <p className="certifications">{certifications}</p>}
          <p className="job-title"><span></span>{jobTitle}</p>
          {leadershipBio && (
            <div className="bio">
              <div className="body-copy">{documentToReactComponents(leadershipBio)}</div>
            </div>
          )}
        </div>
      </section>
      
      <section className="testimonials">
        <div className="content">
          {quote1 && (
            <div className="testimonial-row">
              <div className="quote-col">
                <p>{quote1}</p>
              </div>
              <div className="image-col">
                <Image 
                  src="https://via.placeholder.com/530x400"
                  width="530px"
                  height="400px"
                  alt=""
                />
              </div>
            </div>
          )}
          {quote2 && (
            <div className="testimonial-row">
              <div className="quote-col">
                <p>{quote2}</p>
              </div>
              <div className="image-col">
                <Image 
                  src="https://via.placeholder.com/530x400"
                  width="530px"
                  height="400px"
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {featuredProjects && (
        <ThreeColumnFeaturedPosts info={{
          subTitle: `${name}'s Featured Work`,
          title: null,
          posts: featuredProjects
        }}/>
      )}

      {involvement && (
        <section className="involvement">
          <div className="content-margins">
            <h3>Involvment</h3>
            <ul className="involvement-list">
              {involvement.map((item, key) => <li className="item" key={key}>{item}</li>)}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
 
export default Person;
