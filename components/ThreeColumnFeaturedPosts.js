import BlogCard from './BlogCard';

const ThreeColumnFeaturedPosts = ({info}) => {
  const {
    subTitle,
    title,
    posts
  } = info;
  return (
    <section className="featured-posts">
      <div className="content-margins">
        <header>
          {subTitle && <h3>{subTitle}</h3>}
          {title && <h2>{title}</h2>}
        </header>
        {posts.map(post => <BlogCard blog={post}/>)}
      </div>
    </section>
  )
}

export default ThreeColumnFeaturedPosts;
