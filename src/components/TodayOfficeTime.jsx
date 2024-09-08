// src/components/DetailedOfficeTime.js
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TodayOfficeTime = ({ logs, effectiveTime }) => {
  const lastCheckout = logs
    .filter(log => log.status === 'checkout')
    .sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate())[0];

  return (
    <>
      <motion.h2
        className="text-2xl font-semibold mt-6 mb-4 text-gray-700"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Detailed Office Time
      </motion.h2>

      <motion.table 
        className="min-w-full divide-y divide-gray-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">First Check-in</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Last Check-out</th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Effective Time in Office (minutes)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-300">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap">
              {logs.find(log => log.status === 'checkin')?.timestamp.toDate().toLocaleString() || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {lastCheckout?.timestamp.toDate().toLocaleString() || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{effectiveTime}</td>
          </tr>
        </tbody>
      </motion.table>
    </>
  );
};

TodayOfficeTime.propTypes = {
  logs: PropTypes.array.isRequired,
  effectiveTime: PropTypes.number.isRequired,
};

export default TodayOfficeTime;
