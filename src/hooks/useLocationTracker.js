import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, serverTimestamp, get } from 'firebase/database';
import { rtdb } from '../firebase';
import { calculateDistance } from '../helpers/calculateDistance';

const officeLocation = { lat: 23.0916096, lon: 72.5385216 }; // Replace with office coordinates
const checkinDistance = 100; // meters
const userId = "123456"; // Replace with dynamic user ID if necessary

export const useLocationTracker = () => {
  const [status, setStatus] = useState('Unknown');
  const [distance, setDistance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(0);

  const calculateEffectiveTime = useCallback((logs) => {
    let totalMinutes = 0;
    let lastCheckin = null;

    logs.forEach(log => {
      const timestamp = new Date(log.timestamp); // Use numeric timestamp
      if (log.status === 'checkin') {
        lastCheckin = timestamp;
      } else if (log.status === 'checkout' && lastCheckin) {
        const diff = timestamp - lastCheckin;
        totalMinutes += Math.round(diff / 60000);
        lastCheckin = null;
      }
    });

    if (isCheckedIn && lastCheckin) {
      const now = new Date();
      const diff = now - lastCheckin;
      totalMinutes += Math.round(diff / 60000);
    }

    setEffectiveTime(totalMinutes);
  }, [isCheckedIn]);

  const writeLog = useCallback(async (status) => {
    const logRef = ref(rtdb, `logs/${userId}`);
    const newLogRef = push(logRef);

    await set(newLogRef, {
      userId: userId,
      status: status,
      timestamp: serverTimestamp(),
    });
  }, []);

  const checkLocation = useCallback(async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };

        const currentDistance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          officeLocation.lat,
          officeLocation.lon
        );

        console.log('User location:', userLocation);
        console.log('Current distance:', currentDistance);
        console.log('Is checked in:', isCheckedIn);
        console.log('Logs:', logs);

        const logsRef = ref(rtdb, `logs/${userId}`);
        const snapshot = await get(logsRef);
        const logsData = snapshot.exists() ? Object.values(snapshot.val()) : [];
        const lastCheckinLog = logsData.find(log => log.status === 'checkin');
        
        if (currentDistance <= checkinDistance) {
          if (!isCheckedIn) {
            if (!lastCheckinLog) {
              await writeLog('checkin');
              setIsCheckedIn(true);
            }
          }
          setStatus('Checked in');
          setDistance('Within range');
        } else {
          if (isCheckedIn && lastCheckinLog) {
            await writeLog('checkout');
            setIsCheckedIn(false);
          }
          setStatus('Checked out');
          setDistance(`Distance from office: ${Math.round(currentDistance)} meters`);
        }

        setLogs(logsData);
        calculateEffectiveTime(logsData);
      }, (error) => {
        console.error("Error getting location: ", error);
      });
    } else {
      setStatus("Geolocation is not supported by this browser.");
    }
  }, [isCheckedIn, writeLog, calculateEffectiveTime]);

  useEffect(() => {
    checkLocation(); // Initial check
    const intervalId = setInterval(checkLocation, 6000); // Check every minute

    return () => clearInterval(intervalId);
  }, [checkLocation]);

  useEffect(() => {
    const logsRef = ref(rtdb, `logs/${userId}`);
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const logsData = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLogs(logsData);
      calculateEffectiveTime(logsData);
    });

    return () => unsubscribe();
  }, [calculateEffectiveTime]);

  return { status, distance, logs, effectiveTime, isCheckedIn };
};
