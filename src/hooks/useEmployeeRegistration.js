import { useState } from 'react';
import axios from 'axios';

const useEmployeeRegistration = (setIsRegistered, setMessage) => {
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');

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

  return { handleSubmit, employeeId, setEmployeeId, name, setName };
};

export default useEmployeeRegistration;
