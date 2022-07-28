import Link from "next/link";

const NotFound = () => {

  return (
    <div className="page-404">
      <header>
        <div className="content-margins">
          <h1>Sorry,</h1>
          <h2>That page cannot be found.</h2>
        </div>
      </header>
      <div class="content">
        <div className="content-margins">
          <p>Back to the <Link href="/"><a>Homepage</a></Link></p>
        </div>

      </div>
    </div>
  );
}
 
export default NotFound;
