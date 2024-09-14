import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt } from 'react-icons/fa';

const SkeletonLoader = () => (
  <div className="bg-gray-200 p-6 rounded-lg shadow-lg mb-6 text-center animate-pulse">
    <div className="h-8 bg-gray-300 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 rounded mb-4"></div>
    <div className="h-6 bg-gray-300 rounded"></div>
  </div>
);

const LocationStatus = ({
  status = 'Status unknown',
  distance = 'Distance unknown',
  officeName = 'Office unknown',
  userLocation = null,
  isLoading = false,
}) => {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg mb-6 text-center border border-gray-200"
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

      <motion.p
        className="text-lg text-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Location: {userLocation ? `${userLocation.lat}, ${userLocation.lon}` : 'Not available'}
      </motion.p>
    </motion.div>
  );
};

LocationStatus.propTypes = {
  status: PropTypes.string,
  distance: PropTypes.string,
  officeName: PropTypes.string,
  userLocation: PropTypes.shape({
    lat: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    lon: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  isLoading: PropTypes.bool,
};

export default LocationStatus;
