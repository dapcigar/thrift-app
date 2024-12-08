import React from 'react';
import { motion } from 'framer-motion';

const pageTransitions = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 }
};

const AnimatedTransitions: React.FC = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransitions}
      className="space-y-4"
    >
      {/* Add your page content here */}
    </motion.div>
  );
};

export default AnimatedTransitions;