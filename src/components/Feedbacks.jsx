/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// import React from "react";
import { motion } from "motion/react";

import { styles } from "../styles";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { testimonials } from "../constants";

// "Arko Bagchi" -> "AB", "Miss Abha" -> "A" (titles are skipped).
const initials = (name) =>
  name
    .split(" ")
    .filter((word) => word && !/^(mr|mrs|ms|miss|dr|prof)\.?$/i.test(word))
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");

const FeedbackCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
}) => (
  <motion.div
    variants={fadeIn("", "spring", index * 0.5, 0.75)}
    className='bg-black-200 p-10 rounded-3xl xs:w-[320px] w-full hover-glow'
  >
    {/* eslint-disable-next-line react/no-unescaped-entities */}
    <p className='text-heading font-black text-[48px]'>"</p>

    <div className='mt-1'>
      <p className='text-heading tracking-wider text-[18px]'>{testimonial}</p>

      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-heading font-medium text-[16px]'>
            <span className='blue-text-gradient'>@</span> {name}
          </p>
          <p className='mt-1 text-secondary text-[12px]'>
            {designation} of {company}
          </p>
        </div>

        {image ? (
          <img
            src={image}
            alt={name}
            className='w-10 h-10 rounded-full object-cover'
          />
        ) : (
          // No photo yet: show initials. Add an `image` to the testimonial in
          // src/constants/index.js to use a real photo instead.
          <div
            aria-hidden='true'
            className='w-10 h-10 shrink-0 rounded-full green-pink-gradient flex items-center justify-center text-white text-[14px] font-semibold'
          >
            {initials(name)}
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

const Feedbacks = () => {
  return (
    <div className={`mt-12 bg-black-100 rounded-[20px]`}>
      <div
        className={`bg-tertiary rounded-2xl ${styles.padding} min-h-[300px]`}
      >
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>
      <div className={`-mt-20 pb-14 ${styles.paddingX} flex flex-wrap gap-7`}>
        {testimonials.map((testimonial, index) => (
          <FeedbackCard key={testimonial.name} index={index} {...testimonial} />
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Feedbacks, "");