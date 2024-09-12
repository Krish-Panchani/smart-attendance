import { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs, where, limit, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';

const AddUser = ({ user }) => {
  const [employeecode, setEmployeecode] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [offices, setOffices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  useEffect(() => {
    const findOfficeQuery = query(collection(db, 'offices'), where('admin', '==', user.email), limit(1));
    const unsubscribe = onSnapshot(findOfficeQuery, (querySnapshot) => {
      const offices = [];
      querySnapshot.forEach((doc) => {
        offices.push({ ...doc.data(), id: doc.id });
      });
      setOffices(offices);
    });

    return () => unsubscribe();
  }, [user.email]);
  
  useEffect(() => {
    const fetchEmployees = async () => {
      const findEmployeeQuery = query(collection(db, 'users'), where('officeId', '==', offices.length > 0 ? offices[0].uniqueId : 'N/A'));
      const employeesCollection = await getDocs(findEmployeeQuery);
      const employeesList = employeesCollection.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEmployees(employeesList);
    };

    fetchEmployees();
  }, [offices]);

  const handleAddEmployee = async () => {
    try {
      setErrorMessage(''); // Reset error message

      // Query to check if user already exists
      const findUserQuery = query(collection(db, 'users'), where('userCode', '==', employeecode));
      const getUser = await getDocs(findUserQuery);

      if (!getUser.empty) {
        // If user is found, display error message
        setErrorMessage('User already exists!');
      } else {
        // If user not found, proceed with adding the employee
        const userDoc = getUser.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
        await updateDoc(userRef, {
          officeId: offices.length > 0 ? offices[0].uniqueId : 'N/A',
          role: role,
        });

        alert('Employee added successfully!');
        setEmployeecode('');
        setRole('EMPLOYEE');
      }
    } catch (error) {
      console.error('Error adding user:', error);
      setErrorMessage('An error occurred while adding the user.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add Employee</h2>
      
      {errorMessage && (
        <p className="text-red-500 mb-4">{errorMessage}</p> // Display error message
      )}

      <form 
        onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Add employee Code"
          value={employeecode}
          onChange={(e) => setEmployeecode(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        />

        <select 
          onChange={(e) => setRole(e.target.value)} 
          value={role}
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
        </select>
        
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
        >
          Add User
        </button>
      </form>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-800">Your Employees</h2>
      <ul className="space-y-4">
        {employees.map((employee) => (
          <li 
            key={employee.id} 
            className="p-4 bg-gray-100 rounded-lg shadow-md flex justify-between items-center"
          >
            <div>
              <p className="text-lg font-semibold text-gray-700">{employee.displayName}</p>
              <p className="text-sm text-gray-600">{employee.email}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

AddUser.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
  }).isRequired,
};

export default AddUser;
