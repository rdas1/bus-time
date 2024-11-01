import React, { FC } from 'react';
import styles from './AlertsSection.module.scss';
import { Box, Text } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';
import { Arrival, RouteInfo } from '../BusStopDashboard/BusStopDashboard';

interface AlertsSectionProps {
  routes: RouteInfo[];
  arrivalsData?: Record<string, Arrival[]>; // TODO: create types for this
}

const AlertsSection: FC<AlertsSectionProps> = ({routes, arrivalsData}) => {
  routes = routes || [];
  arrivalsData = arrivalsData || {} as Record<string, Arrival[]>;
  return (
    <Box>
      <Box  
        color="white" // Text color
        fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
        px={3}         // Padding
      >
        <Text fontWeight={"bold"}>Service Alerts:</Text> {/* Using Text component for better semantics */}      
      </Box>
      <Box className={styles.routes} px={2}>
          {routes.map((routeInfo, index) => (
            <StopCard key={index} route={routeInfo} arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || [] as Arrival[]}></StopCard>
          ))}
        </Box>
    </Box>
  );
}


export default AlertsSection;
