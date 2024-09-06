import { useState, useEffect } from 'react';
import axios from 'axios';
import useGeolocation from '../hooks/useGeolocation';
import MapComponent from './MapComponent';
import { APIProvider } from '@vis.gl/react-google-maps';

const TrackLocation = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [officeLocation, setOfficeLocation] = useState(null);
  const [range] = useState(100); // Range in meters
  const location = useGeolocation();

  useEffect(() => {
    const fetchOfficeLocation = async () => {
      try {
        const response = await axios.get('http://localhost:3000/office-location');
        setOfficeLocation(response.data);
      } catch (error) {
        console.error('Error fetching office location:', error);
      }
    };

    fetchOfficeLocation();
  }, []);

  useEffect(() => {
    if (isRegistered && location.latitude && location.longitude) {
      const newLocation = {
        lat: location.latitude,
        lng: location.longitude
      };

      setUserLocation(newLocation);

      const sendLocationToServer = async () => {
        try {
          await axios.post('http://localhost:3000/location', {
            employeeId,
            latitude: location.latitude,
            longitude: location.longitude,
          });
        } catch (error) {
          console.error('Error sending location data:', error);
          setMessage('Error sending location data');
        }
      };

      sendLocationToServer();
      const intervalId = setInterval(sendLocationToServer, 2 * 60 * 1000); // every 2 minutes
      return () => clearInterval(intervalId);
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
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Employee Registration</h2>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="flex flex-col">
              <label className="block text-gray-700 font-medium mb-1">Employee ID:</label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your employee ID"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Register
            </button>
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
          <APIProvider apiKey={'AIzaSyD_FrgyhVOeCGynmg5F2lxYeRYKNV3O0hA'}>
            <MapComponent userLocation={userLocation} officeLocation={officeLocation} range={range} />
          </APIProvider>
        </div>
      )}
    </div>
  );
};

export default TrackLocation;
