import {Box, Text } from '@chakra-ui/react';
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

export interface RouteInfo {
  route: string;
  // stops?: StopInfo[]; // something like this?
  // alerts?: AlertInfo[]; // something like this?
  name: string;
  destination: string;
  // direction: number; 
}

export const getStopName = (stopcode: string): string => {
  // Mock function to get the stop name based on the stop code
  // TODO: update later with actual API call / config data read
  return "West 125th St & 5th Ave";
}

export const getRoutes = (stopcode: string): string[] => {
  // Mock function to get the routes for a bus stop based on the stop code
  // TODO: update later with actual API call / config data read
  return ["M60-SBS", "M101", "M125"];
}

export const getRouteInfo = (route: string): RouteInfo => {
  // Mock function to get the route info based on the route
  // TODO: update later with actual API call / config data read
  switch (route) {
    case "M60-SBS":
      return {
        route: "M60-SBS",
        name: "M60-SBS West Side - LaGuardia Airport",
        destination: "LaGuardia Airport",
      };
    case "M101":
      return {
        route: "M101",
        name: "M101 East Village - Fort George",
        destination: "East Village",
      };
    case "M125":
      return {
        route: "M125",
        name: "M125 Manhattanville - The Hub",
        destination: "The Hub 3 Av / 149 St",
      };
    default:
      return {
        route: "route",
        name: "name",
        destination: "destination",
      };
    }
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
