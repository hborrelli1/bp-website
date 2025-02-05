import styles from './TwoColumnHeaderGQL.module.scss';
import _ from 'lodash';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';
import Image from 'next/image';

const TwoColumnHeaderGQL = ({title, copy, image, contactInfo = false}) => {

  return (
    <header className={styles['two-column-header']} style={{ backgroundImage: `url(${image.url})` }}>
        <div className={styles.content}>
          <h1>{title}</h1>
          {_.isObject(copy) ? documentToReactComponents(copy) : <p>{copy}</p>}
      </div>
      {contactInfo && (
        <address>
          <div className="content-margins">
            <ul className="links">
              {contactInfo?.telephoneNumber && (
                <li className="link">
                  <Link href={`tel:${contactInfo.telephoneNumber.replace(/[-.]/g, '')}`}>
                    <a>P: {contactInfo.telephoneNumber}</a>
                  </Link>
                </li>
              )}
              {contactInfo?.googleMapsLink ? (
                <li className="link">
                  <Link href={contactInfo?.googleMapsLink}>
                    <a>{documentToReactComponents(contactInfo?.address)}</a>
                  </Link>
                </li>
              )
              : (
                <li>
                  {documentToReactComponents(contactInfo?.address)}
                </li>
              )}
            </ul>
            {contactInfo?.linkedInUrl && (
              <Link href={contactInfo?.linkedInUrl}>
                <a className="linkedin" target="_blank">
                  <Image 
                    src="/assets/icons/linkedin-white@2x.png"
                    width="15px"
                    height="15px"
                    alt="Borrelli + Partners LinkedIn"
                  />
                </a>
              </Link>
            )}
          </div>
        </address>
      )}
    </header>
  );
}

export default TwoColumnHeaderGQL;
