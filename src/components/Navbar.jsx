import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignOut from './SignOut';
import useAuth from '../hooks/useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Login from './Login';

const Navbar = () => {
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
    <>
      <nav className="bg-blue-500 p-4">
        <ul className="flex space-x-4 justify-center text-white">
          <li>
            <Link to="/" className="hover:underline">Home</Link>
          </li>
          <li>
            <Link to="/location" className="hover:underline">Track Location</Link>
          </li>
          <li>
            <Link to="/about" className="hover:underline">About</Link>
          </li>
          {
            isAdmin && (
              <li>
                <Link to="/admin" className="hover:underline">Admin</Link>
              </li>
            )
          }
        </ul>
      </nav>
      {user ? (
        <div className='flex items-center justify-between p-6'>
          <div className='flex items-center gap-4'>
            <img src={user.photoURL} alt="Profile" className='rounded-full w-10' />
            <p><span className='font-semibold'>{user.displayName}</span></p>
            <p>({user.userCode})</p>
          </div>
          <SignOut />
        </div>
      )
    : (
      <Login />
    )}
    </>
  );
};

export default Navbar;
