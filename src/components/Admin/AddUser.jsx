import { useState, useEffect } from 'react';
import { doc, updateDoc, collection, where, query, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';
import useEmployeeDetails from '../../hooks/useEmployeeDetails'; // Adjust path as necessary

const AddUser = ({ user }) => {
  const [employeecode, setEmployeecode] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [office, setOffice] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const employeesDetails = useEmployeeDetails(office?.uniqueId);
  console.log(employeesDetails);

  useEffect(() => {
    const findOfficeQuery = query(collection(db, 'offices'), where('admin', '==', user.email), limit(1));

    const unsubscribe = onSnapshot(findOfficeQuery, (querySnapshot) => {
      const officeData = querySnapshot.docs[0]?.data();
      if (officeData) {
        setOffice(officeData);
      } else {
        setOffice(null);
      }
    });

    return () => unsubscribe();
  }, [user.email]);

  const handleAddEmployee = async () => {
    try {
      setErrorMessage('');
      const findUserQuery = query(collection(db, 'users'), where('userCode', '==', employeecode));
      const getUser = await getDocs(findUserQuery);

      if (getUser.empty) {
        setErrorMessage('User with the provided employee code does not exist!');
      } else {
        const userDoc = getUser.docs[0];
        const userRef = doc(db, 'users', userDoc.id);
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

      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

      <form onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }} className="space-y-4">
        <input
          type="text"
          placeholder="Add employee Code"
          value={employeecode}
          onChange={(e) => setEmployeecode(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500"
        />

        <select onChange={(e) => setRole(e.target.value)} value={role} className="w-full px-4 py-2 border rounded-md text-gray-700 focus:outline-none focus:border-indigo-500">
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
        </select>

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">
          Add User
        </button>
      </form>

      <h2 className="text-3xl font-extrabold mt-10 mb-6 text-gray-900">Employee Directory</h2>
<ul className="space-y-6">
  {employeesDetails.map((employee) => (
    <li key={employee.id} className="p-6 bg-white rounded-lg shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 hover:border-gray-300 transition-all">
      <div className="flex-shrink-0">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-2xl font-semibold">
          {employee.displayName.charAt(0)}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 sm:ml-6 flex-grow">
        <p className="text-xl font-bold text-gray-800">{employee.displayName}</p>
        <p className="text-sm text-gray-600">{employee.email}</p>
        <p className="text-sm text-gray-600">Check In: {employee.checkIn}</p>
        <p className="text-sm text-gray-600">Last Check Out: {employee.lastCheckOut}</p>
        <p className="text-sm text-gray-600">Effective Time: {employee.totalWorkingHours} minutes</p>
      </div>
      <button className="mt-4 sm:mt-0 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-all">
        View Details
      </button>
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
