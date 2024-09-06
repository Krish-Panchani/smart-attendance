import { useState, useEffect } from 'react';
import axios from 'axios';

const useOfficeLocation = () => {
  const [officeLocation, setOfficeLocation] = useState(null);

  useEffect(() => {
    const fetchOfficeLocation = async () => {
      try {
        const response = await axios.get('http://localhost:3000/office-location');
        console.log('Office location:', response.data); // Log the response data
        setOfficeLocation(response.data);
      } catch (error) {
        console.error('Error fetching office location:', error);
      }
    };

    fetchOfficeLocation();
  }, []);

  return officeLocation;
};

export default useOfficeLocation;
