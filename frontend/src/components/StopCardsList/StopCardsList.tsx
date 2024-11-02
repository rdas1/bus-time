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

const StopCardsList: FC<StopCardsListProps> = ({routes, arrivalsData, preopenedRoute, stopInfo}) => {
  routes = routes || [] as RouteInfo[];
  preopenedRoute = (preopenedRoute || "").toLocaleLowerCase();
  arrivalsData = arrivalsData || {};
  stopInfo = stopInfo || {} as StopInfo;
  console.log("stopInfo in StopCardsList", stopInfo);
  return (
    <Box className={styles.routes} px={2}>
      {routes.map((routeInfo, index) => (
        <StopCard 
          key={index}
          route={routeInfo}
          arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || ([] as Arrival[])}
          preOpened={routeInfo.shortName.toLocaleLowerCase() === preopenedRoute}
          stopInfo={stopInfo}></StopCard>
      ))}
    </Box>
  );
}

export default StopCardsList;
