import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaCalendarDay } from 'react-icons/fa';

// Skeleton loader for the logs
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

// Component to display logs for today
const TodayLogs = ({ logs = [], isLoading = false }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg mb-6 overflow-x-auto border border-gray-200"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center space-x-2">
      <FaCalendarDay className="text-blue-600 text-3xl" />
      <span>Office Logs</span>
    </h2>

    {isLoading ? (
      <SkeletonLoader />
    ) : (
      <div className="relative overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.length ? (
              logs.map((log) => (
                <tr key={log.id || log.timestamp} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Invalid date'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {log.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  <p>No logs available</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {!logs.length && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500">
              <p>No logs available</p>
            </div>
          </div>
        )}
      </div>
    )}
  </motion.div>
);

TodayLogs.propTypes = {
  logs: PropTypes.array,
  isLoading: PropTypes.bool,
};

export default TodayLogs;
