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
        className="bg-blue-600 p-4 shadow-md z-30 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-xl font-bold flex items-center space-x-2">
            <FaHome />
            <span>Geo Wave</span>
          </Link>
          <div className="hidden md:flex space-x-6 text-white">
            <Link to="/" className="flex items-center space-x-1 hover:text-gray-300">
              <FaHome />
              <span>Home</span>
            </Link>
            <Link to="/location" className="flex items-center space-x-1 hover:text-gray-300">
              <FaMapMarkerAlt />
              <span>Track Location</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 hover:text-gray-300">
              <FaInfoCircle />
              <span>About</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="flex items-center space-x-1 hover:text-gray-300">
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
        className={`fixed top-0 left-0 h-full bg-blue-700 text-white transition-transform duration-300 ease-in-out z-40 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col items-center py-4">
          <Link to="/" className="py-2 w-full text-center hover:text-gray-300" onClick={toggleSidebar}>
            <FaHome className="inline-block mr-2" />
            Home
          </Link>
          <Link to="/location" className="py-2 w-full text-center hover:text-gray-300" onClick={toggleSidebar}>
            <FaMapMarkerAlt className="inline-block mr-2" />
            Track Location
          </Link>
          <Link to="/about" className="py-2 w-full text-center hover:text-gray-300" onClick={toggleSidebar}>
            <FaInfoCircle className="inline-block mr-2" />
            About
          </Link>
          {isAdmin && (
            <Link to="/admin" className="py-2 w-full text-center hover:text-gray-300" onClick={toggleSidebar}>
              <FaUser className="inline-block mr-2" />
              Admin
            </Link>
          )}
        </div>
      </motion.div>

      <div className="p-4">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src={user.photoURL} alt="Profile" className="rounded-full w-12 h-12 border-2 border-white" />
              <div className="text-gray-900">
                <p className="font-semibold">{user.displayName}</p>
                <p>({user.userCode})</p>
              </div>
            </div>
            <SignOut />
          </div>
        ) : (
          <Login />
        )}
      </div>
    </>
  );
};

export default Navbar;
