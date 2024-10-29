import React, { FC } from 'react';
import styles from './StopCardsList.module.scss';
import { Box } from '@chakra-ui/core';
import StopCard from '../StopCard/StopCard';

interface StopCardsListProps {
  routes?: string[];
}

const StopCardsList: FC<StopCardsListProps> = ({routes,}) => {
  routes = routes || [];
  return (
  <Box className={styles.routes} px={2}>
    {routes.map((route, index) => (
      <StopCard key={index} route={route}></StopCard>
    ))}
    {/* <StopCard></StopCard> */}
  </Box>
  );
}

export default StopCardsList;
