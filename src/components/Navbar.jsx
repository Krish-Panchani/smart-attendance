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
      {/* Navbar */}
      <motion.nav
        className="bg-gradient-to-r from-teal-500 to-blue-500 p-4 shadow-md fixed top-0 w-full flex items-center justify-between z-50"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to="/" className="text-white text-3xl font-bold flex items-center space-x-2">
          <FaHome className="text-2xl" />
          <span>GeoWave</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-white font-semibold">
          <Link to="/" className="hover:text-gray-200 transition-colors">Home</Link>
          <Link to="/location" className="hover:text-gray-200 transition-colors">Track Location</Link>
          <Link to="/about" className="hover:text-gray-200 transition-colors">About</Link>
          {isAdmin && (
            <Link to="/admin" className="hover:text-gray-200 transition-colors">Admin</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="md:hidden text-white text-3xl focus:outline-none"
        >
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </motion.nav>

      {/* Sidebar Menu */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-start p-6 space-y-6">
          <Link to="/" className="flex items-center w-full text-lg text-gray-700 hover:bg-gray-100 py-3 px-4 rounded transition" onClick={toggleSidebar}>
            <FaHome className="mr-3" /> Home
          </Link>
          <Link to="/location" className="flex items-center w-full text-lg text-gray-700 hover:bg-gray-100 py-3 px-4 rounded transition" onClick={toggleSidebar}>
            <FaMapMarkerAlt className="mr-3" /> Track Location
          </Link>
          <Link to="/about" className="flex items-center w-full text-lg text-gray-700 hover:bg-gray-100 py-3 px-4 rounded transition" onClick={toggleSidebar}>
            <FaInfoCircle className="mr-3" /> About
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center w-full text-lg text-gray-700 hover:bg-gray-100 py-3 px-4 rounded transition" onClick={toggleSidebar}>
              <FaUser className="mr-3" /> Admin
            </Link>
          )}
        </div>
      </motion.div>

{/* User Profile */}
<div className="container mx-auto mt-20 p-4">
  {user ? (
    <div className="p-6 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 max-w-4xl mx-auto">
      {/* User Image */}
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <img
          src={user.photoURL}
          alt="Profile"
          className="w-full h-full object-cover rounded-full border-4 border-teal-400 shadow-lg"
        />
        <span className="absolute bottom-0 right-0 bg-green-400 border-2 border-white rounded-full h-6 w-6 md:h-8 md:w-8"></span>
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

      <style>{`
        .nav-item {
          font-size: 1.125rem; /* 18px */
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default Navbar;
