// src/hooks/useLocationTracker.js
import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, Timestamp, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { calculateDistance } from '../helpers/calculateDistance';

const officeLocation = { lat: 23.0490112, lon: 73.5549056 }; // Replace with office coordinates
const checkinDistance = 100; // meters
const userId = "123456"; // Replace with dynamic user ID if necessary

export const useLocationTracker = () => {
  const [status, setStatus] = useState('Unknown');
  const [distance, setDistance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(0);

  const updateLogs = useCallback(async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const logsRef = collection(db, 'logs');
    const logsQuery = query(
      logsRef,
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(today)),
      orderBy('timestamp')
    );

    const snapshot = await getDocs(logsQuery);
    const logsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    setLogs(logsData);
    calculateEffectiveTime(logsData);
  }, [userId]);

  const calculateEffectiveTime = useCallback((logs) => {
    let totalMinutes = 0;
    let lastCheckin = null;

    logs.forEach(log => {
      const timestamp = log.timestamp.toDate();
      if (log.status === 'checkin') {
        lastCheckin = timestamp;
      } else if (log.status === 'checkout' && lastCheckin) {
        const diff = timestamp - lastCheckin;
        totalMinutes += Math.round(diff / 60000);
        lastCheckin = null;
      }
    });

    if (isCheckedIn && lastCheckin) {
      // Add time from last check-in to now if the user is still checked in
      const now = new Date();
      const diff = now - lastCheckin;
      totalMinutes += Math.round(diff / 60000);
    }

    setEffectiveTime(totalMinutes);
  }, [isCheckedIn]);

  useEffect(() => {
    const checkLocation = async () => {
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

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const logsRef = collection(db, 'logs');
          const logsQuery = query(
            logsRef,
            where('userId', '==', userId),
            where('timestamp', '>=', Timestamp.fromDate(today)),
            orderBy('timestamp')
          );

          const snapshot = await getDocs(logsQuery);
          const logExists = snapshot.docs.some(doc => doc.data().status === 'checkin');

          if (currentDistance <= checkinDistance) {
            if (!isCheckedIn) {
              await addDoc(collection(db, 'logs'), {
                userId: userId,
                status: 'checkin',
                timestamp: Timestamp.now(),
              });
              setIsCheckedIn(true);
            }
            setStatus('Checked in');
            setDistance('Within range');
          } else {
            if (isCheckedIn && logExists) {
              await addDoc(collection(db, 'logs'), {
                userId: userId,
                status: 'checkout',
                timestamp: Timestamp.now(),
              });
              setIsCheckedIn(false);
            }
            setStatus('Checked out');
            setDistance(`Distance from office: ${Math.round(currentDistance)} meters`);
          }

          updateLogs();
        }, (error) => {
          console.error("Error getting location: ", error);
        });
      } else {
        setStatus("Geolocation is not supported by this browser.");
      }
    };

    checkLocation();
    const intervalId = setInterval(checkLocation, 10000); // Adjust interval as needed

    return () => clearInterval(intervalId);
  }, [isCheckedIn, updateLogs]);

  useEffect(() => {
    const logsRef = collection(db, 'logs');
    const logsQuery = query(
      logsRef,
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(new Date())),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const logsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setLogs(logsData);
      calculateEffectiveTime(logsData);
    });

    return () => unsubscribe();
  }, [userId, calculateEffectiveTime]);

  return { status, distance, logs, effectiveTime, isCheckedIn };
};
