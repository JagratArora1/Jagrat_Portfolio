import { motion } from "motion/react"
import { styles } from "../styles"
import { staggerContainer } from "../utils/motion"

const SectionWrapper = (Component,idName) => 
function HOC(){
    return(
        <motion.section
            variants={staggerContainer()}
            initial="hidden"
            whileInView="show"
            // "some" + margin: tall sections (e.g. on phones) still trigger as soon
            // as their top is well inside the screen.
            viewport={{ once: true, amount: "some", margin: "0px 0px -20% 0px" }}
            className={`${styles.padding} max-w-7xl mx-auto relative z-0`}
        >
            <span className="hash-span" id={idName}>
                &nbsp;
            </span>
            <Component />
        </motion.section>
    );
};


export default SectionWrapper