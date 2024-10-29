import { Alert, Box, Text } from '@chakra-ui/core';
import React from 'react';
import styles from './BusStopDashboard.module.scss';
import { useParams } from 'react-router-dom';
import StopLabel from '../StopLabel/StopLabel';
import StopCard from '../StopCard/StopCard';
import StopCardsList from '../StopCardsList/StopCardsList';
import LaterArrivalsSection from '../LaterArrivalsSection/LaterArrivalsSection';
import AlertsSection from '../AlertsSection/AlertsSection';

interface BusStopDashboardProps {
  stopcode?: string; // Optional prop for the stopcode
  name?: string;     // Optional prop for the stop name
  // direction?: string;
}

// const getStopName = (stopcode: string): string => {
//   // Mock function to get the stop name based on the stop code
//   return `Bus Stop Name for ${stopcode}`;
// }

// const getRoutes = (stopcode: string): string[] => {
//   // Mock function to get the routes for a bus stop based on the stop code
//   return ["M60-SBS", "M101", "M125"];
// }

const BusStopDashboard: React.FC<BusStopDashboardProps> = ({ stopcode, name }) => {
  // Use the useParams hook to access the stopcode from the URL
  const params = useParams<{ stopcode: string }>();
  const urlStopcode = params.stopcode || stopcode; // Use the stopcode from URL or fallback to prop
  const routes: string[] = ["M60-SBS", "M101", "M125"];

  return (
    <Box className={styles.container}>
      <StopLabel name={name}></StopLabel>
      <StopCardsList routes={routes}></StopCardsList>
      <LaterArrivalsSection routes={routes}></LaterArrivalsSection>
      <AlertsSection routes={routes}></AlertsSection>

      {/* {urlStopcode ? (
        <p>Displaying information for stop code: {urlStopcode}</p>
      ) : (
        <p>Displaying default bus stop information for: {name}</p>
      )} */}
    </Box>

  );
};

export default BusStopDashboard;
