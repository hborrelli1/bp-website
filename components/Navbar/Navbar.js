import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { introspectionFromSchema } from 'graphql';

const Navbar = () => {
  const router = useRouter();

  const [isTop, setIsTop] = useState(true);

  useEffect(() =>{
    document.addEventListener('scroll', () => {
      const scrollCheck = window.scrollY < 100;
      if (scrollCheck !== isTop) {
        setIsTop(scrollCheck)
      }
    })
  })

  const navBarStyle = { 
    backgroundColor: !isTop ? '#172439' : '',
    boxShadow: !isTop ? '0px 0px 16px 0px #000000': '',

  }

  const menu = [
    { title: 'Home', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Our Work', path: '/our-work' },
    { title: 'About', path: '/about' },
    { title: 'Careers', path: '/careers' },
    { title: 'Blog', path: '/blog' },
    { title: 'Contact', path: '/contact' },
  ]

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
      <ul className={styles['nav-items']}>
        {menu.map((item, index) => {
          return (
            <li className={`${styles["nav-item"]} ${router.pathname === item.path ? styles.active : ''}`}>
              <Link href={item.path}><a>{item.title}</a></Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar;
