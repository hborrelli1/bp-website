import Layout from '../components/Layout'
import '../styles/mobile-menu.scss'
import '../styles/careers.scss'
import '../styles/carousel-styles.scss'
import '../styles/globals.scss'
import '../styles/services.scss';
import '../styles/our-team.scss';
import '../styles/our-work.scss';
import '../styles/projects.scss';
import '../styles/news.scss';
import '../styles/blog-card.scss';
import '../styles/privacy-policy.scss';
import '../styles/featured-posts.scss';
import '../styles/blog-post.scss';
import '../styles/contact.scss';
import '../styles/testimonials.scss';
import '../styles/404.scss';


function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
