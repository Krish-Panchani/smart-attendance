import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ref, onValue, set, push, serverTimestamp, get, update } from 'firebase/database';
import { rtdb, db } from '../firebase';
import { calculateDistance } from '../helpers/calculateDistance';
import useAuth from './useAuth';
import { collection, query, where, limit, onSnapshot } from 'firebase/firestore';

const useLocationTracker = () => {
  const [status, setStatus] = useState('Unknown');
  const [distance, setDistance] = useState(null);
  const [logs, setLogs] = useState([]);
  const [effectiveTime, setEffectiveTime] = useState(0);
  const [officeData, setOfficeData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  const isCheckedInRef = useRef(false); // Track check-in status to avoid multiple entries
  const user = useAuth();
  const userId = user?.uid;

  const getCurrentDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  // Fetch office data
  useEffect(() => {
    if (!user || !user.officeId) return;

    const findOfficeQuery = query(collection(db, 'offices'), where('uniqueId', '==', user.officeId), limit(1));
    const unsubscribe = onSnapshot(findOfficeQuery, (querySnapshot) => {
      const office = querySnapshot.docs[0]?.data();
      if (office) {
        setOfficeData({
          location: { lat: office.lat, lon: office.lng },
          checkinDistance: office.checkinDistance,
          name: office.name
        });
      } else {
        console.error("Office data not found");
        setOfficeData(null);
      }
      setLoading(false); // Stop loading after office data is fetched
    }, (error) => {
      console.error("Error fetching office data: ", error);
      setLoading(false); // Stop loading even if there's an error
    });

    return () => unsubscribe();
  }, [user]);

  // Get user location
  const getUserLocation = useCallback(() => {
    setLoading(true); // Start loading when fetching location
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = { lat: position.coords.latitude, lon: position.coords.longitude };
            setCurrentLocation(location);
            resolve(location);
            setLoading(false); // Stop loading after location is fetched
          },
          (error) => {
            reject(error);
            setLoading(false); // Stop loading if there's an error
          }
        );
      } else {
        reject(new Error("Geolocation is not supported by this browser."));
        setLoading(false); // Stop loading if geolocation is not supported
      }
    });
  }, []);

  // Update daily record
  const updateDailyRecord = useCallback(
    async (status) => {
      if (!userId) return;

      const todayDateStr = getCurrentDateStr;
      const dailyRecordRef = ref(rtdb, `dailyRecords/${userId}/${todayDateStr}`);
      const snapshot = await get(dailyRecordRef);

      if (status === 'checkin') {
        if (!snapshot.exists()) {
          await set(dailyRecordRef, {
            employeeId: userId,
            employeeEmail: user?.email,
            checkIn: serverTimestamp(),
            lastCheckOut: null,
            totalWorkingHours: 0,
            createdOn: serverTimestamp()
          });
        }
      } else if (status === 'checkout' && snapshot.exists()) {
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
    },
    [userId, getCurrentDateStr, user]
  );

  // Calculate effective working time
  const calculateEffectiveTime = useCallback(
    (logs) => {
      let totalMinutes = 0;
      let lastCheckin = null;

      logs.forEach((log) => {
        const timestamp = new Date(log.timestamp);
        if (log.status === 'checkin') {
          lastCheckin = timestamp;
        } else if (log.status === 'checkout' && lastCheckin) {
          const diff = timestamp - lastCheckin;
          totalMinutes += Math.round(diff / 60000);
          lastCheckin = null;
        }
      });

      if (isCheckedInRef.current && lastCheckin) {
        const now = new Date();
        const diff = now - lastCheckin;
        totalMinutes += Math.round(diff / 60000);
      }

      setEffectiveTime(totalMinutes);
    },
    []
  );

  // Write log entry
  const writeLog = useCallback(
    async (status) => {
      if (!userId || isProcessing) return;

      setIsProcessing(true);
      try {
        const todayDateStr = getCurrentDateStr;
        const logRef = ref(rtdb, `logs/${userId}/${todayDateStr}`);
        const snapshot = await get(logRef);
        const logsData = snapshot.exists() ? Object.values(snapshot.val()) : [];
        const lastLog = logsData[logsData.length - 1];
        const isCurrentlyCheckedIn = lastLog?.status === 'checkin';

        // Avoid writing duplicate log entries
        if ((status === 'checkin' && isCurrentlyCheckedIn) || (status === 'checkout' && !isCurrentlyCheckedIn)) {
          setIsProcessing(false);
          return;
        }

        const newLogRef = push(logRef);
        const userLocation = await getUserLocation();

        await set(newLogRef, {
          userId,
          status,
          user: user?.email,
          timestamp: serverTimestamp(),
          coordinates: userLocation,
          device: navigator.userAgent,
          network: navigator.connection?.effectiveType || 'Unknown'
        });

        await updateDailyRecord(status);
        isCheckedInRef.current = status === 'checkin'; // Update check-in status
      } catch (error) {
        console.error("Error writing log: ", error);
      } finally {
        setIsProcessing(false);
      }
    },
    [updateDailyRecord, userId, getCurrentDateStr, getUserLocation, isProcessing, user]
  );

  // Check location and update status
  const checkLocation = useCallback(() => {
    if (!officeData || !userId) return;

    getUserLocation()
      .then(async (userLocation) => {
        const { location, checkinDistance } = officeData;
        const currentDistance = calculateDistance(userLocation.lat, userLocation.lon, location.lat, location.lon);
        const logsRef = ref(rtdb, `logs/${userId}/${getCurrentDateStr}`);
        const snapshot = await get(logsRef);
        const logsData = snapshot.exists() ? Object.values(snapshot.val()) : [];
        const lastLog = logsData[logsData.length - 1];
        const isCurrentlyCheckedIn = lastLog?.status === 'checkin';

        if (currentDistance <= checkinDistance) {
          if (!isCurrentlyCheckedIn) {
            await writeLog('checkin');
            isCheckedInRef.current = true;
          }
          setStatus('Checked in');
          setDistance(`Within range: ${Math.round(currentDistance)} meters`);
        } else {
          if (isCurrentlyCheckedIn) {
            await writeLog('checkout');
            isCheckedInRef.current = false;
          }
          setStatus('Checked out');
          setDistance(`Distance from office: ${Math.round(currentDistance)} meters`);
        }

        setLogs(logsData);
        calculateEffectiveTime(logsData);
      })
      .catch((error) => console.error("Error getting location: ", error));
  }, [writeLog, calculateEffectiveTime, officeData, userId, getCurrentDateStr, getUserLocation]);

  // Set up location checking interval
  useEffect(() => {
    if (officeData && userId) {
      checkLocation();
      const intervalId = setInterval(checkLocation, 10000);
      return () => clearInterval(intervalId);
    }
  }, [checkLocation, officeData, userId]);

  // Listen for real-time updates to logs
  useEffect(() => {
    if (!userId) return;

    const logsRef = ref(rtdb, `logs/${userId}/${getCurrentDateStr}`);
    const unsubscribe = onValue(logsRef, (snapshot) => {
      const logsData = snapshot.val() ? Object.values(snapshot.val()) : [];
      setLogs(logsData);
      calculateEffectiveTime(logsData);
    });

    return () => unsubscribe();
  }, [calculateEffectiveTime, userId, getCurrentDateStr]);

  return { status, distance, logs, effectiveTime, isCheckedIn: isCheckedInRef.current, officeName: officeData?.name, currentLocation, loading };
};

export default useLocationTracker;
