import React, { FC, useState } from 'react';
import styles from './StopCard.module.scss';
import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { RouteInfo, Arrival, getMinutesAway, StopInfo, AlertInfo } from '../BusStopDashboard/BusStopDashboard';
import MapWidget from '../MapWidget/MapWidget';
import ServiceAlertCard from '../ServiceAlertCard/ServiceAlertCard';

interface StopCardProps {
  route?: RouteInfo;
  arrivalsAlongRoute?: Arrival[];
  preOpened?: boolean;
  stopInfo?: StopInfo;
}

const convertMetersToFeet = (meters: number) => {
  return Math.floor(meters * 3.28084);
}

const getMinutesAwayText = (arrivalData) => {  
  const minutesAway = getMinutesAway(arrivalData.arrivalTime);
  if (Number.isNaN(minutesAway)) {
    return "Unknown";
  }
  // Actually, change to <30 seconds
  if (arrivalData.distanceAwayMeters <= 30.48)  { // TODO: make constant (100ft in meters)
    return "Now"
  }
  if (arrivalData.distanceAwayMeters < 152.4 || minutesAway == 0)  { // TODO: make constant (500ft in meters)
    return "Approaching"
  }
  return `${minutesAway} min`
}

const getStopsAwayText = (arrivalData) => {
  if (Number.isNaN(arrivalData.stopsAway)) {
    return "Check service alerts";
  }
  // Actually, change to <30 seconds
  if (arrivalData.distanceAwayMeters <= 30.48)  { // TODO: make constant (100ft in meters)
    return "At Stop"
  }
  if (arrivalData.distanceAwayMeters < 152.4 || arrivalData.numberOfStopsAway == 0)  { // TODO: make constant (500ft in meters)
    return `${convertMetersToFeet(arrivalData.distanceAwayMeters)} ft away`
  }
  if (arrivalData.stopsAway === 1) {
    return "1 stop away";
  }
  return `${arrivalData.stopsAway} stops away`;
}

const StopCard: FC<StopCardProps> = ({ route, arrivalsAlongRoute, preOpened = false, stopInfo={} as StopInfo}) => {
  
  route = route || {} as RouteInfo; // TODO: handle invalid route'
  arrivalsAlongRoute = arrivalsAlongRoute || [] as Arrival[]; // TODO: handle invalid arrivals
  
  const stopLatLong: [number, number] = [stopInfo.lat ?? 40.7128, stopInfo.lon ?? -74.006]; // TODO: handle invalid stopInfo
  // console.warn("stopLatLong", stopLatLong);
  
  const firstArrival = arrivalsAlongRoute[0] || {} as Arrival;
  let destinationText;
  try {
    destinationText = route.destination.split(" - ")[parseInt(firstArrival.directionRef)];
  } catch (error) {
    destinationText = route.destination;
  }

  const serviceAlerts: AlertInfo[] = firstArrival.serviceAlerts || [];

  // Initialize isExpanded based on preOpened prop
  const [isExpanded, setIsExpanded] = useState(preOpened);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <Box 
      borderRadius="10px"
      my={2}
    >
      <Button
        h={24}
        variant="plain"
        boxShadow="sm"
        className={styles.StopCard}
        borderRadius="10px"
        width="100%"
        onClick={toggleExpand}
      >
        <Flex justify="space-around" align="center" pl={4} >
          
          {/* Left-aligned route name */}
          <Flex direction="column" align="flex-start" minW={40}>
            <Text fontSize="lg">{route.shortName}</Text> {/* TODO: Display blue pill icon for bus routes */}
            <Text lineClamp={isExpanded ? 1 : 1} text-wrap="wrap" overflow={isExpanded ? "visible" : "hidden"} fontSize="sm" textAlign="left" fontWeight="300">to {destinationText}</Text>
          </Flex>

          {/* Right-aligned time info */}
          <Flex direction="column" align="space-evenly" w={28} mx={1} pr={1}>
            <Text fontSize="lg">{getMinutesAwayText(firstArrival)}</Text>
            <Text fontSize="sm" fontWeight="300" color="gray.100">{getStopsAwayText(firstArrival)}</Text>
          </Flex>
        </Flex>

        <Box mr={2}>
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <FiChevronUp size={20} />
            ) : (
              <FiChevronDown size={20} />
            )}
        </Box>
      </Button>

      {/* Expanded Content */}
      {isExpanded && (
        <Box mt={-4} px={4} py={4} borderRadius={"10px"} bgColor={"black"}>
          {/* <Text color="white" fontWeight={"medium"}>Current position:</Text> */}
          <Box mt={4} mb={4}>
            <MapWidget stationPosition={stopLatLong} arrivalsAlongRoute={arrivalsAlongRoute}></MapWidget> 
          </Box>
          {serviceAlerts.map((alert, index) => (
            <ServiceAlertCard key={index} alert={alert}></ServiceAlertCard>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default StopCard;
