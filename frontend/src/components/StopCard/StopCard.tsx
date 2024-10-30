import React, { FC, useState } from 'react';
import styles from './StopCard.module.scss';
import { Box, Button, Text, Flex } from '@chakra-ui/react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { getRouteInfo, RouteInfo } from '../BusStopDashboard/BusStopDashboard';

interface StopCardProps {
  route?: string;
  preOpened?: boolean;
}

const StopCard: FC<StopCardProps> = ({ route, preOpened = false }) => {
  
  route = route || ""; // TODO: handle invalid route

  // Initialize isExpanded based on preOpened prop
  const [isExpanded, setIsExpanded] = useState(preOpened);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const routeInfo: RouteInfo = getRouteInfo(route);

  return (
    <Box 
      className={styles.StopCard}
      borderRadius="10px"
      my={2}
      boxShadow="sm"
    >
      <Button
        h={24}
        variant="plain"
        borderRadius="10px"
        width="100%"
        onClick={toggleExpand}
      >
        <Flex justify="space-around" align="center" pl={4} >
          
          {/* Left-aligned route name */}
          <Flex direction="column" align="flex-start" minW={40}>
            <Text fontSize="lg">{route}</Text>
            <Text lineClamp={isExpanded ? 1 : 1} text-wrap="wrap" overflow={isExpanded ? "visible" : "hidden"} fontSize="sm" textAlign="left" fontWeight="300">to {routeInfo.destination}</Text>
          </Flex>

          {/* Right-aligned time info */}
          <Flex direction="column" align="space-evenly" w={28} mx={1} pr={1}>
            <Text fontSize="lg">5 min</Text>
            <Text fontSize="sm" fontWeight="300" color="gray.100">2 stops away</Text>
          </Flex>
        </Flex>

        <Box mr={2}>
            {/* Expand/Collapse Icon */}
            {isExpanded ? (
              <FiChevronUp size={20} color="gray.600" />
            ) : (
              <FiChevronDown size={20} color="gray.600" />
            )}
        </Box>
      </Button>

      {/* Expanded Content */}
      {isExpanded && (
        <Box mt={2} px={4} py={3} borderRadius="10px" bg="black">
          <Text color="gray.600">Placeholder for embedded map or route details</Text>
        </Box>
      )}
    </Box>
  );
}

export default StopCard;
