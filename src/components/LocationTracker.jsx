import PropTypes from 'prop-types';
const LocationTracker = ({ message }) => (
    <div className="text-center py-4">
        <p className="text-lg font-semibold text-green-600">Tracking your location...</p>
        {message && (
            <p className={`mt-4 text-center font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                {message}
            </p>
        )}
    </div>
);

LocationTracker.propTypes = {
    message: PropTypes.string,
  };


export default LocationTracker;
