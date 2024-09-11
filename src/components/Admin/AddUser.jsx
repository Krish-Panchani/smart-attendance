import { useState, useEffect } from 'react';
import { doc, updateDoc, collection, getDocs, where, limit, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import PropTypes from 'prop-types';

const AddUser = ({ user }) => {
  const [employeecode, setEmployeecode] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [offices, setOffices] = useState([]);
  const [employees, setEmployees] = useState([]);

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
    const findUserQuery = query(collection(db, 'users'), where('userCode', '==', employeecode));
    const getUser = await getDocs(findUserQuery);

    if (!getUser.empty) {
      console.log('User Found:', getUser.docs[0].data());

      const userDoc = getUser.docs[0];
      const usercRef = doc(db, 'users', userDoc.id);
      await updateDoc(usercRef, {
        officeId: offices.length > 0 ? offices[0].uniqueId : 'N/A',
        role: role,
      });
    } else {
      console.log('User not found');
    }
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleAddEmployee(); }}>
        <input
          type="text"
          placeholder="Add employee Code"
          value={employeecode}
          onChange={(e) => setEmployeecode(e.target.value)}
          required
        />
        <select onChange={(e) => setRole(e.target.value)} value={role}>
          <option value="EMPLOYEE">Employee</option>
          <option value="HR">HR</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <h2>
        Your Employees
      </h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id}>{employee.displayName} - {employee.email}</li>
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
