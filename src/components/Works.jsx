/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// import React from 'react'
import Tilt from "react-parallax-tilt";
import { motion } from "motion/react";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects } from "../constants";
import { fadeIn, staggerContainer, textVariant } from "../utils/motion";

// Opens in a new tab; "external link" arrow, drawn inline so it needs no asset.
const LiveIcon = () => (
  <svg viewBox='0 0 24 24' className='w-1/2 h-1/2' fill='none' stroke='white' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <path d='M14 4h6v6' />
    <path d='M20 4l-9 9' />
    <path d='M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5' />
  </svg>
);

const CardLink = ({ href, label, children }) => (
  <a
    href={href}
    target='_blank'
    rel='noopener noreferrer'
    aria-label={label}
    title={label}
    className='black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer'
  >
    {children}
  </a>
);

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  label,
  live_link,
  source_code_link,
}) => {
  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.2, 0.75)}>
      <Tilt
        tiltMaxAngleX={45}
        tiltMaxAngleY={45}
        scale={1}
        transitionSpeed={450}
        className='bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full shadow-card hover-glow'
      >
        <div className='relative w-full h-[230px]'>
          <img
            src={image}
            alt={name}
            className='w-full h-full object-cover rounded-2xl'
          />

          <div className='absolute inset-0 flex justify-between items-start m-3 card-img_hover'>
            {label ? (
              <span className='px-3 py-1 rounded-full bg-black/70 text-white text-[12px] font-medium'>
                {label}
              </span>
            ) : (
              <span />
            )}
            <div className='flex gap-2'>
              {live_link && (
                <CardLink href={live_link} label={`Open ${name} (live site)`}>
                  <LiveIcon />
                </CardLink>
              )}
              {source_code_link && (
                <CardLink href={source_code_link} label={`${name} source code on GitHub`}>
                  <img
                    src={github}
                    alt=''
                    className='w-1/2 h-1/2 object-contain'
                  />
                </CardLink>
              )}
            </div>
          </div>
        </div>

        <div className='mt-5'>
          <h3 className='text-heading font-bold text-[24px]'>{name}</h3>
          <p className='mt-2 text-secondary text-[14px]'>{description}</p>
        </div>

        <div className='mt-4 flex flex-wrap gap-2'>
          {tags.map((tag) => (
            <p
              key={`${name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const groups = [
  {
    type: "work",
    title: "Work projects",
    intro:
      "Products I lead at Quikkred, where I also oversee the entire loan disbursement process. Their code is private, so these cards link to the live product where there is one.",
  },
  {
    type: "personal",
    title: "Personal projects",
    intro: "Things I've built on my own.",
  },
];

// Each group reveals itself when it scrolls into view. (The section as a
// whole is too tall on phones for a single trigger.)
const ProjectGroup = ({ title, intro, items }) => (
  <motion.div
    className='mt-16'
    initial='hidden'
    whileInView='show'
    viewport={{ once: true, amount: "some", margin: "0px 0px -15% 0px" }}
    variants={staggerContainer(0.1)}
  >
    <motion.div variants={textVariant()} className='flex flex-wrap items-center gap-3'>
      <h3 className='text-heading font-bold text-[26px] sm:text-[30px]'>{title}</h3>
      <span className='rounded-full px-3 py-0.5 text-[13px] font-semibold text-heading bg-black-100'>
        {items.length}
      </span>
    </motion.div>
    <motion.p
      variants={fadeIn("", "", 0.1, 0.8)}
      className='mt-2 text-secondary text-[16px] max-w-3xl leading-[28px]'
    >
      {intro}
    </motion.p>
    <div className='mt-8 flex flex-wrap gap-7'>
      {items.map((project, index) => (
        <ProjectCard key={project.name} index={index} {...project} />
      ))}
    </div>
  </motion.div>
);

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText} `}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className='w-full flex'>
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]'
        >
          Products I lead at Quikkred, and things I&apos;ve built on my own.
          Use the buttons on each card to open the live site or the source code.
        </motion.p>
      </div>

      {groups.map((group) => (
        <ProjectGroup
          key={group.type}
          title={group.title}
          intro={group.intro}
          items={projects.filter((project) => project.type === group.type)}
        />
      ))}
    </>
  );
};

export default SectionWrapper(Works, "");