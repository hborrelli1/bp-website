import BlogCard from './BlogCard';

const ThreeColumnFeaturedPosts = ({info}) => {
  const {
    type,
    subTitle,
    title,
    posts
  } = info;
  console.log('posts:', posts)
  return (
    <section className="featured-posts">
      <div className="content-margins">
        <div className="section-header">
          {subTitle && <h3>{subTitle}</h3>}
          {title && <h2>{title}</h2>}
        </div>
        <div className="posts">
          {posts.map((post, index) => <BlogCard key={index} blog={post} type={type} />)}
        </div>
      </div>
    </section>
  )
}

export default ThreeColumnFeaturedPosts;
