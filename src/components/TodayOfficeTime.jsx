import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { FaClock } from 'react-icons/fa';

const TodayOfficeTime = ({ logs, effectiveTime }) => {
  const lastCheckout = logs
    .filter(log => log.status === 'checkout')
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  const firstCheckin = logs.find(log => log.status === 'checkin');

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-lg mb-6 overflow-x-auto"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-700 flex items-center">
        <FaClock className="text-green-500 mr-2" /> Detailed Office Time
      </h2>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">First Check-in</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Last Check-out</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Effective Time (minutes)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {firstCheckin ? new Date(firstCheckin.timestamp).toLocaleString() : "N/A"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {lastCheckout ? new Date(lastCheckout.timestamp).toLocaleString() : 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {effectiveTime}
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
};

TodayOfficeTime.propTypes = {
  logs: PropTypes.array.isRequired,
  effectiveTime: PropTypes.number.isRequired,
};

export default TodayOfficeTime;
