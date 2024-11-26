import {
    mobile,
    backend,
    creator,
    web,
    javascript,
    typescript,
    html,
    css,
    reactjs,
    tailwind,
    innovate,
    internshala,
    cybervidya,
    c,
    java,
    cyber,
    logo1,
    nodejs,
    mongodb,
    threejs,
    logo,
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
      id: "contact",
      title: "Contact",
    },
  ];
  
  const services = [
    {
      title: "Programmer",
      icon: web,
    },
    {
      title: "Cyber Security",
      icon: mobile,
    },
    {
      title: "Web Developer",
      icon: backend,
    },
    {
      title: "Ethical Hacker",
      icon: creator,
    },
  ];
  
  const technologies = [
    {
      name: "Java",
      icon: java,
    },
    {
      name: "C",
      icon: c,
    },
    {
      name: "CyberSecurity",
      icon: cyber,
    },
    {
      name: "HTML 5",
      icon: html,
    },
    {
      name: "CSS 3",
      icon: css,
    },
    {
      name: "JavaScript",
      icon: javascript,
    },
    {
      name: "TypeScript",
      icon: typescript,
    },
    {
      name: "React JS",
      icon: reactjs,
    },
    {
      name: "Tailwind CSS",
      icon: tailwind,
    },
    {
      name: "Node JS",
      icon: nodejs,
    },
    {
      name: "MongoDB",
      icon: mongodb,
    },
    {
      name: "Three JS",
      icon: threejs,
    },
  ];
  
  const experiences = [
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
      title: "Cybersecurity",
      company_name: "Innovate Intern",
      icon: innovate,
      iconBg: "#383E56",
      date: "August 2024",
      points: [
        "Gaining valuable insights into the evolving landscape of cybersecurity threats and vulnerabilities, the ethical considerations around developing security tools, and the importance of educating the public on cybersecurity ",
        "Made a project titled “Visualizing Intelligence Analysis and Investigation Techniques” where i have done a security audit on a website and found 14 vulnerabilities.",
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
      image: "https://cnvstudentphotos.s3.ap-south-1.amazonaws.com/gu_photos/5000670_AB-verycompressed-scale-6_00x-gigapixel.jpg",
    },
    {
      testimonial:
        "He is a good listener and helps everyone around him",
      name: "Miss Abha",
      designation: "CDC Professor",
      company: "MRIIRS-School of Engineering & Technology",
      image: "https://cnvstudentphotos.s3.ap-south-1.amazonaws.com/gu_photos/2010783_IMG_20220903_180426%20%281%29.jpg",
    },
  ];
  
  const projects = [
    {
      name: "SaaS based AI Platform : Infini  ",
      description:
        " Infini, a SaaS-based AI platform enables users to interact with AI for answering queries and generating multimedia content (images, videos, and music) through advanced prompt-based systems.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "clerk",
          color: "green-text-gradient",
        },
        {
          name: "prisma",
          color: "pink-text-gradient",
        },
      ],
      image: logo1,
      source_code_link: "https://ai-saas-platform-liard.vercel.app/",
    },
    {
      name: "Personal Portfolio Website using three.js",
      description:
        "A dynamic personal portfolio website using React and Three.js, showcasing projects, skills, and experience with an interactive and visually engaging 3D interface.",
      tags: [
        {
          name: "react",
          color: "blue-text-gradient",
        },
        {
          name: "three.js",
          color: "green-text-gradient",
        },
        {
          name: "emailjs",
          color: "pink-text-gradient",
        },
      ],
      image: logo,
      source_code_link: "https://github.com/",
    },
  ];
  
  export { services, technologies, experiences, testimonials, projects };