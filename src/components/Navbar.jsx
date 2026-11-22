import { useEffect, useState } from "react";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";
import { scrollToTop } from "../smoothScroll";
import LampToggle from "./LampToggle";

// Section links scroll within the page; links with an `href` (the blog) open
// another page.
const linkHref = (nav) => nav.href ?? `#${nav.id}`;

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 transition-[background-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-primary/80 backdrop-blur-md shadow-[0_8px_30px_-12px_rgba(0,0,0,0.35)]"
          : "bg-transparent"
      }`}
    >
      <div className='w-full flex justify-between items-center max-w-7xl mx-auto'>
        <a
          href='/'
          className='flex items-center gap-2'
          onClick={(e) => {
            e.preventDefault();
            setActive("");
            window.history.replaceState(null, "", "/");
            scrollToTop();
          }}
        >
          <img src={logo} alt='Jagrat Arora logo' className='w-9 h-9 object-contain' />
          <p className='text-heading text-[18px] font-bold cursor-pointer flex '>
            Jagrat &nbsp;
            <span className='sm:block hidden'>Arora</span>
          </p>
        </a>

        <div className='flex items-center gap-5 sm:gap-10'>
          <LampToggle />

          <ul className='list-none hidden sm:flex flex-row gap-10'>
            {navLinks.map((nav) => (
              <li
                key={nav.id}
                className={`${
                  active === nav.title ? "text-heading" : "text-secondary"
                } hover:text-heading text-[18px] font-medium cursor-pointer transition-colors`}
                onClick={() => setActive(nav.title)}
              >
                <a href={linkHref(nav)}>{nav.title}</a>
              </li>
            ))}
          </ul>

          <div className='sm:hidden flex justify-end items-center'>
            <button
              type='button'
              aria-label={toggle ? "Close menu" : "Open menu"}
              aria-expanded={toggle}
              onClick={() => setToggle(!toggle)}
            >
              <img
                src={toggle ? close : menu}
                alt=''
                className='theme-invert w-[28px] h-[28px] object-contain'
              />
            </button>

            <div
              className={`${
                !toggle ? "hidden" : "flex"
              } p-6 bg-tertiary shadow-card absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
            >
              <ul className='list-none flex justify-end items-start flex-1 flex-col gap-4'>
                {navLinks.map((nav) => (
                  <li
                    key={nav.id}
                    className={`font-poppins font-medium cursor-pointer text-[16px] ${
                      active === nav.title ? "text-heading" : "text-secondary"
                    }`}
                    onClick={() => {
                      setToggle(!toggle);
                      setActive(nav.title);
                    }}
                  >
                    <a href={linkHref(nav)}>{nav.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
