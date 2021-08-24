import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="w-screen flex flex-row items-center justify-between bg-bpBlue px-4 py-2 text-white">
      <div className="logo">
        <Image 
          src="/assets/logos/bp-main-logo@2x.png" 
          alt="Borrelli+Partners Logo" 
          width="261px"
          height="36.16px"
        />
      </div>
      <div className="nav-items">
        <Link href="/"><a className="nav-item">Home</a></Link>
        <Link href="/services"><a className="nav-item">Services</a></Link>
        <Link href="/our-work"><a className="nav-item">Our Work</a></Link>
        <Link href="/about"><a className="nav-item">About</a></Link>
        <Link href="/careers"><a className="nav-item">Careers</a></Link>
        <Link href="/blog"><a className="nav-item">News</a></Link>
        <Link href="/contact"><a className="nav-item">Contact</a></Link>
      </div>
    </nav>
  )
}

export default Navbar;
