// src/components/Login.jsx

// import React from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc, getFirestore } from 'firebase/firestore';
import { db } from '../../firebase'; // Make sure to import firestore
import { FcGoogle } from "react-icons/fc";

const Login = () => {

  const auth = getAuth();
  const db = getFirestore();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if new admins are allowed
      const adminControlDocRef = doc(db, 'settings', 'adminControl');
      const adminControlDoc = await getDoc(adminControlDocRef);

      const allowNewAdmins = adminControlDoc.exists() ? adminControlDoc.data().allowNewAdmins : false;

      // Create or update user document in Firestore
      const userDocRef = doc(db, 'admins', user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        if (allowNewAdmins) {
          // New user, create document with admin privileges
          await setDoc(userDocRef, {
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            isAdmin: true // Mark as admin
          });

          console.log("User document created in Firestore as admin");
        } else {
          // New user, create document without admin privileges
          // await setDoc(userDocRef, {
          //   displayName: user.displayName,
          //   email: user.email,
          //   photoURL: user.photoURL,
          //   isAdmin: false // Mark as non-admin
          // });

          alert("You are not an admin. Please contact support if you believe this is a mistake.");
          await auth.signOut();
          console.log("Non-admin user signed out");
        }
      } else {
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
