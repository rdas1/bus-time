import {Box, Text } from '@chakra-ui/core';
import React from 'react';
import styles from './BusStopDashboard.module.scss';
import { useParams } from 'react-router-dom';
import StopLabel from '../StopLabel/StopLabel';
import StopCardsList from '../StopCardsList/StopCardsList';
import LaterArrivalsSection from '../LaterArrivalsSection/LaterArrivalsSection';
import AlertsSection from '../AlertsSection/AlertsSection';

interface BusStopDashboardProps {
  stopcode?: string; // Prop for the stopcode
  preopenedRoute?: string; // Optional prop for the preopened route
  // name?: string;     // Optional prop for the stop name
  // direction?: string; // I think the database will take care of this, but will have to see
}

const getStopName = (stopcode: string): string => {
  // Mock function to get the stop name based on the stop code
  // TODO: update later with actual API call / config data read
  return "W 125th St & 5th Ave";
}

const getRoutes = (stopcode: string): string[] => {
  // Mock function to get the routes for a bus stop based on the stop code
  // TODO: update later with actual API call / config data read
  return ["M60-SBS", "M101", "M125"];
}

const BusStopDashboard: React.FC<BusStopDashboardProps> = ({ stopcode, preopenedRoute }) => {
  // Use the useParams hook to access the stopcode from the URL 
  // stopcode = urlParams.stopcode || (stopcode ?? "402506"); // Use the stopcode from URL or fallback to prop
  // TODO: check if stopcode is valid, if not, reroute to error page (maybe showing nearby stops?)
  stopcode = stopcode || "402506"; // Use the stopcode from URL or fallback to default value
  preopenedRoute = preopenedRoute?.toLocaleLowerCase() || ""; // Use the preopenedRoute from URL or fallback to empty string
  
  const stopName = getStopName(stopcode);
  const routes: string[] = getRoutes(stopcode);

  return (
    <Box className={styles.container}>
      <StopLabel name={stopName}></StopLabel>
      <StopCardsList routes={routes} preopenedRoute={preopenedRoute}></StopCardsList>
      <LaterArrivalsSection routes={routes}></LaterArrivalsSection>
      <AlertsSection routes={routes}></AlertsSection>
    </Box>

  );
};

export default BusStopDashboard;
