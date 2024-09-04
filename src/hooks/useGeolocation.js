import { useState, useEffect } from 'react';

const useGeolocation = (interval = 5000) => { // default interval is 120000ms (2 minutes)
  const [location, setLocation] = useState({ latitude: null, longitude: null, error: null });

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
            });
          },
          (error) => {
            setLocation((prevState) => ({ ...prevState, error: error.message }));
          }
        );
      } else {
        setLocation((prevState) => ({ ...prevState, error: 'Geolocation is not supported by this browser.' }));
      }
    };

    // Fetch location immediately on mount
    fetchLocation();

    // Set interval to fetch location periodically
    const intervalId = setInterval(fetchLocation, interval);

    // Cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, [interval]);

  return location;
};

export default useGeolocation;
