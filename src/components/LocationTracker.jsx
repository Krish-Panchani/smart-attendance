import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, orderBy, addDoc, Timestamp, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { motion } from 'framer-motion';

const officeLocation = { lat: 23.0490112, lon: 72.5549056 }; // Replace with office coordinates
const checkinDistance = 100; // meters
const userId = "123456"; // Replace with dynamic user ID if necessary

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const LocationTracker = () => {
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
    const logsData = snapshot.docs.map(doc => doc.data());

    setLogs(logsData);
    calculateEffectiveTime(logsData);
  }, [userId]);

  const calculateEffectiveTime = useCallback((logs) => {
    let totalMinutes = 0;
    let firstCheckin = null;
    let lastCheckin = null;

    logs.forEach(log => {
      const timestamp = log.timestamp.toDate();
      if (log.status === 'checkin') {
        if (!firstCheckin || timestamp < firstCheckin) {
          firstCheckin = timestamp;
        }
        lastCheckin = timestamp;
      } else if (log.status === 'checkout') {
        if (lastCheckin) {
          const diff = timestamp - lastCheckin;
          totalMinutes += Math.round(diff / 60000);
          lastCheckin = null;
        }
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
      const logsData = snapshot.docs.map(doc => doc.data());
      setLogs(logsData);
      calculateEffectiveTime(logsData);
    });

    return () => unsubscribe();
  }, [userId, calculateEffectiveTime]);

  const lastCheckout = logs
    .filter(log => log.status === 'checkout')
    .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())[0];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <motion.h1 
        className="text-2xl font-bold mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Location Tracker
      </motion.h1>

      <motion.p
        className={`text-lg mb-2 ${status === 'Checked out' ? 'text-red-500' : 'text-green-500'}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Status: {status}
      </motion.p>
      
      <motion.p
        className={`text-lg mb-4 ${status === 'Checked out' ? 'text-red-500' : 'text-green-500'}`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {distance}
      </motion.p>

      <motion.h2 
        className="text-xl font-semibold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Office Time Summary
      </motion.h2>

      <motion.table 
        className="min-w-full divide-y divide-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Check-in</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Check-out</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effective Time in Office (minutes)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              {logs.find(log => log.status === 'checkin')?.timestamp.toDate().toLocaleString() || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {lastCheckout?.timestamp.toDate().toLocaleString() || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{effectiveTime}</td>
          </tr>
        </tbody>
      </motion.table>
    </div>
  );
};

export default LocationTracker;
