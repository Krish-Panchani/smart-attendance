// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TrackLocation from './Testing_Comp/TrackLocation';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LocationTracker from './pages/LocationTracker';
import Admin from './pages/Admin';
import AddEmploee from './components/Admin/AddEmployee';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from './hooks/useAuth';

const PrivateRoute = ({ element, allowedRoles }) => {
  const user = useAuth();
  const userRole = user?.role; // Ensure role is fetched from the user's profile

  if (!user) {
    return <Navigate to="/employee-login" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return element;
};

// Define PropTypes for the PrivateRoute component
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track-location" element={<TrackLocation />} />
        <Route path="/location" element={<LocationTracker />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/add-employee" element={<AddEmploee />} />
        <Route path="*" element={<NotFoundPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;
