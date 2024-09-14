import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';

const SkeletonLoader = () => (
  <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 animate-pulse">
    <div className="flex items-center mb-4 space-x-4">
      <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
      <div className="h-6 bg-gray-300 w-1/3 rounded"></div>
    </div>
    <div className="space-y-4">
      <div className="bg-gray-300 h-6 rounded w-full"></div>
      <div className="bg-gray-300 h-6 rounded w-5/6"></div>
      <div className="bg-gray-300 h-6 rounded w-4/5"></div>
    </div>
  </div>
);

const TodayOfficeTime = ({ logs = [], effectiveTime = 0, isLoading = false }) => {
  const lastCheckout = logs
    .filter(log => log.status === 'checkout')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  const firstCheckin = logs.find(log => log.status === 'checkin');

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg mb-6 border border-gray-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
        <FaClock className="text-green-500 text-3xl" />
        <span>Detailed Office Time</span>
      </h2>

      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <div className="overflow-x-auto relative">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">First Check-in</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Last Check-out</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Effective Time (minutes)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {firstCheckin ? new Date(firstCheckin.timestamp).toLocaleString() : "N/A"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {lastCheckout ? new Date(lastCheckout.timestamp).toLocaleString() : 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {effectiveTime || 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
          {!logs.length && !isLoading && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <p>No logs available</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

TodayOfficeTime.propTypes = {
  logs: PropTypes.array,
  effectiveTime: PropTypes.number,
  isLoading: PropTypes.bool,
};

export default TodayOfficeTime;
