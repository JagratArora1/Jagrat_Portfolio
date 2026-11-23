
/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// import React from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "motion/react";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const ServiceCard = ({ index, title, icon }) => (
  <Tilt
    tiltMaxAngleX={45}
    tiltMaxAngleY={45}
    scale={1}
    transitionSpeed={450}
    className='xs:w-[250px] w-full'
  >
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className='w-full p-px rounded-[20px] shadow-card hover-glow'
    >
      <div
        
        className='bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col'
      >
        <img
          src={icon}
          alt={title}
          className='w-16 h-16 object-contain'
        />

        <h3 className='text-heading text-[20px] font-bold text-center'>
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>

);

const About = () => {
  return (
    <>
      <div className='flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16'>
        <div className='flex-1'>
          <motion.div variants={textVariant()}>
            <p className={styles.sectionSubText}>Introduction</p>
            <h2 className={styles.sectionHeadText}>Overview.</h2>
          </motion.div>

          <motion.p
            variants={fadeIn("", "", 0.1, 1)}
            className='mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]'
          >
            I&apos;m Jagrat Arora, a full-stack software developer based in Faridabad, India. At Quikkred, a digital lending platform, I lead development of the website, loan management CRM and backend, the Quikkred Connect partner app, VIKAM and Finvox, and I oversee the entire loan disbursement process. I build products end to end in TypeScript: React and Next.js web apps, React Native mobile apps, and Node.js (Fastify) services on PostgreSQL, MongoDB and Redis. Security has interested me since my first cybersecurity internships, and I bring it into everyday engineering, from end-to-end encryption and tenant isolation to hardened sign-in and role-based permissions. Before Quikkred I trained as a Java developer at Fidelity International. I like owning a feature from design to deployment, and I&apos;m always learning.
          </motion.p>
        </div>

        {/* Also referenced as the "image" of the Person in index.html's
            structured data, so keep the same file name if you replace it. */}
        <motion.div
          variants={fadeIn("left", "spring", 0.3, 1)}
          className='w-full max-w-[300px] mx-auto lg:mx-0 shrink-0 green-pink-gradient p-px rounded-[20px] shadow-card'
        >
          <img
            src='/jagrat-arora.jpg'
            alt='Jagrat Arora'
            width={800}
            height={1000}
            loading='lazy'
            decoding='async'
            className='w-full h-auto rounded-[20px] bg-tertiary'
          />
        </motion.div>
      </div>

      <div className='mt-20 flex flex-wrap gap-10'>
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");