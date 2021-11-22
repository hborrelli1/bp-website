import Layout from '../components/Layout'
import '../styles/globals.scss'
import '../styles/services.scss';
import '../styles/our-team.scss';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
