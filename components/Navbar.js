import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav>
      <div className="logo">
        <Image 
          src="/assets/logos/bp-main-logo@2x.png" 
          alt="Borrelli+Partners Logo" 
          width="261px"
          height="36.16px"
        />
      </div>
      <Link href="/"><a>Home</a></Link>
      <Link href="/services"><a>Services</a></Link>
      <Link href="/our-work"><a>Our Work</a></Link>
      <Link href="/about"><a>About</a></Link>
      <Link href="/careers"><a>Careers</a></Link>
      <Link href="/blog"><a>News</a></Link>
      <Link href="/contact"><a>Contact</a></Link>
      
      
    </nav>
  )
}

export default Navbar;
