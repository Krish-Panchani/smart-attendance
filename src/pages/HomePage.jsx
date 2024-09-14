import { motion } from 'framer-motion';
import { FaRocket, FaInfoCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 animate-pulse">Welcome to Geo Wave</h1>
        <p className="text-lg sm:text-2xl mb-6 max-w-3xl mx-auto">
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
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-6 bg-white text-blue-600 rounded-lg shadow-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <feature.icon className="text-4xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-center">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action Section */}
      <div className="text-center mb-12 space-y-4">
        <motion.button
          className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Get Started
        </motion.button>
        <motion.button
          className="bg-white text-blue-600 px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
          whileHover={{ scale: 1.05 }}
        >
          Learn More
        </motion.button>
      </div>

      {/* Image Section */}
      <motion.div
        className="relative mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse w-full h-full bg-gray-300 rounded-lg"></div>
        </div>
        <img
          src="https://via.placeholder.com/1200x800"
          alt="Geo Wave Illustration"
          className="relative rounded-lg shadow-lg"
        />
      </motion.div>
    </div>
  );
};

// Define feature details to be mapped
const features = [
  {
    icon: FaMapMarkerAlt,
    title: 'Location Tracking',
    description: 'Monitor employee locations in real-time with precise geo-tagging.',
  },
  {
    icon: FaClock,
    title: 'Smart Time Logging',
    description: 'Automate attendance logging and reduce manual errors with smart time tracking.',
  },
  {
    icon: FaRocket,
    title: 'Boost Productivity',
    description: 'Enhance productivity with streamlined attendance processes and analytics.',
  },
  {
    icon: FaInfoCircle,
    title: 'Detailed Reports',
    description: 'Access comprehensive reports and insights to manage your workforce efficiently.',
  },
];

export default HomePage;
