import React, { FC } from 'react';
import styles from './StopLabel.module.scss';
import { Box, Flex, Text } from '@chakra-ui/react';

interface StopLabelProps {
  name?: string;
}

const StopLabel: FC<StopLabelProps> = ({ name }) => (
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
  >
    {/* <Flex align="center">
      <Text fontWeight="medium">Stop:</Text>
      <Text fontWeight={"medium"} ml={1}>{name}</Text>
    </Flex> */}
    <Text fontWeight={"medium"}>{name}</Text>
  </Box>
);

export default StopLabel;
