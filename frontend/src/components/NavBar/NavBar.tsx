import React, { FC } from 'react';
import styles from './NavBar.module.scss';
import { Box, Text } from '@chakra-ui/core';

interface NavBarProps {}

const NavBar: React.FC = () => {
  return (
    <Box
      width="100%"
      // bg="mtaColors.logoBlue" // Chakra UI blue color
      pt={4}        // Padding
      color="white" // Text color
      textAlign="center" // Center text alignment
    >
      <Text fontSize="2xl" fontWeight="bold">
        Bus Arrivals
      </Text>
    </Box>
  );
};

export default NavBar;
