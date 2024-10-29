import React, { FC } from 'react';
import styles from './AlertsSection.module.scss';
import { Box, Text } from '@chakra-ui/core';
import StopCard from '../StopCard/StopCard';

interface AlertsSectionProps {
  routes?: string[];
}

const AlertsSection: FC<AlertsSectionProps> = ({routes}) => {
  routes = routes || [];
  return (
    <Box>
      <Box  
        color="white" // Text color
        fontSize="2xl" // Set font size (you can also use values like '2xl', etc.)
        px={2}         // Padding
      >
        <Text fontWeight={"bold"}>Alerts:</Text> {/* Using Text component for better semantics */}      
      </Box>
      <Box className={styles.routes} px={1}>
          {routes.map((route, index) => (
            <StopCard key={index} route={route}></StopCard>
          ))}
        </Box>
    </Box>
  );
}


export default AlertsSection;
