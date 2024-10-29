import React, { FC } from 'react';
import styles from './StopCard.module.scss';
import { Box, Button, Text, Flex } from '@chakra-ui/core';

interface StopCardProps {
  route?: string;
  preOpened?: boolean;
}

const StopCard: FC<StopCardProps> = ({ route, preOpened = false }) => (
  <Box 
    className={styles.StopCard}
    borderRadius="10px"
    my={2}
  >
    <Button
      height="70px" // Set height to accommodate both lines on the right
      variant="unstyled"
      borderRadius="10px"
      width="100%"
      p={0}
    >
      <Flex justify="space-between" width="100%" align="center" px={4}>
        {/* Left-aligned route name, vertically centered */}
        <Text textAlign="left" fontSize="lg">{route}</Text>
        
        {/* Right-aligned times: "5 min" centered with route, "2 stops away" below */}
        <Flex direction="column" align="flex-end" justify="center" mt={-0.5} px={6}>
          <Text fontSize="lg" pr={0}>5 min</Text>
          <Text fontSize="sm" color="gray.400" mr={-3} mt={-1}>2 stops away</Text>
        </Flex>
      </Flex>
    </Button>
  </Box>
);

export default StopCard;
