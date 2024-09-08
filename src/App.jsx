import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import TrackLocation from './components/TrackLocation';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import LocationTracker from './components/LocationTracker';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track-location" element={<TrackLocation />} />
        <Route path="/location" element={<LocationTracker />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
