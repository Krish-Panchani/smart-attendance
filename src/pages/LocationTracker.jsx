import useLocationTracker from '../hooks/useLocationTracker';
import LocationStatus from '../components/LocationStatus';
import TodayOfficeTime from '../components/TodayOfficeTime';
import TodayLogs from '../components/TodayLogs';
import useAuth from '../hooks/useAuth';
import { useState, useEffect } from 'react';

const LocationTracker = () => {
  const { status, distance, logs, effectiveTime, officeName, currentLocation, isLoading, error } = useLocationTracker();
  const user = useAuth();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (error) {
      setShowError(true);
    }
  }, [error]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg space-y-6">
      {user ? (
        <>
          {isLoading && (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
            </div>
          )}

          {!isLoading && !showError && (
            <>
              <LocationStatus
                status={status}
                distance={distance || 'Distance unknown'}
                officeName={officeName || 'Not Found'}
                userLocation={currentLocation}
              />
              <TodayOfficeTime logs={logs} effectiveTime={effectiveTime} isLoading={isLoading} />
              <TodayLogs logs={logs} isLoading={isLoading} />
            </>
          )}

          {showError && (
            <div className="text-center text-red-600 font-semibold">
              <p>Something went wrong. Please try again later.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-red-600 font-semibold">
          <p>Please login to track your location.</p>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;
