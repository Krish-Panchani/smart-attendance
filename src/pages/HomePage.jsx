import { motion } from 'framer-motion';
import { FaRocket, FaInfoCircle, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 overflow-hidden">
      
      {/* Floating Background Elements */}
      <motion.div
        className="absolute top-10 left-10 w-48 h-48 bg-teal-200 opacity-40 rounded-full blur-2xl"
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-60 h-60 bg-purple-200 opacity-30 rounded-full blur-3xl"
        animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      {/* Header Section */}
      <motion.div
        className="text-center mb-20 relative px-4"
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Welcome to
          </motion.span>
          <motion.span
            className="inline-block text-teal-500 pl-3"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {' '}Geo Wave
          </motion.span>
        </h1>
        <motion.div
          className="text-lg sm:text-xl md:text-2xl mb-6 max-w-3xl mx-auto tracking-wide"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          Revolutionize Attendance with Geo-Location Technology.
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 px-6 w-full max-w-7xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center p-8 bg-gray-100 text-gray-900 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-500 hover:shadow-xl"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: index * 0.2 }}
          >
            <feature.icon className="text-5xl mb-4 text-teal-500" />
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-center text-base">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action Section */}
      <motion.div className="text-center mb-16 space-y-6 space-x-4 px-6">
        <motion.button
          className="bg-teal-500 text-white px-8 py-4 rounded-full shadow-lg hover:bg-teal-400 hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        >
          Get Started
        </motion.button>
        <motion.button
          className="bg-transparent border-2 border-teal-500 text-teal-500 px-8 py-4 rounded-full hover:bg-teal-500 hover:text-white hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.1 }}
        >
          Learn More
        </motion.button>
      </motion.div>

      {/* Image Section */}
      <motion.div
        className="relative mt-8 px-4 w-full max-w-4xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      >
        <motion.img
          src="home-img.jpeg"
          alt="Geo Wave Illustration"
          className="rounded-lg shadow-lg w-full h-auto"
          whileHover={{ scale: 1.03 }}
          transition={{ type: 'spring', stiffness: 200 }}
        />
      </motion.div>

      {/* Floating Circles Bottom */}
      <motion.div
        className="absolute bottom-10 left-1/4 w-40 h-40 bg-teal-100 opacity-20 rounded-full blur-3xl"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-10 right-1/4 w-48 h-48 bg-purple-100 opacity-20 rounded-full blur-3xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
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
