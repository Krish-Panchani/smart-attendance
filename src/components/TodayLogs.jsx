import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaCalendarDay } from 'react-icons/fa';

const TodayLogs = ({ logs }) => (
  <motion.div
    className="bg-white p-6 rounded-lg shadow-lg mb-6 overflow-x-auto"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
      <FaCalendarDay className="text-blue-500 mr-2" /> Office Logs
    </h2>
    <table className="min-w-full divide-y divide-gray-300">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-300">
        {logs.map((log) => (
          <tr key={log.id || log.timestamp}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Invalid date'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {log.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </motion.div>
);

TodayLogs.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default TodayLogs;
