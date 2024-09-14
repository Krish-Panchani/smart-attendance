import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const LocationStatus = ({ status, distance = 'Distance unknown', officeName = 'Office unknown', userLocation }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center"
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.p
      className={`text-2xl font-semibold mb-2 ${status === 'Checked out' ? 'text-red-600' : 'text-green-600'}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <FaMapMarkerAlt className="inline-block mr-2" /> Status: {status}
    </motion.p>

    <motion.p
      className={`text-xl ${status === 'Checked out' ? 'text-red-600' : 'text-green-600'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Distance: {distance}
    </motion.p>

    <motion.p
      className="text-lg text-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Office: {officeName}
    </motion.p>

    {userLocation ? (
      <motion.p
        className="text-lg text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Location: {userLocation.lat}, {userLocation.lon}
      </motion.p>
    ) : (
      <motion.p
        className="text-lg text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Location: Not available
      </motion.p>
    )}
  </motion.div>
);

LocationStatus.propTypes = {
  status: PropTypes.string.isRequired,
  distance: PropTypes.string,
  officeName: PropTypes.string,
  userLocation: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lon: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
};

export default LocationStatus;
