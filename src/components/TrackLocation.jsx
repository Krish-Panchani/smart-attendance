import { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client'; // Import the client
import useGeolocation from '../hooks/useGeolocation';
import MapComponent from './MapComponent';
import { APIProvider } from '@vis.gl/react-google-maps';

const socket = io('http://localhost:3000'); // Connect to the Socket.IO server

const TrackLocation = () => {
  const [employeeId] = useState('');
  const [name] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [range] = useState(100); // Range in meters
  const location = useGeolocation();

  useEffect(() => {
    // Fetch office location from server
    socket.on('officeLocation', (location) => {
      setOfficeLocation(location);
    });

    // Handle location status from server
    socket.on('locationStatus', (status) => {
      if (status.inRange) {
        setMessage('You are in range. Check-in now!');
      } else {
        setMessage('You are out of range.');
      }
    });

    return () => {
      socket.off('officeLocation');
      socket.off('locationStatus');
    };
  }, []);

  useEffect(() => {
    if (isRegistered && location.latitude && location.longitude) {
      const newLocation = {
        lat: location.latitude,
        lng: location.longitude,
      };

      setUserLocation(newLocation);

      // Send location to the server via WebSocket
      socket.emit('locationUpdate', {
        employeeId,
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  }, [location, employeeId, isRegistered]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/employee', { name, employeeId });
      setIsRegistered(true);
      setMessage('Employee registered successfully.');
    } catch (error) {
      console.error('Error submitting employee data:', error);
      setMessage('Error submitting employee data.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 md:p-8 mb-6">
        {!isRegistered ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration Form */}
          </form>
        ) : (
          <div className="text-center py-4">
            <p className="text-lg font-semibold text-green-600">Tracking your location...</p>
          </div>
        )}
        {message && (
          <p className={`mt-4 text-center font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>

      {officeLocation && (
        <div className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden mb-8">
          <APIProvider apiKey={import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY}>
            <MapComponent userLocation={userLocation} officeLocation={officeLocation} range={range} />
          </APIProvider>
        </div>
      )}
    </div>
  );
};

export default TrackLocation;
