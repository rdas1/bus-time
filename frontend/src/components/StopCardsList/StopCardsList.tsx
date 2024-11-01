import React, { FC } from 'react';
import styles from './StopCardsList.module.scss';
import { Box } from '@chakra-ui/react';
import StopCard from '../StopCard/StopCard';
import { Arrival, RouteInfo } from '../BusStopDashboard/BusStopDashboard';

interface StopCardsListProps {
  routes?: RouteInfo[];
  arrivalsData?: Record<string, Arrival[]>;
  preopenedRoute?: string;
}

const StopCardsList: FC<StopCardsListProps> = ({routes, arrivalsData, preopenedRoute}) => {
  routes = routes || [] as RouteInfo[];
  preopenedRoute = (preopenedRoute || "").toLocaleLowerCase();
  arrivalsData = arrivalsData || {};
  return (
    <Box className={styles.routes} px={2}>
      {routes.map((routeInfo, index) => (
        <StopCard key={index} route={routeInfo} arrivalsAlongRoute={arrivalsData[routeInfo.shortName] || [] as Arrival[]} preOpened={routeInfo.shortName.toLocaleLowerCase() === preopenedRoute}></StopCard>
      ))}
    </Box>
  );
}

export default StopCardsList;
