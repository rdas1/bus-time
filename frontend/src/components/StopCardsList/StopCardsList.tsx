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

  const sortedRoutes = [...routes].sort((a, b) => {
    const aTime = arrivalsData[a.shortName]?.[0]?.arrivalTime;
    const bTime = arrivalsData[b.shortName]?.[0]?.arrivalTime;
    if (!aTime && !bTime) return 0;
    if (!aTime) return 1;
    if (!bTime) return -1;
    return new Date(aTime).getTime() - new Date(bTime).getTime();
  });

  return (
    <Box className={styles.routes} px={2}>
      {sortedRoutes.map((routeInfo) => (
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
