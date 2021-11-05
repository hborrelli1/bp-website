import styles from './TwoColumnHeader.module.scss';

const TwoColumnHeader = ({title, copy, image}) => {

  return (
    <header className={styles['two-column-header']} style={{ backgroundImage: `url(https:${image.fields.file.url})` }}>
        <div className={styles.content}>
          <h1>{title}</h1>
          <p>{copy}</p>
      </div>
      
    </header>
  );
}

export default TwoColumnHeader;
