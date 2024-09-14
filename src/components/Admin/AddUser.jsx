import { useState, useEffect } from 'react';
import { doc, updateDoc, collection, where, query, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';

const AddUser = ({ user }) => {
  const [employeecode, setEmployeecode] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [office, setOffice] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [errorMessage, setErrorMessage] = useState(''); // State to store error messages

  useEffect(() => {
    // Combined effect for fetching both office and employees
    const findOfficeQuery = query(collection(db, 'offices'), where('admin', '==', user.email), limit(1));

    const unsubscribe = onSnapshot(findOfficeQuery, (querySnapshot) => {
      const officeData = querySnapshot.docs[0]?.data();
      if (officeData) {
        setOffice(officeData);
        const findEmployeeQuery = query(collection(db, 'users'), where('officeId', '==', officeData.uniqueId));

        // Dynamically listen for changes in employees under the office
        const unsubscribeEmployees = onSnapshot(findEmployeeQuery, (employeeSnapshot) => {
          const employeesList = employeeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setEmployees(employeesList);
        });

        // Unsubscribe from employee listener on unmount
        return () => unsubscribeEmployees();
      } else {
        setOffice(null); // Clear office if not found
        setEmployees([]); // Clear employees if no office
      }
    });

    // Clean up listener for office
    return () => unsubscribe();
  }, [user.email]);

  const handleAddEmployee = async () => {
    try {
      setErrorMessage(''); // Reset error message

      // Query to check if the user with the employee code already exists
      const findUserQuery = query(collection(db, 'users'), where('userCode', '==', employeecode));
      const getUser = await getDocs(findUserQuery);

      if (getUser.empty) {
        // If user is not found, display error message
        setErrorMessage('User with the provided employee code does not exist!');
      } else {
        // If user is found, proceed with updating the employee's office and role
        const userDoc = getUser.docs[0]; // Get the first document matching the query
        const userRef = doc(db, 'users', userDoc.id); // Get a reference to that user document

        // Update the user's officeId and role
        await updateDoc(userRef, {
          officeId: office?.uniqueId || 'N/A',
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
