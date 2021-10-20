import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss'
import { useEffect, useState } from 'react';

console.log('styles:', styles);

const Navbar = () => {

  const [isTop, setIsTop] = useState(true);

  useEffect(() =>{
    document.addEventListener('scroll', () => {
      const scrollCheck = window.scrollY < 100;
      console.log('scrollCheck: ', scrollCheck)
      if (scrollCheck !== isTop) {
        setIsTop(scrollCheck)
      }
    })
  })

  const navBarStyle = { 
    backgroundColor: !isTop ? '#172439' : '',
    boxShadow: !isTop ? '0px 0px 16px 0px #000000': '',

  }

  return (
    <nav className={styles.navbar} id="Navbar" style={navBarStyle}>
      <Link className="logo" href="/">
        <a>
          <Image 
            src="/assets/logos/bp-main-logo@2x.png" 
            alt="Borrelli+Partners Logo" 
            width="261px"
            height="36.16px"
          />
        </a>
      </Link>
      <div className={styles['nav-items']}>
        <Link href="/"><a className={styles["nav-item"]}>Home</a></Link>
        <Link href="/services"><a className={styles["nav-item"]}>Services</a></Link>
        <Link href="/our-work"><a className={styles["nav-item"]}>Our Work</a></Link>
        <Link href="/about"><a className={styles["nav-item"]}>About</a></Link>
        <Link href="/careers"><a className={styles["nav-item"]}>Careers</a></Link>
        <Link href="/blog"><a className={styles["nav-item"]}>News</a></Link>
        <Link href="/contact"><a className={styles["nav-item"]}>Contact</a></Link>
      </div>
    </nav>
  )
}

export default Navbar;
