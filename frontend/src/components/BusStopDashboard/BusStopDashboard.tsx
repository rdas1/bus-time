import { Box, Text } from '@chakra-ui/core';
import React from 'react';
import styles from './BusStopDashboard.module.scss';
import { useParams } from 'react-router-dom';
import StopLabel from '../StopLabel/StopLabel';
import StopCard from '../StopCard/StopCard';

interface BusStopDashboardProps {
  stopcode?: string; // Optional prop for the stopcode
  name?: string;     // Optional prop for the stop name
  // direction?: string;
}

// const getStopName = (stopcode: string): string => {
//   // Mock function to get the stop name based on the stop code
//   return `Bus Stop Name for ${stopcode}`;
// }

const BusStopDashboard: React.FC<BusStopDashboardProps> = ({ stopcode, name }) => {
  // Use the useParams hook to access the stopcode from the URL
  const params = useParams<{ stopcode: string }>();
  const urlStopcode = params.stopcode || stopcode; // Use the stopcode from URL or fallback to prop
  const routes = ["M60-SBS", "M101", "M125"];

  return (
    <Box className={styles.container}>
      <StopLabel name={name}></StopLabel>
      <Box className={styles.routes} px={1}>
        {routes.map((route, index) => (
          <StopCard key={index} route={route}></StopCard>
        ))}
        {/* <StopCard></StopCard> */}
      </Box>
      <Box
          color="white" // Text color
          fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
      >
      <Box  
        color="white" // Text color
        fontSize="2xl" // Set font size (you can also use values like '2xl', etc.)
        px={1}         // Padding
        // py={2}         // Padding
        // my={2}         // Margin
        borderRadius="md" // Optional: Add rounded corners
      >
          <Text fontWeight={"bold"}>Later Arrivals:</Text> {/* Using Text component for better semantics */}      
      </Box>
        <Box className={styles.routes} px={1}>
        {routes.map((route, index) => (
          <StopCard key={index} route={route}></StopCard>
        ))}
        {/* <StopCard></StopCard> */}
      </Box>
    </Box>
      {/* {urlStopcode ? (
        <p>Displaying information for stop code: {urlStopcode}</p>
      ) : (
        <p>Displaying default bus stop information for: {name}</p>
      )} */}
    </Box>

  );
};

export default BusStopDashboard;
