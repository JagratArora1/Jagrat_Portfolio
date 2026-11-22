import { styles } from "../styles";
import { socialLinks } from "../constants";

// Taken once when the page loads. (The prerendered HTML has the build year;
// suppressHydrationWarning covers a deploy made before New Year.)
const year = new Date().getFullYear();

const Footer = () => {
  return (
    <footer
      className={`${styles.paddingX} relative z-0 max-w-7xl mx-auto pt-6 pb-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-secondary text-[14px]`}
    >
      <p>
        © <span suppressHydrationWarning>{year}</span>{" "}
        Jagrat Arora
      </p>
      <ul className='flex gap-6'>
        {socialLinks.map((link) => (
          <li key={link.name}>
            <a
              href={link.url}
              target='_blank'
              rel='noopener noreferrer me'
              className='hover:text-white transition-colors'
            >
              {link.name}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
