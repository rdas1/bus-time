import React, { FC } from 'react';
import styles from './StopCardsList.module.scss';
import { Box } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';

interface StopCardsListProps {
  routes?: string[];
  preopenedRoute?: string;
}

const StopCardsList: FC<StopCardsListProps> = ({routes, preopenedRoute}) => {
  routes = routes || [];
  preopenedRoute = (preopenedRoute || "").toLocaleLowerCase();
  return (
  <Box className={styles.routes} px={2}>
    {routes.map((route, index) => (
      <StopCard key={index} route={route} preOpened={route.toLocaleLowerCase() === preopenedRoute}></StopCard>
    ))}
  </Box>
  );
}

export default StopCardsList;
