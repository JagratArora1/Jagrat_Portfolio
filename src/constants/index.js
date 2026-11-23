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
      points: [
        "Main developer of Finvox, the company's end-to-end encrypted team chat for web and mobile: MLS group encryption, HPKE device linking, encrypted attachments, read receipts, tenant isolation with PostgreSQL row-level security, and LiveKit voice and video calls.",
        "Built most of Quikkred Connect, a React Native (Expo) app for retail lending partners, with PhonePe and PayU payments over UPI, biometric app lock, push notifications and live support chat.",
        "Own disbursal, bank payment files and credit-bureau reporting in FluxusForge, the company's multi-tenant lending platform (TypeScript, Fastify, Kysely, React).",
        "Shipped features across the loan management CRM (React 19, TypeScript): PhonePe e-mandates, credit-bureau report files, bank disbursement exports, permission controls and OCR receipt capture.",
        "Upgraded the VIKAM money app to Expo SDK 54 with 10-language support and hardened its OTP sign-in; led the frontend of the internal HR portal.",
      ],
    },
    {
      title: "Software Developer",
      company_name: "Fidelity International Limited",
      icon: fidelity,
      iconBg: "#383E56",
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

  // `label` is shown on the image. `live_link` and `source_code_link` are both
  // optional; work projects have private code, so they have no source link.
  const projects = [
    {
      name: "Finvox: Encrypted Team Chat",
      label: "Work project",
      description:
        "A security-first team chat for web and mobile that I built as the main developer at Quikkred. Messages and files are end-to-end encrypted (MLS, HPKE), each tenant's data is isolated with PostgreSQL row-level security, and voice and video calls run on LiveKit.",
      tags: [
        {
          name: "typescript",
          color: "blue-text-gradient",
        },
        {
          name: "e2ee",
          color: "green-text-gradient",
        },
        {
          name: "react-native",
          color: "pink-text-gradient",
        },
      ],
      image: finvox,
    },
    {
      name: "VIKAM: Money App for Bharat",
      label: "Work project",
      description:
        "A money and rewards app for India in 10+ languages, built by a small team at Quikkred. I upgraded the Expo mobile app to SDK 54, added the 10-language support, hardened OTP sign-in, and built parts of the rewards wallet and the admin exports.",
      tags: [
        {
          name: "expo",
          color: "blue-text-gradient",
        },
        {
          name: "next.js",
          color: "green-text-gradient",
        },
        {
          name: "fastify",
          color: "pink-text-gradient",
        },
      ],
      image: vikam,
      live_link: "https://vikam.io/",
    },
    {
      name: "MeetAI: Virtual Meeting Assistant",
      label: "Personal project",
      description:
        "An AI-powered platform where users create their own AI agent and hold interactive meetings with it, whether for brainstorming ideas, asking questions or getting instant help.",
      tags: [
        {
          name: "next.js",
          color: "blue-text-gradient",
        },
        {
          name: "polar",
          color: "green-text-gradient",
        },
        {
          name: "neondb",
          color: "pink-text-gradient",
        },
      ],
      image: logo2,
      live_link: "https://meetai-mu.vercel.app/",
      source_code_link: "https://github.com/JagratArora1/meetai",
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

