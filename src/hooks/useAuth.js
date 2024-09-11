import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { db as firestore } from '../firebase';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        const userDocRef = doc(firestore, 'users', authUser.uid); // Assuming email is used as ID
        const docSnap = await getDoc(userDocRef);
        console.log("doc snap: ", docSnap.data());

        if (docSnap.exists()) {
          setUser({ ...authUser, role: docSnap.data().role, officeId: docSnap.data().officeId, userCode: docSnap.data().userCode });
        } else {
          setUser({ ...authUser, role: 'GUEST' }); // Default role
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  return user;
};

export default useAuth;
