import Image from 'next/image';
import Link from 'next/link';
import styles from './Footer.module.scss';

// import themeConfig from '../../contentfulApi/contentful-data.preval';

const Footer = () => {

  return (
    <footer className={styles.footer}>
      <div className={styles['top-bar']}>
        <div className={styles['logo-block']}>
          <div className={styles['logo-wrap']}>
            <Image 
              src="/assets/logos/bp-logo-icon@2x.png"
              // width="65"
              // height="65"
              layout="fill"
              className={styles["img-icon"]}
              alt="Borrelli + Partners Logo"
            />
          </div>
          <address className={styles.address} >
            <h5>BORRELLI + PARTNERS</h5>
            <p>
              720 Vassar Street<br/>
              Orlando, FL 32804
            </p>
            <p className={styles["phone"]}>T: <a href="tel:4074181338">407.418.1338</a></p>
            <p className={styles["fax"]}>F: 407.418.1342</p>
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
            <p>Form here...</p>
            <div className={styles['sub-nav']}>
              <Link href="/news"><a>News</a></Link>
              <Link href="/privacy-policy"><a>Privacy Policy</a></Link>
            </div>
          </div>
        </div>
      </div>
      <div className={styles['bottom-bar']} >
        <p>&copy; 2020 Borrelli + Partners AAC000711</p>
      </div>
    </footer>
  );
}
 
export default Footer;
