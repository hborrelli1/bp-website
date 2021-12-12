import Layout from '../components/Layout'
import '../styles/careers.scss'
import '../styles/carousel-styles.scss'
import '../styles/globals.scss'
import '../styles/services.scss';
import '../styles/our-team.scss';
import '../styles/our-work.scss';
import '../styles/projects.scss';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
