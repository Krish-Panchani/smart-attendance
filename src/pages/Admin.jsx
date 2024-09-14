import { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; 
import AddOffice from '../components/Admin/AddOffice';
import AddUser from '../components/Admin/AddUser';

export default function Admin() {
  const user = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setIsAdmin(docSnap.data().isAdmin === true);
        }
      }
    }
    checkAdmin();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {isAdmin ? (
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add Office</h2>
              <AddOffice user={user} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add User</h2>
              <AddUser user={user} />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-red-600">ADMIN ACCESS ONLY</h1>
          <p className="text-lg text-gray-700 mt-4">You do not have permission to access this page.</p>
        </div>
      )}
    </div>
  );
}
