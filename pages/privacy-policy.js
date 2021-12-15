import {createClient} from 'contentful';
import moment from 'moment';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export const getStaticProps = async () => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_KEY,
  });

  const res = await client.getEntries({ content_type: 'privacyPolicy' });

  return {
    props: {
      policyData: res.items[0],
    },
    revalidate: 1,
  }
}

const PrivacyPolicy = ({ policyData }) => {
  const {
    content,
    pageTitle
  } = policyData.fields;

  const updatedAt = policyData.sys.updatedAt;

  return (
    <article className="privacy-policy-wrapper">
      <header>
        <div className="content-margins">
          <h1>{pageTitle}</h1>
        </div>
      </header>
      <section className="content">
        <div className="content-margins">
        <p>{`Last updated: ${moment(updatedAt).format('MMMM D YYYY')}`}</p>
        {documentToReactComponents(content)}
        </div>
      </section>
    </article>
  );
}
 
export default PrivacyPolicy;
