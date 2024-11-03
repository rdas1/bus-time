import React, { FC } from 'react';
import styles from './ServiceAlertCard.module.scss';
import { AlertInfo } from '../BusStopDashboard/BusStopDashboard';
import { Box, Text } from '@chakra-ui/react';

interface ServiceAlertCardProps {
  alert: AlertInfo;
  bgColor?: string;
}

const ServiceAlertCard: FC<ServiceAlertCardProps> = ({alert, bgColor="#0039A6"}) => {
  alert = alert || {} as AlertInfo;
  return (
    <Box 
      // className={styles.ServiceAlertCard}
      bgColor={bgColor}
      borderRadius="10px"
      my={2}
      py={2}
      px={2}
      boxShadow={"sm"}
    >
      <Text fontSize="lg" p={2}>{alert.summary}</Text>      
    </Box>
  )
}

export default ServiceAlertCard;
