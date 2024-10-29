import React, { FC, useState } from 'react';
import styles from './StopCard.module.scss';
import { Box, Button, Text, Flex } from '@chakra-ui/core';
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
      boxShadow="lg"
    >
      <Button
        height="70px"
        variant="unstyled"
        borderRadius="10px"
        width="100%"
        p={0}
        onClick={toggleExpand}
      >
        <Flex justify="space-between" align="center" px={4}>
          
          {/* Left-aligned route name */}
          <Flex direction="column" align="flex-start" minWidth="150px">
            <Text fontSize="lg">{route}</Text>
            <Text fontSize="sm" fontWeight="lighter">to {routeInfo.destination}</Text>
          </Flex>

          {/* Right-aligned time info */}
          <Flex direction="column" align="flex-end" textAlign="right" minWidth="60px">
            <Text fontSize="lg">5 min</Text>
            <Text fontSize="sm" fontWeight="lighter" color="gray.300">2 stops away</Text>
          </Flex>

          {/* Expand/Collapse Icon */}
          {isExpanded ? (
            <FiChevronUp size={20} color="gray.600" />
          ) : (
            <FiChevronDown size={20} color="gray.600" />
          )}
        </Flex>
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
