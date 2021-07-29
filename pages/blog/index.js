// Runs at build time
// Used to fetch data from Blog section.
export const getStaticProps = async () => {
  const res = await fetch(/** contentful api here */);
  const data = await res.json();

  return {
    props: {
      blogs: data
    }
  }
}

const Blog = ({ blogs }) => {
  return (
    <div>
      <h1>All Blog Posts here..</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Cursus turpis massa tincidunt dui ut ornare lectus. Phasellus faucibus scelerisque eleifend donec pretium vulputate. Pellentesque sit amet porttitor eget dolor. Etiam dignissim diam quis enim lobortis scelerisque fermentum dui. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim. Sed odio morbi quis commodo odio aenean sed adipiscing diam. Lectus urna duis convallis convallis tellus id. Ac tincidunt vitae semper quis lectus nulla at volutpat diam. Nisi porta lorem mollis aliquam ut porttitor. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat.</p>
      {/** loop through blog info to display blog cards.  */}
      {/**
       * Use <Link> component to link to each indiv blog post.
       * <Link href={`/blog/${blog.id}`}><a></a></Link>
       */}
    </div>
  )
}

export default Blog;
