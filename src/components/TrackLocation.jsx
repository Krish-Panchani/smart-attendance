import { useState, useEffect } from 'react';
import useGeolocation from '../hooks/useGeolocation';
import useOfficeLocation from '../hooks/useOfficeLocation';
import useEmployeeRegistration from '../hooks/useEmployeeRegistration';
import MapComponent from './MapComponent';
import RegistrationForm from './RegistrationForm';
import LocationTracker from './LocationTracker';
import { APIProvider } from '@vis.gl/react-google-maps';

const TrackLocation = () => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [message, setMessage] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const location = useGeolocation();
  const officeLocation = useOfficeLocation();
  const { handleSubmit, employeeId, setEmployeeId, name, setName } = useEmployeeRegistration(setIsRegistered, setMessage);

  useEffect(() => {
    if (isRegistered && location.latitude && location.longitude) {
      const newLocation = {
        lat: location.latitude,
        lng: location.longitude,
      };

      setUserLocation(newLocation);
    }
  }, [location, employeeId, isRegistered]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6 md:p-8 mb-6">
        {!isRegistered ? (
          <RegistrationForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
            employeeId={employeeId}
            setEmployeeId={setEmployeeId}
          />
        ) : (
          <LocationTracker message={message} />
        )}
      </div>
      {officeLocation && (
        <div className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden mb-8">
          <APIProvider apiKey={import.meta.env.VITE_REACT_GOOGLE_MAPS_API_KEY}>
            <MapComponent userLocation={userLocation} officeLocation={officeLocation} range={100} />
          </APIProvider>
        </div>
      )}
    </div>
  );
};

export default TrackLocation;
