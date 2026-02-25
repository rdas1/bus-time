import React, { FC } from 'react';
import styles from './StopCardsList.module.scss';
import { Box } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';
import { Arrival, RouteInfo, StopInfo } from '../BusStopDashboard/BusStopDashboard';

interface StopCardsListProps {
  routes?: RouteInfo[];
  arrivalsData?: Record<string, Arrival[]>;
  preopenedRoute?: string;
  stopInfo?: StopInfo;
}

const StopCardsList: FC<StopCardsListProps> = ({routes = [], arrivalsData = {}, preopenedRoute = "", stopInfo = {} as StopInfo}) => {
  const normalizedPreopenedRoute = preopenedRoute.toLocaleLowerCase();
  return (
    <Box className={styles.routes} px={2}>
      {routes.map((routeInfo) => (
        <StopCard
          key={routeInfo.id}
          route={routeInfo}
          arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || ([] as Arrival[])}
          preOpened={routeInfo.shortName.toLocaleLowerCase() === normalizedPreopenedRoute}
          stopInfo={stopInfo}></StopCard>
      ))}
    </Box>
  );
}

export default StopCardsList;
