import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

const TodayOfficeTime = ({ logs, effectiveTime }) => {
  const lastCheckout = logs
    .filter(log => log.status === 'checkout')
    .sort((a, b) => {
      const aTimestamp = new Date(a.timestamp);
      const bTimestamp = new Date(b.timestamp);
      return bTimestamp - aTimestamp;
    })[0];

  const firstCheckin = logs.find(log => log.status === 'checkin');

  return (
    <>
      <motion.h2>Detailed Office Time</motion.h2>
      <motion.table>
        <thead>
          <tr>
            <th>First Check-in</th>
            <th>Last Check-out</th>
            <th>Effective Time in Office (minutes)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            {/* <td>{firstCheckin?.timestamp?.toDate ? firstCheckin.timestamp.toDate().toLocaleString() : 'N/A'}</td> */}
            <td>{firstCheckin ? new Date(firstCheckin.timestamp).toLocaleString() : "N/A"}</td>
            <td>{lastCheckout ? new Date(lastCheckout.timestamp).toLocaleString() : 'N/A'}</td>
            <td>{effectiveTime}</td>
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
