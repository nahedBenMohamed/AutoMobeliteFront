import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function SaveBig() {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  return (
    <section id="save-big">
      <motion.div
        className="bg-blue-600 text-white p-8 lg:p-16 my-16 lg:my-28"
        ref={ref}
        initial={{ opacity: 0, y: 50 }}
        animate={controls}
        transition={{ duration: 1 }}
      >
        <div className="text-center space-y-8">
          <motion.h1
            className="text-4xl lg:text-5xl font-bold leading-tight text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Save big with our cheap car rental!
          </motion.h1>
          <motion.p
            className="text-lg text-black lg:text-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            transition={{ delay: 1, duration: 1 }}
          >
            Top airports, local suppliers,{" "}
            <span className="text-blue-200">24/7</span> support.
          </motion.p>
        </div>
      </motion.div>
    </section>
  );
}

export default SaveBig;
