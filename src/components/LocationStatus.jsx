// src/components/LocationStatus.js
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const LocationStatus = ({ status, distance }) => (
  <>
    <motion.p
      className={`text-xl mb-2 text-center font-medium ${status === 'Checked out' ? 'text-red-600' : 'text-green-600'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      Status: {status}
    </motion.p>
    
    <motion.p
      className={`text-xl mb-4 text-center font-medium ${status === 'Checked out' ? 'text-red-600' : 'text-green-600'}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {distance}
    </motion.p>
  </>
);

LocationStatus.propTypes = {
  status: PropTypes.string.isRequired,
  distance: PropTypes.string.isRequired,
};

export default LocationStatus;
