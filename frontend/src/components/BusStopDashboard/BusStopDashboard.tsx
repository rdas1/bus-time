import { Box } from '@chakra-ui/core';
import React from 'react';
import styles from './BusStopDashboard.module.scss';
import { useParams } from 'react-router-dom';
import StopLabel from '../StopLabel/StopLabel';

interface BusStopDashboardProps {
  stopcode?: string; // Optional prop for the stopcode
  name?: string;     // Optional prop for the stop name
}

// const getStopName = (stopcode: string): string => {
//   // Mock function to get the stop name based on the stop code
//   return `Bus Stop Name for ${stopcode}`;
// }

const BusStopDashboard: React.FC<BusStopDashboardProps> = ({ stopcode, name }) => {
  // Use the useParams hook to access the stopcode from the URL
  const params = useParams<{ stopcode: string }>();
  const urlStopcode = params.stopcode || stopcode; // Use the stopcode from URL or fallback to prop

  return (
    <Box className={styles.container}>
      <StopLabel name={name}></StopLabel>
      {urlStopcode ? (
        <p>Displaying information for stop code: {urlStopcode}</p>
      ) : (
        <p>Displaying default bus stop information for: {name}</p>
      )}
    </Box>
  );
};

export default BusStopDashboard;
