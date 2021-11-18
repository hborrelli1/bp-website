import {createClient} from 'contentful';
import Image from 'next/image';
import Link from 'next/link';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

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

  if (!items.length) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: { person: items[0]},
    revalidate: 1,
  }
}

const Person = ({ person }) => {
  console.log('person:', person);
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
  } = person.fields;
  return (
    <article className="leadership-wrapper">
      <div className="header"></div>
      <section className="leadership-bio">
        <div className="image-col">
          <Image 
            src={`https:${photo.fields.file.url}`}
            width={photo.fields.file.details.image.width}
            height={photo.fields.file.details.image.width}
          />
          <div className="socials">
            Connect
            <Link href={linkedInUrl}><a><Image src="/assets/icons/linkedin-icon@2x.png" width="24px" height="18px" /></a></Link>
            <a href={`mailto:${email}`}><Image src="/assets/icons/email-icon@2x.png" width="24px" height="18px" /></a>
          </div>
        </div>
        <div className="bio-col">
          <h1>{name}</h1>
          <p className="certifications">{certifications}</p>
          <p className="job-title">{jobTitle}</p>
          {documentToReactComponents(leadershipBio)}
        </div>
      </section>
      <section className="testimonials">
        <div className="content">
          <div className="testimonial-row">
            <div className="quote-col">
              <p>{quote1}</p>
            </div>
            <div className="image-col">
              <Image 
                src="https://via.placeholder.com/530x400"
                width="530px"
                height="400px"
              />
            </div>
          </div>
          <div className="testimonial-row">
            <div className="quote-col">
              <p>{quote2}</p>
            </div>
            <div className="image-col">
              <Image 
                src="https://via.placeholder.com/530x400"
                width="530px"
                height="400px"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}

      {/* Involvement */}

    </article>
  );
}
 
export default Person;
