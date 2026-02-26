import React, { FC } from 'react';
import styles from './StopLabel.module.scss';
import { Box, Flex, Text } from '@chakra-ui/react';

interface StopLabelProps {
  name?: string;
  secondsUntilRefresh?: number;
}

const StopLabel: FC<StopLabelProps> = ({ name, secondsUntilRefresh }) => (
  <Box
    bg="mtaColors.labelPurple" // You can use the exact color value or define it in your theme
    color="white" // Text color
    fontSize="xl" // Set font size (you can also use values like '2xl', etc.)
    px={3}         // Padding
    py={2}         // Padding
    mt={2}         // Margin
    mb={4}         // Margin
    borderRadius="md" // Optional: Add rounded corners
    // boxShadow="sm"
    textAlign="left" // Center text alignment // TODO: add support for RTL languages
    position="sticky"
    top={0}
    zIndex={2}
  >
    <Flex align="center" justify="space-between">
      <Text fontWeight="medium">{name}</Text>
      {secondsUntilRefresh !== undefined && (
        <Text fontSize="sm" opacity={0.75} fontWeight="normal" flexShrink={0} ml={2}>
          ↻ {secondsUntilRefresh}s
        </Text>
      )}
    </Flex>
  </Box>
);

export default StopLabel;
