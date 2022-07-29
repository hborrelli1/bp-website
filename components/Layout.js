import Footer from "./Footer/Footer"
import Navbar from "./Navbar/Navbar"

const Layout = ({ children, themeConfig }) => {
  return (
    <div className="content">
      <Navbar />
      { children }
      <Footer {...themeConfig} />
    </div>
  );
}
 
export default Layout;
