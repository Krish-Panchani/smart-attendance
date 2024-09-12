import  useLocationTracker from '../hooks/useLocationTracker';
import LocationStatus from '../components/LocationStatus';
import TodayOfficeTime from '../components/TodayOfficeTime';
import TodayLogs from '../components/TodayLogs';
import useAuth from '../hooks/useAuth';

const LocationTracker = () => {
  const { status, distance, logs, effectiveTime } = useLocationTracker();
  const user = useAuth();

  return (
    <>
    {
      user ? (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
        <LocationStatus status={status} distance={distance || 'Distance unknown'} />
        <TodayOfficeTime logs={logs} effectiveTime={effectiveTime} />
        <TodayLogs logs={logs} />
      </div>
      )
      :
      (
        <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
          <p className="text-xl text-center text-red-600 font-semibold">Please login to track your location</p>
        </div>
      )
    }

    </>
    
  );
};

export default LocationTracker;
