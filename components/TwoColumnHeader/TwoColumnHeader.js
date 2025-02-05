import styles from './TwoColumnHeader.module.scss';
import _ from 'lodash';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';
import Image from 'next/image';

const TwoColumnHeader = ({title, copy, image, contactInfo = false}) => {

  return (
    <header className={styles['two-column-header']} style={{ backgroundImage: `url(https:${image.fields.file.url})` }}>
        <div className={styles.content}>
          <h1>{title}</h1>
          {_.isObject(copy) ? documentToReactComponents(copy) : <p>{copy}</p>}
      </div>
      {contactInfo && (
        <address>
          <div className="content-margins">
            <ul className="links">
              <li className="link">
                <Link href="tel:4074181338">
                  <a>P: {contactInfo?.telephoneNumber}</a>
                </Link>
                </li>
              <li className="link">
                {contactInfo?.googleMapsLink ? (
                  <Link href={contactInfo?.googleMapsLink || ''}>
                    <a target="_blank">{documentToReactComponents(contactInfo?.address)}</a>
                  </Link>
                )
                : (
                  documentToReactComponents(contactInfo?.address)
                )}
                </li>
            </ul>
            <Link href={contactInfo?.linkedInUrl}>
              <a className="linkedin">
                <Image 
                  src="/assets/icons/linkedin-white@2x.png"
                  width="15px"
                  height="15px"
                  alt="Borrelli + Partners LinkedIn"
                />
              </a>
            </Link>
          </div>
        </address>
      )}
    </header>
  );
}

export default TwoColumnHeader;
