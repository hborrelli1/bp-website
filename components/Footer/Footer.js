import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.scss';
import { useEffect, useState } from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const Footer = () => {
  const [themeConfig, setThemeConfig] = useState();

  useEffect(() => {
    async function fetchThemeConfig() {
      try {
        const response = await fetch('/api/contentful'); // Call Next.js API route
        const data = await response.json();
        setThemeConfig(data[0].fields);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchThemeConfig();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className={styles['top-bar']}>
        <div className={styles['logo-block']}>
          <div className={styles['logo-wrap']}>
            <Image 
              src="/assets/logos/bp-logo-icon@2x.png"
              width="129px"
              height="129px"
              alt="Borrelli + Partners Logo"
            />
          </div>
          <address className={styles.address} >
            <h5>BORRELLI + PARTNERS</h5>
            <div className={styles.block}>
              {themeConfig?.googleMapsLink ? (
                <a href={themeConfig?.googleMapsLink || ''} target="_blank" rel="noreferrer">
                  {documentToReactComponents(themeConfig?.address)}
                </a>
                ) 
                : (
                  documentToReactComponents(themeConfig?.address)
                )}
            </div>
            <div className="body-copy">
              {themeConfig?.telephoneNumber && (
                <p className={styles["phone"]}>T: <a href={`tel:${themeConfig?.telephoneNumber.replace(/[-.]/g, '')}`}>{themeConfig?.telephoneNumber}</a></p>
              )}
            </div>
          </address>
        </div>
        <div className={styles['footer-section']}>
          <nav>
            <Link href="/services"><a>Services</a></Link>
            <Link href="/our-work"><a>Our Work</a></Link>
            <Link href="/about"><a>About</a></Link>
            <Link href="/careers"><a>Careers</a></Link>
            <Link href="/contact"><a>Contact</a></Link>
          </nav>
          <div className={styles['form-box']}>
            <div className={styles['sub-nav']}>
              <Link href="/news"><a>News</a></Link>
              <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['bottom-bar']} >
        <p>&copy; {`${new Date().getFullYear()} ${themeConfig?.copyright}`}</p>
        <div className={styles['bottom-bar-linkedin']}>
          {themeConfig?.linkedInUrl && (
            <Link href={themeConfig.linkedInUrl}>
              <a target="_blank">
                <Image 
                  src="/assets/icons/linkedin-white@2x.png"
                  width="15"
                  height="15"
                  alt="Borrelli + Partners Logo"
                  className={styles['linkedin-icon']}
                />
              </a>
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
 
export default Footer;
