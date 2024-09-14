import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaMapMarkerAlt, FaInfoCircle, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import SignOut from './SignOut';
import useAuth from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Login from './Login';

const Navbar = () => {
  const user = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin === true);
        }
      }
    };
    checkAdmin();
  }, [user]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  return (
    <>
      <motion.nav
        className="bg-gradient-to-r from-teal-500 to-purple-600 p-6 shadow-md z-30 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold flex items-center space-x-2">
            <span>Geo Wave</span>
          </Link>
          <div className="hidden md:flex space-x-6 text-white">
            <Link to="/" className="flex items-center space-x-1 hover:text-gray-200">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/location" className="flex items-center space-x-1 hover:text-gray-200">
              <FaMapMarkerAlt />
              <span>Track Location</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 hover:text-gray-200">
              <FaInfoCircle />
              <span>About</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 hover:text-gray-200">
                <FaUser />
                <span>Admin</span>
              </Link>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={toggleSidebar} className="text-white focus:outline-none">
              {isSidebarOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Sidebar Menu */}
      <motion.div
        className={`fixed top-0 w-64 left-0 h-full bg-gradient-to-r from-teal-600 to-purple-700 text-white transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center py-4">
          <Link to="/" className="py-2 w-full text-center hover:text-gray-200" onClick={toggleSidebar}>
            <FaHome className="inline-block mr-2" />
            Home
          </Link>
          <Link to="/location" className="py-2 w-full text-center hover:text-gray-200" onClick={toggleSidebar}>
            <FaMapMarkerAlt className="inline-block mr-2" />
            Track Location
          </Link>
          <Link to="/about" className="py-2 w-full text-center hover:text-gray-200" onClick={toggleSidebar}>
            <FaInfoCircle className="inline-block mr-2" />
            About
          </Link>
          {isAdmin && (
            <Link to="/admin" className="py-2 w-full text-center hover:text-gray-200" onClick={toggleSidebar}>
              <FaUser className="inline-block mr-2" />
              Admin
            </Link>
          )}
        </div>
      </motion.div>

      {/* User Profile */}
      <div className="container mx-auto p-4">
        {user ? (
          <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 max-w-4xl mx-auto">
            {/* User Image */}
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-teal-500 shadow-lg"
              />
              <span className="absolute bottom-0 right-0 bg-green-500 border-2 border-white rounded-full h-6 w-6 md:h-8 md:w-8"></span>
            </div>

            {/* User Details */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user.displayName}</h2>
              <p className="text-gray-500 text-sm md:text-base">ID: {user.userCode}</p>
              <p className="text-gray-600 text-xs md:text-sm mt-1">
                {user.email} {/* Include more details if needed */}
              </p>
            </div>

            {/* Sign Out Button */}
            <div className="mt-4 md:mt-0">
              <SignOut />
            </div>
          </div>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
};

export default Navbar;
