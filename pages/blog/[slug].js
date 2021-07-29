export const getStaticPaths = async () => {
  const res = await fetch(/** fetch url for indiv blog post. */);
  const data = await res.json();

  return {
    /**
     * map through data to get list of paths
     * const paths = data.map(blog => {
     *  return {
     *    params: { id: blog.id }
     *  }
     * })
     * 
     * return {
     *  paths,
     * fallback: false
     * }
     */
  }
}

export const getStaticProps = async (context) => {
  const id = context.params.id;

  const res = await fetch(/** url */);
  const data = await res.json();

  return {
    props: { blogInfo: data }
  }
}

const BlogPost = ({ blogInfo }) => {
  return (
    <div>
      <h1>Individual Blog Post</h1>
    </div>
  );
}
 
export default BlogPost;
