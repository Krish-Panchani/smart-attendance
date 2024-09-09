// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return user;
};

export default useAuth;
