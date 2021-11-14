import styles from "./Footer.module.scss"

const FooterCta = ({ctaData}) => {
  const {
    copy,
    buttonText,
    buttonUrl
  } = ctaData;
  return (
    <section className={styles["footer-cta"]}>
      <div className={styles['footer-cta-content']}>
        <p>{servicesCta}</p>
        <button type="button">Our Services </button>
      </div>
    </section>
  )
}

export default FooterCta;
