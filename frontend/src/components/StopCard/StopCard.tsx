import React, { FC, useState } from 'react';
import styles from './StopCard.module.scss';
import { Box, Button, Text, Flex } from '@chakra-ui/core';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface StopCardProps {
  route?: string;
  preOpened?: boolean;
}

const StopCard: FC<StopCardProps> = ({ route, preOpened = false }) => {
  
  // Initialize isExpanded based on preOpened prop
  const [isExpanded, setIsExpanded] = useState(preOpened);

  const toggleExpand = () => setIsExpanded(!isExpanded);

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
        <Flex justify="space-between" width="100%" align="center" px={4}>
          <Text textAlign="left" fontSize="lg">{route}</Text>
          
          <Flex direction="column" align="flex-end" justify="center" mt={-0.5} px={6}>
            <Text fontSize="lg" pr={0}>5 min</Text>
            <Text fontSize="sm" color="gray.400" mr={-3} mt={-1}>2 stops away</Text>
          </Flex>

          {isExpanded ? (
              <FiChevronUp size={20} color="gray.600" />
            ) : (
              <FiChevronDown size={20} color="gray.600" />
            )}
        </Flex>
      </Button>

      {isExpanded && (
        <Box 
          mt={2} 
          px={4} 
          py={3} 
          borderRadius="10px" 
          bg="black"
        >
          <Text color="gray.600">Placeholder for embedded map or route details</Text>
        </Box>
      )}
    </Box>
  );
}

export default StopCard;
