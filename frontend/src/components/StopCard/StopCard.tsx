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

const processDestinationName = (destination: string): string => {
  destination = destination.replace('LIMITED ', ''); // Replace hyphens with "to"
  destination = destination.replace('LTD ', ''); // Replace hyphens with "to"

  destination = destination.split(" via ")[0];

  destination = destination.replace('AV-', 'Av/'); // Add spaces around hyphens
  destination = destination.replace('ST-', 'St/'); // Add spaces around hyphens
  destination = destination.replace('ST & ', 'St/'); // Add spaces around hyphens
  destination = destination.replace('ST & ', 'St/'); // Add spaces around hyphens
  // Replace "NUMBER ST NUMBER AV" with "NUMBER ST/NUMBER AV"
  destination = destination.replace(/(\d+ St) (\d+ Av)/gi, '$1/$2');
  // Replace "NUMBER AV NUMBER ST" with "NUMBER AV/NUMBER ST"
  destination = destination.replace(/(\d+ Av) (\d+ St)/gi, '$1/$2');
  destination = destination.replace('/', ' / '); // Add spaces around slashes
  
  // Wrap street corners in parentheses only if there are words before them
  destination = destination.replace(/(\b\w+\b.*?)(\d+ \w+ \/ \d+ \w+)/g, '$1($2)');  // Capitalize the first letter of each word
  destination = destination.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');

  return destination;
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
    destinationText = processDestinationName(firstArrival.destination) 
    // destinationText = route.destination.split(" - ")[parseInt(firstArrival.directionRef)];
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
        px={2}
      >
        <Flex justify="space-around" align="center" pl={4} >
          
          {/* Left-aligned route name */}
          <Flex direction="column" align="flex-start" minW={40}>
            <Text fontSize="lg">{route.shortName}</Text> {/* TODO: Display blue pill icon for bus routes */}
            <Text lineClamp={isExpanded ? 0 : 1} text-wrap="wrap" overflow={isExpanded ? "visible" : "visible"} fontSize="sm" textAlign="left" fontWeight="300">to {destinationText}</Text>
          </Flex>

          {/* Right-aligned time info */}
          <Flex direction="column" align="space-evenly" w={28} mx={1}>
            <Text fontSize="lg">{getMinutesAwayText(firstArrival)}</Text>
            <Text fontSize="sm" fontWeight="300" color="gray.100">{getStopsAwayText(firstArrival)}</Text>
          </Flex>
        </Flex>

        <Box mr={4} pl={-2}>
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
