import React, { FC } from 'react';
import styles from './LaterArrivalsSection.module.scss';
import { Box, Text } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';
import { Arrival, RouteInfo, StopInfo } from '../BusStopDashboard/BusStopDashboard';

interface LaterArrivalsSectionProps {
  routes?: RouteInfo[];
  arrivalsData?: Record<string, Arrival[]>; // TODO: create types for this
  stopInfo?: StopInfo;
}

// const removeFirstArrival = (arrivalsData: Record<string, Arrival[]>): Record<string, Arrival[]> => {
//   // console.log("removeFirstArrival", arrivalsData);
//   const slicedArrivalsData = {};
//   for (const [key, value] of Object.entries(arrivalsData)) {
//     console.log(key, value);
//     slicedArrivalsData[key] = value.slice(1);
//   }
//   return slicedArrivalsData as Record<string, Arrival[]>;
// }

const LaterArrivalsSection: FC<LaterArrivalsSectionProps> = ({routes, arrivalsData, stopInfo}) => {
  routes = routes || [];
  arrivalsData = arrivalsData || {} as Record<string, Arrival[]>;
  stopInfo = stopInfo || {} as StopInfo;
  // if (arrivalsData) {
  //   console.log("arrivalsData before", Object.keys(arrivalsData));
  //   arrivalsData = removeFirstArrival(arrivalsData);
  //   console.log("arrivalsData after", arrivalsData);
  // }
  return (
    <Box>
      <Box  
        color="white" // Text color
        fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
        px={3}         // Padding
      >
        <Text fontWeight={"bold"}>Later Arrivals:</Text> {/* Using Text component for better semantics */}      
      </Box>
      <Box className={styles.routes} px={2}>
        {routes.map((route, index) => (
          <StopCard key={index} route={route} arrivalsAlongRoute={(arrivalsData[route.shortName])?.slice(1) || []} stopInfo={stopInfo}></StopCard>
        ))}
      </Box>
    </Box>
  );
}

export default LaterArrivalsSection;
