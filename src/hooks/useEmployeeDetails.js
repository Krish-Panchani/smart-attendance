import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { rtdb, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const useEmployeeDetails = (officeId) => {
  const [employeesDetails, setEmployeesDetails] = useState([]);

  useEffect(() => {
    if (!officeId) return;

    const fetchEmployeeDetails = async () => {
      try {
        // Fetch employees in the office
        const employeesQuery = query(collection(db, 'users'), where('officeId', '==', officeId));
        const employeesSnapshot = await getDocs(employeesQuery);
        const employees = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Fetch daily records from Realtime Database for each employee
        const todayDateStr = new Date().toISOString().split('T')[0];
        const updatedEmployees = await Promise.all(employees.map(async (employee) => {
          try {
            const dailyRecordRef = ref(rtdb, `dailyRecords/${employee.id}/${todayDateStr}`);
            const snapshot = await get(dailyRecordRef);
            const record = snapshot.exists() ? snapshot.val() : null;

            return {
              ...employee,
              checkIn: record?.checkIn ? new Date(record.checkIn).toLocaleString() : 'N/A',
              lastCheckOut: record?.lastCheckOut ? new Date(record.lastCheckOut).toLocaleString() : 'N/A',
              totalWorkingHours: record?.totalWorkingHours || 0,
            };
          } catch (error) {
            console.error(`Error fetching daily record for employee ${employee.id}:`, error);
            return {
              ...employee,
              checkIn: 'N/A',
              lastCheckOut: 'N/A',
              totalWorkingHours: 0,
            };
          }
        }));

        setEmployeesDetails(updatedEmployees);
        console.log('Employees details:', updatedEmployees);
      } catch (error) {
        console.error('Error fetching employee details:', error);
      }
    };

    fetchEmployeeDetails();
  }, [officeId]);

  return employeesDetails;
};

export default useEmployeeDetails;
