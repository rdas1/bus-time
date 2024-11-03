import React, { FC } from 'react';
import styles from './ServiceAlertCard.module.scss';
import { AlertInfo } from '../BusStopDashboard/BusStopDashboard';
import { Box, Text } from '@chakra-ui/react';

interface ServiceAlertCardProps {
  alert: AlertInfo;
}

const ServiceAlertCard: FC<ServiceAlertCardProps> = ({alert}) => {
  alert = alert || {} as AlertInfo;
  return (
    <Box 
      className={styles.ServiceAlertCard}
      borderRadius="10px"
      my={2}
      boxShadow="sm"
    >
      <Text fontSize="lg" p={2}>{alert.summary}</Text>      
    </Box>
  )
}

export default ServiceAlertCard;
