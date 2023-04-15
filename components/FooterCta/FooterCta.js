import styles from "./FooterCta.module.scss"
import Link from 'next/link';
import Image from 'next/image';

const FooterCta = ({ctaData}) => {
  const {
    copy,
    buttonText,
    buttonUrl,
    backgroundImage
  } = ctaData;
  return (
    <section className={styles["footer-cta"]} style={{ backgroundImage: `url(https:${backgroundImage.fields.file.url})`}}>
      <div className={styles['footer-cta-content']}>
        <p>{copy}</p>
        <Link href={buttonUrl}>
          <a>{buttonText} <span><Image src="/assets/icons/circle-icon-white@2x.png" width="30" height="30" alt="" /><span className={styles['chevron-icon']}><Image src="/assets/icons/chevron-icon-white@2x.png" width="10" height="6" layout="fixed" alt="" /></span></span></a></Link>
      </div>
    </section>
  )
}

export default FooterCta;
