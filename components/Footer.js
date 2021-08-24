import {data} from '../companyData/data';
import Image from 'next/image';
import themeConfig from '../contentfulApi/contentful-data.preval';

const Footer = () => {

  // themeConfig.then(data => console.log('data:', data))
  console.log('themeConfig:', themeConfig);
  return (
    <footer className="bg-bpBlue">
      <div className="logo-block">
        <Image 
          src="/assets/logos/bp-logo-icon@2x.png"
          width="65"
          height="65"
        />
      </div>
      <div className="bottom-bar">
        {data.copyright}
        {JSON.stringify(themeConfig, null, 2)}
      </div>
    </footer>
  );
}
 
export default Footer;
