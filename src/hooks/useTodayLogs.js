import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database'; // Adjust imports as needed for your setup
import { rtdb } from '../firebase'; // Import your firebase RTDB instance

const useTodayLogs = (userId) => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const getCurrentDateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const logsRef = ref(rtdb, `logs/${userId}/${getCurrentDateStr}`);

    const unsubscribe = onValue(logsRef, (snapshot) => {
      const logsData = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLogs(logsData);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { logs, isLoading };
};

export default useTodayLogs;
