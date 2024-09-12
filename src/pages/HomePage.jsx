import { motion } from 'framer-motion';
import { FaRocket, FaInfoCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Header Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-6xl font-extrabold mb-4 animate-pulse">Welcome to Geo Wave</h1>
        <p className="text-2xl mb-6 max-w-xl mx-auto">
          Your Smart Geo-Location Based Attendance System for Modern Workplaces. 
          Track time and location effortlessly with cutting-edge technology.
        </p>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <div className="flex flex-col items-center p-6 bg-white text-blue-600 rounded-lg shadow-lg">
          <FaMapMarkerAlt className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Location Tracking</h3>
          <p className="text-center">
            Monitor employee locations in real-time with precise geo-tagging.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white text-blue-600 rounded-lg shadow-lg">
          <FaClock className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Smart Time Logging</h3>
          <p className="text-center">
            Automate attendance logging and reduce manual errors with smart time tracking.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white text-blue-600 rounded-lg shadow-lg">
          <FaRocket className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Boost Productivity</h3>
          <p className="text-center">
            Enhance productivity with streamlined attendance processes and analytics.
          </p>
        </div>

        <div className="flex flex-col items-center p-6 bg-white text-blue-600 rounded-lg shadow-lg">
          <FaInfoCircle className="text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
          <p className="text-center">
            Access comprehensive reports and insights to manage your workforce efficiently.
          </p>
        </div>
      </motion.div>

      {/* Call to Action Section */}
      <div className="text-center mb-12">
        <motion.button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300 mr-4"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
        <motion.button
          className="bg-white text-blue-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Learn More
        </motion.button>
      </div>

      {/* Image Section */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <img
          src="https://via.placeholder.com/600x400"
          alt="Geo Wave Illustration"
          className="rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};

export default HomePage;
