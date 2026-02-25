import React, { FC, useMemo } from 'react';
import styles from './AlertsSection.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { AlertInfo, Arrival } from '../BusStopDashboard/BusStopDashboard';
import ServiceAlertCard from '../ServiceAlertCard/ServiceAlertCard';

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

  const serviceAlerts = useMemo(() => getAlerts(arrivalsData ?? {}), [arrivalsData]);

  return (
    <Box my={2} pb={6}>
      <Box  
        color="white" // Text color
        fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
        px={3}         // Padding
      >
        <Text fontWeight={"bold"}>Service Alerts:</Text> {/* Using Text component for better semantics */}      
      </Box>
      <Box className={styles.routes} px={2}>
        {serviceAlerts.map((alert) => (
          <ServiceAlertCard key={alert.situationNumber} alert={alert}></ServiceAlertCard>
        ))}
      </Box>
    </Box>

  );
}


export default AlertsSection;
