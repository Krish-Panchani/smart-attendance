import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TodayLogs = ({ logs }) => (
  <>
    <motion.h2 
      className="text-2xl font-semibold mb-4 text-gray-700"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Office logs
    </motion.h2>

    <motion.table 
      className="min-w-full divide-y divide-gray-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
          <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-300">
        {logs.map((log) => (
          <tr key={log.id || log.timestamp}>
            <td className="px-6 py-4 whitespace-nowrap">
              {log.timestamp ? (new Date(log.timestamp).toLocaleString()) : 'Invalid date'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {log.status}
            </td>
          </tr>
        ))}
      </tbody>
    </motion.table>
  </>
);

TodayLogs.propTypes = {
  logs: PropTypes.array.isRequired,
};

export default TodayLogs;
