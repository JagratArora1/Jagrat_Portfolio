import { styles } from "../styles";
import { socialLinks } from "../constants";

// Taken once when the page loads. (The prerendered HTML has the build year;
// suppressHydrationWarning covers a deploy made before New Year.)
const year = new Date().getFullYear();

const modelCredits = [
  {
    title: "Gaming Desktop PC",
    author: "Yolala1232",
    url: "https://sketchfab.com/3d-models/gaming-desktop-pc-d1d8282c9916438091f11aeb28787b66",
  },
  {
    title: "Stylized planet",
    author: "cmzw",
    url: "https://sketchfab.com/3d-models/stylized-planet-789725db86f547fc9163b00f302c3e70",
  },
];

const Footer = () => {
  return (
    <footer
      className={`${styles.paddingX} relative z-0 max-w-7xl mx-auto pt-6 pb-10 text-secondary text-[14px]`}
    >
      <div className='flex flex-col sm:flex-row items-center justify-between gap-3'>
        <p>
          © <span suppressHydrationWarning>{year}</span>{" "}
          Jagrat Arora
        </p>
        <ul className='flex flex-wrap justify-center gap-6'>
          {/* The static pages built by scripts/build-pages.js */}
          <li>
            <a href='/about' className='hover:text-heading transition-colors'>
              About Jagrat
            </a>
          </li>
          <li>
            <a href='/blog' className='hover:text-heading transition-colors'>
              Blog
            </a>
          </li>
          {socialLinks.map((link) => (
            <li key={link.name}>
              <a
                href={link.url}
                target='_blank'
                rel='noopener noreferrer me'
                className='hover:text-heading transition-colors'
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* Credit required by the models' CC BY 4.0 licences
          (public/desktop_pc/license.txt, public/planet/license.txt). */}
      <p className='mt-4 text-center sm:text-left text-[12px] opacity-60'>
        3D models:{" "}
        {modelCredits.map((model, index) => (
          <span key={model.title}>
            {index > 0 && " · "}
            <a
              href={model.url}
              target='_blank'
              rel='noopener noreferrer nofollow'
              className='underline-offset-2 hover:underline'
            >
              {model.title}
            </a>{" "}
            by {model.author}
          </span>
        ))}{" "}
        (
        <a
          href='https://creativecommons.org/licenses/by/4.0/'
          target='_blank'
          rel='noopener noreferrer nofollow'
          className='underline-offset-2 hover:underline'
        >
          CC BY 4.0
        </a>
        , optimised for the web)
      </p>
    </footer>
  );
};

export default Footer;
