// LocationTracker.jsx
import { useState, useEffect } from 'react';
// import { db } from './firebaseConfig'; // Import Firestore instance
import { collection, query, where, getDocs, orderBy, addDoc, Timestamp } from 'firebase/firestore'; // Import Firestore functions

import { db } from '../firebase';
import { motion } from 'framer-motion';

const officeLocation = { lat: 23.0490112, lon: 73.5549056 }; // Replace with office coordinates
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

async function getCheckinStatusForToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  const logsRef = collection(db, 'logs'); // Correct reference to 'logs' collection
  const logsQuery = query(
    logsRef,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(today)), // Use Timestamp for date comparison
    orderBy('timestamp')
  );

  const snapshot = await getDocs(logsQuery);

  let foundCheckin = false;
  snapshot.forEach((doc) => {
    const log = doc.data();
    if (log.status === 'checkin') {
      foundCheckin = true;
    }
  });

  return foundCheckin;
}

async function getCheckinCheckoutLogs() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to start of day

  const logsRef = collection(db, 'logs'); // Correct reference to 'logs' collection
  const logsQuery = query(
    logsRef,
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(today)), // Use Timestamp for date comparison
    orderBy('timestamp')
  );

  const snapshot = await getDocs(logsQuery);

  const logs = [];
  snapshot.forEach((doc) => {
    logs.push(doc.data());
  });

  return logs;
}

function LocationTracker() {
  const [status, setStatus] = useState('Unknown');
  const [distance, setDistance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false); // State to keep track of check-in status
  const [logs, setLogs] = useState([]); // State to store check-in and check-out logs
  const [effectiveTime, setEffectiveTime] = useState(0); // State to store effective time in office

  useEffect(() => {
    async function checkLocation() {
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

          const isCheckinExists = await getCheckinStatusForToday();

          if (currentDistance <= checkinDistance) {
            if (!isCheckedIn) { // Check if the user is not already checked in
              await addDoc(collection(db, 'logs'), {
                userId: userId,
                status: 'checkin',
                timestamp: Timestamp.now(), // Use Timestamp.now() for current time
              });
              setIsCheckedIn(true); // Update state to reflect check-in
            }
            setStatus('Checked in');
            setDistance('Within range');
          } else {
            if (isCheckedIn && isCheckinExists) { // Ensure user is checked in and has a check-in log for today
              await addDoc(collection(db, 'logs'), {
                userId: userId,
                status: 'checkout',
                timestamp: Timestamp.now(),
              });
              setIsCheckedIn(false); // Update state to reflect checkout
            }
            setStatus('Checked out');
            setDistance(`Distance from office: ${Math.round(currentDistance)} meters`);

            if (!isCheckinExists) {
              setDistance(`You are ${Math.round(currentDistance)} meters away from the office.`);
            }
          }

          // Fetch logs and calculate effective time
          const fetchedLogs = await getCheckinCheckoutLogs();
          setLogs(fetchedLogs);
          calculateEffectiveTime(fetchedLogs);
        }, (error) => {
          console.error("Error getting location: ", error);
        });
      } else {
        setStatus("Geolocation is not supported by this browser.");
      }
    }

    function calculateEffectiveTime(logs) {
      let totalMinutes = 0;
      let firstCheckin = null;
      let lastCheckin = null;

      for (let i = 0; i < logs.length; i++) {
        const log = logs[i];
        const timestamp = log.timestamp.toDate();
        if (log.status === 'checkin') {
          if (!firstCheckin || timestamp < firstCheckin) {
            firstCheckin = timestamp;
          }
          lastCheckin = timestamp;
        } else if (log.status === 'checkout') {
          if (lastCheckin) {
            const diff = timestamp - lastCheckin;
            totalMinutes += Math.round(diff / 60000); // Convert milliseconds to minutes
            lastCheckin = null; // Reset lastCheckin after pairing with checkout
          }
        }
      }

      setEffectiveTime(totalMinutes);
    }

    // Check location every 5 seconds
    const intervalId = setInterval(checkLocation, 5000);

    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [isCheckedIn]);

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
              {logs.find(log => log.status === 'checkout')?.timestamp.toDate().toLocaleString() || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{effectiveTime}</td>
          </tr>
        </tbody>
      </motion.table>
    </div>
  );
}

export default LocationTracker;