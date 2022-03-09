import Link from 'next/link';
import Image from 'next/image';
import styles from './Navbar.module.scss'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { slide as Menu } from 'react-burger-menu'

const Navbar = () => {
  const router = useRouter();

  const [isTop, setIsTop] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const setIsMobileState = () => {
    const windowSize = window.innerWidth;
    if (windowSize <= 1000) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  const setTopScroll = () => {
    const scrollCheck = window.scrollY < 100;
    if (scrollCheck !== isTop) {
      setIsTop(scrollCheck)
    }
  }

  useEffect(() =>{
    document.addEventListener('scroll', setTopScroll)
    window.addEventListener('resize', setIsMobileState)

    return () => {
      document.removeEventListener('scroll', setTopScroll)
      window.removeEventListener('resize', setIsMobileState)
    }
  })


  useEffect(() => {
    setIsMobileState();
  }, [])

  const navBarStyle = { 
    backgroundColor: !isTop ? '#172439' : '',
    boxShadow: !isTop ? '0px 0px 16px 0px #000000': '',

  }

  const menu = [
    // { title: 'Home', path: '/' },
    { title: 'Services', path: '/services' },
    { title: 'Our Work', path: '/our-work' },
    { title: 'About', path: '/about' },
    { title: 'Careers', path: '/careers' },
    { title: 'News', path: '/news' },
    { title: 'Contact', path: '/contact' },
  ]
  
  const handleStateChange = (state) => {
    setMenuIsOpen(state.isOpen);
  }

  const closeMenu = () => {
    setMenuIsOpen(false)
  }

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen)
  }

  if (isMobile) {
    return (
      <div className="navbarMobile" style={navBarStyle} id="Navbar">
        <Link className="logo" href="/" scroll={false}>
          <a>
            <Image 
              src="/assets/logos/bp-main-logo@2x.png" 
              alt="Borrelli+Partners Logo" 
              width="261px"
              height="36.16px"
            />
          </a>
        </Link>
        <Menu 
          right 
          width={ 250 } 
          isOpen={menuIsOpen} 
          customBurgerIcon={ false }
          onStateChange={ (state) => handleStateChange(state) }
        >
          {menu.map((item, index) => {
            return (
              // <li key={index} className={`${styles["nav-item"]} ${router.pathname === item.path ? styles.active : ''}`}>
                <Link 
                  className={styles['menu-item']} 
                  href={item.path}
                  key={item.title}
                ><a onClick={() => closeMenu()}>{item.title}</a></Link>
              // </li>
            )
          })}
        </Menu>
        <button className="menu-button" onClick={() => toggleMenu()} type="button">
          <Image 
            src="/assets/icons/hamburger-menu@2x.png"
            width="32px"
            height="22px"
            alt="Navigation Menu"
          />
        </button>
      </div>
    )
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
      <ul className={styles['nav-items']}>
        {menu.map((item, index) => {
          return (
            <li key={index} className={`${styles["nav-item"]} ${router.pathname === item.path ? styles.active : ''}`}>
              <Link href={item.path}><a>{item.title}</a></Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default Navbar;
