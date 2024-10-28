import React, { FC } from 'react';
import styles from './StopLabel.module.scss';
import { Box, Text } from '@chakra-ui/core';

interface StopLabelProps {
  name?: string;
}

const StopLabel: FC<StopLabelProps> = ({ name }) => (
  <Box
    bg="mtaColors.labelPurple" // You can use the exact color value or define it in your theme
    color="white" // Text color
    fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
    px={4}         // Padding
    py={1}         // Padding
    my={4}         // Margin
    borderRadius="md" // Optional: Add rounded corners
  >
    <Text fontWeight="bold">{name}</Text> {/* Using Text component for better semantics */}
  </Box>
);

export default StopLabel;
