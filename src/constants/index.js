import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    reactjs,
    tailwind,
    nodejs,
    nextjs,
    docker,
    mongodb,
    git,
    java,
    postgresql,
    redis,
    innovate,
    internshala,
    cybervidya,
    quikkred,
    fidelity,
    finvox,
    vikam,
    quikkredCrm,
    quikkredConnect,
    portfolio,
    logo1,
    logo2,
  } from "../assets";

  export const navLinks = [
    {
      id: "about",
      title: "About",
    },
    {
      id: "work",
      title: "Work",
    },
    {
      // A separate page (built by scripts/build-pages.js), not a section.
      id: "blog",
      title: "Blog",
      href: "/blog",
    },
    {
      id: "contact",
      title: "Contact",
    },
  ];

  const services = [
    {
      title: "Full-Stack Developer",
      icon: web,
    },
    {
      title: "Mobile App Developer",
      icon: backend,
    },
    {
      title: "Fintech Systems",
      icon: mobile,
    },
    {
      title: "Cyber Security",
      icon: creator,
    },
  ];

  // Each technology is drawn as its own 3D ball, and every ball is a separate
  // WebGL context. Browsers allow about 16 per page and the hero, Earth and
  // stars use 3, so keep this list at 12 or fewer.
  const technologies = [
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Next JS",
      icon: nextjs,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "PostgreSQL",
      icon: postgresql,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Redis",
      icon: redis,
    },
    {
      name: "Docker",
      icon: docker,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Java",
      icon: java,
    },
    {
      name: "Git",
      icon: git,
    },
  ];

  // Newest first.
  const experiences = [
    {
      title: "Software Developer",
      company_name: "Quikkred",
      icon: quikkred,
      iconBg: "#ffffff",
      date: "Jan 2026 – Present",
      // In order of priority.
      points: [
        "Lead all of Quikkred's product development, from the website, loan management CRM and backend to Quikkred Connect, VIKAM and Finvox, and oversee the company's entire loan disbursement process.",
        "Website, CRM and backend: lead the quikkred.in website, the loan management CRM (React 19, TypeScript) and the multi-tenant lending backend (Fastify, Kysely), covering disbursal, bank payment files, PhonePe e-mandates, credit-bureau reporting, permission controls and OCR receipt capture.",
        "Quikkred Connect: lead the React Native (Expo) app for retail lending partners and built most of it, including PhonePe and PayU payments over UPI, biometric app lock, push notifications and live support chat.",
        "VIKAM: lead the money and rewards app for India; upgraded it to Expo SDK 54 with support for 10 languages and hardened its OTP sign-in.",
        "Finvox: lead the end-to-end encrypted team chat for web and mobile, with MLS group encryption, HPKE device linking, encrypted attachments, tenant isolation using PostgreSQL row-level security, and LiveKit voice and video calls.",
      ],
    },
    {
      title: "Software Developer",
      company_name: "Fidelity International Limited",
      icon: fidelity,
      iconBg: "#b72e2a", // Fidelity red, so the square logo fills the circle
      date: "Jan 2025 – Jul 2025",
      points: [
        "Underwent intensive training in Java and applied acquired skills by building a complete project, demonstrating proficiency in object-oriented programming, backend logic, and application structure.",
        "Collaborated with a team to modernize legacy applications by automating containerization and CI/CD workflows using Docker, Kubernetes, and AI-powered tools integrated via Model Context Protocol (MCP) for scalable, cloud-native deployment.",
      ],
    },
    {
      title: "Cybersecurity",
      company_name: "Innovate Intern",
      icon: innovate,
      iconBg: "#383E56",
      date: "August 2024",
      points: [
        "Gaining valuable insights into the evolving landscape of cybersecurity threats and vulnerabilities, the ethical considerations around developing security tools, and the importance of educating the public on cybersecurity. ",
        "Made a project titled “Visualizing Intelligence Analysis and Investigation Techniques” where I did a security audit of a website and found 14 vulnerabilities.",
      ],
    },
    {
      title: "Cyber Defense Engineering",
      company_name: "Cybervidyapeeth",
      icon: cybervidya,
      iconBg: "#E6DEDD",
      date: "September 2023",
      points: [
        "Learned about some tools related to Defensive and Offensive Security",
        "Built a project of Password Cracking which cracks password using Brute Force and Dictionary Attack",
      ],
    },
    {
      title: "Ethical Hacking",
      company_name: "Internshala",
      icon: internshala,
      iconBg: "#383E56",
      date: "August 2023",
      points: [
        "Gained some knowledge about Ethical Hacking , its concepts and tools",
        "Solved some labs to gain practical knowledge",
      ],
    },
  ];

  const testimonials = [
    {
      testimonial:
        "Jagrat is a hardworking student and is always ready to learn new things",
      name: "Arko Bagchi",
      designation: "Assistant Professor",
      company: "MRIIRS-School of Engineering & Technology",
      // No `image`: the card shows initials. To add a photo, put it in
      // src/assets and set image: <imported file>.
    },
    {
      testimonial:
        "He is a good listener and helps everyone around him",
      name: "Miss Abha",
      designation: "CDC Professor",
      company: "MRIIRS-School of Engineering & Technology",
    },
  ];

  // Shown in two groups on the Projects section (`type`: "work" or "personal"),
  // in this order. `label` is shown on the image. `live_link` and
  // `source_code_link` are optional; work projects have private code.
  const projects = [
    {
      type: "work",
      name: "Quikkred CRM & Lending Platform",
      label: "Lead developer",
      description:
        "I lead Quikkred's loan management CRM, its multi-tenant lending backend and the quikkred.in website, and oversee the entire loan disbursement process: disbursal, bank payment files, PhonePe e-mandates and credit-bureau reporting.",
      tags: [
        { name: "react", color: "blue-text-gradient" },
        { name: "fastify", color: "green-text-gradient" },
        { name: "typescript", color: "pink-text-gradient" },
      ],
      image: quikkredCrm,
      live_link: "https://www.quikkred.in/",
    },
    {
      type: "work",
      name: "VIKAM: Money App for Bharat",
      label: "Lead developer",
      description:
        "I lead VIKAM, a money and rewards app for India in 10+ languages. I upgraded the Expo mobile app to SDK 54, added the 10-language support, hardened OTP sign-in, and built parts of the rewards wallet and the admin exports.",
      tags: [
        { name: "expo", color: "blue-text-gradient" },
        { name: "next.js", color: "green-text-gradient" },
        { name: "fastify", color: "pink-text-gradient" },
      ],
      image: vikam,
      live_link: "https://vikam.io/",
    },
    {
      type: "work",
      name: "Quikkred Connect",
      label: "Lead developer",
      description:
        "I lead and built most of Quikkred Connect, the React Native app for Quikkred's retail lending partners, with PhonePe and PayU payments over UPI, biometric app lock, push notifications and live support chat.",
      tags: [
        { name: "react-native", color: "blue-text-gradient" },
        { name: "expo", color: "green-text-gradient" },
        { name: "upi", color: "pink-text-gradient" },
      ],
      image: quikkredConnect,
    },
    {
      type: "work",
      name: "Finvox: Encrypted Team Chat",
      label: "Lead developer",
      description:
        "I lead Finvox, a security-first team chat for web and mobile. Messages and files are end-to-end encrypted (MLS, HPKE), each tenant's data is isolated with PostgreSQL row-level security, and voice and video calls run on LiveKit.",
      tags: [
        { name: "typescript", color: "blue-text-gradient" },
        { name: "e2ee", color: "green-text-gradient" },
        { name: "react-native", color: "pink-text-gradient" },
      ],
      image: finvox,
    },
    {
      type: "personal",
      name: "MeetAI: Virtual Meeting Assistant",
      description:
        "An AI-powered platform where users create their own AI agent and hold interactive meetings with it, whether for brainstorming ideas, asking questions or getting instant help.",
      tags: [
        { name: "next.js", color: "blue-text-gradient" },
        { name: "polar", color: "green-text-gradient" },
        { name: "neondb", color: "pink-text-gradient" },
      ],
      image: logo2,
      live_link: "https://meetai-mu.vercel.app/",
      source_code_link: "https://github.com/JagratArora1/meetai",
    },
    {
      type: "personal",
      name: "Portfolio Website",
      description:
        "This site: React 19 and three.js with interactive 3D scenes, a pull-string lamp for light and dark mode, smooth scrolling, a static blog, and pages built for search engines and AI assistants.",
      tags: [
        { name: "react", color: "blue-text-gradient" },
        { name: "three.js", color: "green-text-gradient" },
        { name: "tailwind", color: "pink-text-gradient" },
      ],
      image: portfolio,
      source_code_link: "https://github.com/JagratArora1/Jagrat_Portfolio",
    },
    {
      type: "personal",
      name: "Infini: AI SaaS Platform",
      description:
        "A SaaS AI platform where users ask questions and generate images, videos and music from prompts.",
      tags: [
        { name: "react", color: "blue-text-gradient" },
        { name: "clerk", color: "green-text-gradient" },
        { name: "prisma", color: "pink-text-gradient" },
      ],
      image: logo1,
    },
  ];

  // Your public profiles. Shown in the footer; keep in sync with "sameAs" in
  // index.html so search engines link these accounts to this site.
  const socialLinks = [
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/jagrat-arora-0b923024b/",
    },
    {
      name: "GitHub",
      url: "https://github.com/JagratArora1",
    },
  ];

  export { services, technologies, experiences, testimonials, projects, socialLinks };

