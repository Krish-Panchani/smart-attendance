// src/components/Login.jsx

// import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Make sure to import firestore
import { FcGoogle } from "react-icons/fc";

const Login = () => {

  const auth = getAuth();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create or update user document in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        const randomId = () => Math.random().toString(36).substr(2, 4);
        await setDoc(userDocRef, {
          userCode: user.displayName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '') + '-' + randomId(),
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          role: 'GUEST', // Add role field
          officeId: "N/A",
          createdAt: Timestamp.now(),
          lastSignedInAt: Timestamp.now(),
          isAdmin: false

        });

        console.log("User document created in Firestore");
      }
    else {
      await setDoc(userDocRef, {
        lastSignedInAt: Timestamp.now()
      }, { merge: true });

      console.log("User document already exists in Firestore");
    }
  } catch (error) {
    console.error("Error during sign in:", error);
  }
};

return (
  <div>
    <button onClick={signInWithGoogle} className='flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 font-semibold px-4 py-2 rounded-full text-white'>
      <FcGoogle className='text-2xl bg-white rounded-full px-1 py-1' />
      <span className='text-xs sm:text-base font-semibold'>
        Sign in with Google
      </span>
    </button>
  </div>
);
};

export default Login;
