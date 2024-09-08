// src/components/LocationTracker.js

import { useLocationTracker } from '../hooks/useLocationTracker';
import LocationStatus from '../components/LocationStatus';
import TodayOfficeTime from '../components/TodayOfficeTime';
import TodayLogs from '../components/TodayLogs';

const LocationTracker = () => {
  const { status, distance, logs, effectiveTime } = useLocationTracker();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <LocationStatus status={status} distance={distance} />
      <TodayOfficeTime logs={logs} effectiveTime={effectiveTime} />
      <TodayLogs logs={logs} />
    </div>
  );
};

export default LocationTracker;
