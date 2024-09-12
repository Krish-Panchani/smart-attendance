import { useState, useEffect, useCallback } from 'react';
import { ref, onValue, set, push, serverTimestamp, get, update } from 'firebase/database';
import { rtdb, db } from '../firebase';
import { calculateDistance } from '../helpers/calculateDistance';
import useAuth from './useAuth';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';

const useLocationTracker = () => {
  const [status, setStatus] = useState('Unknown');
  const [distance, setDistance] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [logs, setLogs] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(0);
  const [officeLocation, setOfficeLocation] = useState({ lat: 0, lon: 0 });
  const [checkinDistance, setCheckinDistance] = useState(100); // meters

  const user = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    if (!user || !user.officeId) {
      console.error("User or user.officeId is not defined");
      return;
    }

    const findOfficeQuery = query(collection(db, 'offices'), where('uniqueId', '==', user.officeId), limit(1));
    const unsubscribe = onSnapshot(findOfficeQuery, (querySnapshot) => {
      const office = querySnapshot.docs[0]?.data();
      if (office) {
        setOfficeLocation({ lat: office.lat, lon: office.lng });
        setCheckinDistance(office.checkinDistance);
      }
    });

    console.log("Office Location: ", officeLocation);
    console.log("Checkin Distance: ", checkinDistance);
    return () => unsubscribe();
  }, [user]);

  const getCurrentDateStr = () => new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
      }
    });
  };

  const updateDailyRecord = useCallback(async (status) => {
    const todayDateStr = getCurrentDateStr();
    const dailyRecordRef = ref(rtdb, `dailyRecords/${userId}/${todayDateStr}`);
    const snapshot = await get(dailyRecordRef);

    if (status === 'checkin') {
      if (!snapshot.exists()) {
        await set(dailyRecordRef, {
          employeeId: userId,
          checkIn: serverTimestamp(),
          lastCheckOut: null,
          totalWorkingHours: 0,
          createdOn: serverTimestamp()
        });
      }
    } else if (status === 'checkout') {
      if (snapshot.exists()) {
        const record = snapshot.val();
        const checkInTime = new Date(record.checkIn);
        const currentTime = Date.now();

        const totalMinutes = record.totalWorkingHours || 0;
        const newTotalMinutes = totalMinutes + Math.round((currentTime - checkInTime.getTime()) / 60000);

        await update(dailyRecordRef, {
          lastCheckOut: serverTimestamp(),
          totalWorkingHours: newTotalMinutes
        });
      }
    }
  }, [userId]);

  const calculateEffectiveTime = useCallback((logs) => {
    let totalMinutes = 0;
    let lastCheckin = null;

    logs.forEach(log => {
      const timestamp = new Date(log.timestamp);
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
    const todayDateStr = getCurrentDateStr();
    const logRef = ref(rtdb, `logs/${userId}/${todayDateStr}`);
    const newLogRef = push(logRef);

    const userLocation = await getUserLocation();

    await set(newLogRef, {
      userId: userId,
      status: status,
      timestamp: serverTimestamp(),
      coordinates: {
        lat: userLocation.lat,
        lon: userLocation.lon
      },
      device: navigator.userAgent,
      network: navigator.connection?.effectiveType || 'Unknown'
    });

    // Update daily record
    await updateDailyRecord(status);
  }, [updateDailyRecord, userId]);

  const checkLocation = useCallback(() => {
    getUserLocation()
      .then(async (userLocation) => {
        const currentDistance = calculateDistance(
          userLocation.lat,
          userLocation.lon,
          officeLocation.lat,
          officeLocation.lon
        );
console.log("userLocation", userLocation);  
        const logsRef = ref(rtdb, `logs/${userId}/${getCurrentDateStr()}`);
        const snapshot = await get(logsRef);
        const logsData = snapshot.exists() ? Object.values(snapshot.val()) : [];
        const lastLog = logsData[logsData.length - 1]; // Get the most recent log of the day
        const isCurrentlyCheckedIn = lastLog?.status === 'checkin';

        if (currentDistance <= checkinDistance) {
          if (!isCurrentlyCheckedIn) {
            await writeLog('checkin');
            setIsCheckedIn(true);
          }
          setStatus('Checked in');
          setDistance(`Within range: ${Math.round(currentDistance)} meters`);
        } else {
          if (isCurrentlyCheckedIn) {
            await writeLog('checkout');
            setIsCheckedIn(false);
          }
          setStatus('Checked out');
          setDistance(`Distance from office: ${Math.round(currentDistance)} meters`);
        }

        setLogs(logsData);
        calculateEffectiveTime(logsData);
      })
      .catch((error) => {
        console.error("Error getting location: ", error);
      });
  }, [writeLog, calculateEffectiveTime, officeLocation, checkinDistance, userId]);

  useEffect(() => {
    checkLocation();
    const intervalId = setInterval(checkLocation, 60000);

    return () => clearInterval(intervalId);
  }, [checkLocation]);

  useEffect(() => {
    const logsRef = ref(rtdb, `logs/${userId}/${getCurrentDateStr()}`);
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const logsData = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLogs(logsData);
      calculateEffectiveTime(logsData);
    });

    return () => unsubscribe();
  }, [calculateEffectiveTime, userId]);

  return { status, distance, logs, effectiveTime, isCheckedIn };
};

export default useLocationTracker;