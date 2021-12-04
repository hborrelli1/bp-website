import styles from './TwoColumnHeader.module.scss';
import _ from 'lodash';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const TwoColumnHeader = ({title, copy, image}) => {

  return (
    <header className={styles['two-column-header']} style={{ backgroundImage: `url(https:${image.fields.file.url})` }}>
        <div className={styles.content}>
          <h1>{title}</h1>
          {_.isObject(copy) ? documentToReactComponents(copy) : <p>{copy}</p>}
      </div>
      
    </header>
  );
}

export default TwoColumnHeader;
