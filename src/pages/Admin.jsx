// src/pages/Admin.js

import { useState, useEffect } from 'react';
import Login from '../components/Admin/Login';
import useAuth from '../hooks/useAuth';
import SignOut from '../components/Admin/SignOut';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure you have your Firestore instance
import AddOffice from '../components/Admin/AddOffice';

export default function Admin() {
  const user = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const userDocRef = doc(db, 'admins', user.uid);
        const docSnap = await getDoc(userDocRef);

        if (docSnap.exists()) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false); // If no user is logged in, they can't be an admin
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <p>Loading...</p>;
  }

  console.log(user);
  console.log(isAdmin);

  return (
    <div>
      
      {user ? (
        isAdmin ? (
          <>
          <div className='flex items-center justify-between p-6'>
          <div className='flex items-center gap-4'>
            <img src={user.photoURL} alt="Profile" className='rounded-full w-10'  />
            <p><span className='font-semibold'>{user.displayName}</span></p>
            </div>
            <SignOut />
            </div>
            <AddOffice user={user} />
          </>
        ) : (
          <p>Only Admins can access this page.</p>
        )
      ) : (
        <>
        <h1>ADMIN ACCESS ONLY</h1>
        <Login />
        </>
      )}
    </div>
  );
}
