import { useState, useEffect } from 'react';
import Login from '../components/Login';
import useAuth from '../hooks/useAuth';
import SignOut from '../components/Admin/SignOut';
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

  console.log("Admin: ", isAdmin);
  
  
  return (
    <div>
      {isAdmin ? (
          <>
            <div className='flex items-center justify-between p-6'>
              <div className='flex items-center gap-4'>
                <img src={user.photoURL} alt="Profile" className='rounded-full w-10' />
                <p><span className='font-semibold'>{user.displayName}</span></p>
              </div>
              <SignOut />
            </div>
            <AddOffice user={user} />
            <AddUser user={user} />
          </>
        )  : (
        <>
          <h1>ADMIN ACCESS ONLY</h1>
          <Login />
        </>
      )}
    </div>
    
  );
}
