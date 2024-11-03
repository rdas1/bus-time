import React, { FC } from 'react';
import styles from './AlertsSection.module.scss';
import { Box, Text } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';
import { AlertInfo, Arrival, RouteInfo, StopInfo } from '../BusStopDashboard/BusStopDashboard';
import ServiceAlertCard from '../ServiceAlertCard/ServiceAlertCard';
import { get } from 'http';

interface AlertsSectionProps {
  arrivalsData?: Record<string, Arrival[]>; // TODO: create types for this
}

const getAlerts = (arrivalsData: Record<string, Arrival[]>): AlertInfo[] => {
  const alerts: AlertInfo[] = [];
  const seenSituationNumbers = new Set<string>(); // Create a Set to track unique situationNumbers

  for (const [routeShortName, arrivals] of Object.entries(arrivalsData)) {
    for (const arrival of arrivals) {
      if (arrival.serviceAlerts) {
        for (const alert of arrival.serviceAlerts) {
          // Check if the situationNumber is already in the Set
          if (!seenSituationNumbers.has(alert.situationNumber)) {
            seenSituationNumbers.add(alert.situationNumber); // Add to the Set
            alerts.push(alert); // Push the alert if it's unique
          }
        }
      }
    }
  }

  return alerts;
}


const AlertsSection: FC<AlertsSectionProps> = ({arrivalsData}) => {

  const serviceAlerts: AlertInfo[] = getAlerts(arrivalsData || {} as Record<string, Arrival[]>);

  return (
    <Box my={2}>
      <Box  
        color="white" // Text color
        fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
        px={3}         // Padding
      >
        <Text fontWeight={"bold"}>Service Alerts:</Text> {/* Using Text component for better semantics */}      
      </Box>
      <Box className={styles.routes} px={2}>
        {serviceAlerts.map((alert, index) => (
          <ServiceAlertCard key={index} alert={alert} bgColor='black'></ServiceAlertCard>
        ))}
      </Box>
      {/* <Box className={styles.routes} px={2}>
          {routes.map((routeInfo, index) => (
            <StopCard key={index} route={routeInfo} arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || [] as Arrival[]} stopInfo={stopInfo}></StopCard>
          ))}
        </Box> */}
    </Box>

  );
  // routes = routes || [];
  // arrivalsData = arrivalsData || {} as Record<string, Arrival[]>;
  // stopInfo = stopInfo || {} as StopInfo;
  // return (
  //   <Box>
  //     <Box  
  //       color="white" // Text color
  //       fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
  //       px={3}         // Padding
  //     >
  //       <Text fontWeight={"bold"}>Service Alerts:</Text> {/* Using Text component for better semantics */}      
  //     </Box>
  //     <Box className={styles.routes} px={2}>
  //         {routes.map((routeInfo, index) => (
  //           <StopCard key={index} route={routeInfo} arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || [] as Arrival[]} stopInfo={stopInfo}></StopCard>
  //         ))}
  //       </Box>
  //   </Box>
  // );
}


export default AlertsSection;
