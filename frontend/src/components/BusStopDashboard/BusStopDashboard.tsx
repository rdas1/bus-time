import {Box, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import styles from './BusStopDashboard.module.scss';
import { useParams } from 'react-router-dom';
import StopLabel from '../StopLabel/StopLabel';
import StopCardsList from '../StopCardsList/StopCardsList';
import LaterArrivalsSection from '../LaterArrivalsSection/LaterArrivalsSection';
import AlertsSection from '../AlertsSection/AlertsSection';
import axios from 'axios';

interface BusStopDashboardProps {
  stopcode?: string; // Prop for the stopcode
  preopenedRoute?: string; // Optional prop for the preopened route
  // name?: string;     // Optional prop for the stop name
  // direction?: string; // I think the database will take care of this, but will have to see
}

export interface StopInfo {
  id: string;
  name: string;
  routes: RouteInfo[];
  lat?: number;
  lon?: number;
}

export interface RouteInfo {
  id: string;
  longName: string; // e.g. Inwood - Harlem
  shortName: string; // e.g. M100
  description: string; // e.g. "via Third Av / Lexington Av / Amsterdam Av"
  destination: string; // e.g. Inwood (need to derive from longName)
  // stops?: StopInfo[]; // something like this?
  // alerts?: AlertInfo[]; // something like this?
  // direction: number; 
}


export interface Arrival {
  route: string;
  directionRef: string;
  destination: string;
  arrivalTime: string;
  stopsAway: number;
  distanceAwayMeters: number;
  vehicleLat: number;
  vehicleLon: number;
  numberOfStopsAway: number;
}


export const getStopName = (stopcode: string): string => {
  // Mock function to get the stop name based on the stop code
  // TODO: update later with actual API call / config data read
  return "West 125th St & 5th Ave";
}

export const getStopInfo = async (stopcode: string): Promise<any> => {
  const apiBaseUrl = "http://127.0.0.1:5000"; // For local testing
  try {
    const response = await axios.get(`${apiBaseUrl}/api/stop/${stopcode}/info`);
    return response.data.data; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching stop info:", error);
    throw error; // Rethrow for further handling if needed
  }
};

export const getStopMonitoring = async (stopcode: string): Promise<any> => {
  const apiBaseUrl = "http://127.0.0.1:5000"; // For local testing
  try {
    const response = await axios.get(`${apiBaseUrl}/api/stop/${stopcode}/arrivals`);
    console.log("response.data: ", response.data);
    return response.data.Siri; // Axios automatically parses JSON
  } catch (error) {
    console.error("Error fetching stop info:", error);
    throw error; // Rethrow for further handling if needed
  }
};

const parseStopInfo = (stopInfoApiResponse): StopInfo => {
  return {
    id: stopInfoApiResponse.id,
    name: stopInfoApiResponse.name,
    routes: parseRoutes(stopInfoApiResponse.routes),
    lat: stopInfoApiResponse.lat,
    lon: stopInfoApiResponse.lon,
  };
}

const parseRoutes = (routesData: any): RouteInfo[] => {
  // routesData = Object.values(routesData) || [];
  routesData = (routesData as any[]) || [];
  console.log("inside parseRoutes, routesData:", routesData);
  if (routesData[0] === undefined) { // TODO: check if this is the correct way to check if the array is empty
    return [] as RouteInfo[]; 
  }
  return routesData.map((route: any) => {
    return {
      id: route.id,
      longName: route.longName,
      shortName: route.shortName,
      description: route.description,
      destination: route.longName.split(" - ")[1], // TODO: check if this is the correct way to get the destination
    };
  })
}

export const getMinutesAway = (arrivalTimeString: string): number => {
  // Parse the arrival time string to a Date object
  const arrivalTime = new Date(arrivalTimeString);
  const currentTime = new Date();

  // Calculate the difference in milliseconds
  const differenceInMs = arrivalTime.getTime() - currentTime.getTime();

  // Convert the difference from milliseconds to minutes
  const differenceInMinutes = Math.round(differenceInMs / 1000 / 60); // TODO: figure out why this is negative sometimes

  return differenceInMinutes;
};

const parseStopMonitoringResponse = (apiData): Record<string, Arrival[]> => {
  if (apiData.ServiceDelivery === undefined) {
    console.warn("Invalid API data: Missing ServiceDelivery field.");
    return {};
  }
  const monitoredVehicleJourneys: any[] = apiData.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;
  // console.log(monitoredVehicleJourneys);
  const semiParsed: Arrival[] = monitoredVehicleJourneys.map((journey: any) => {
    return {
      route: journey.MonitoredVehicleJourney.PublishedLineName[0],
      directionRef: journey.MonitoredVehicleJourney.DirectionRef,
      destination: journey.MonitoredVehicleJourney.DestinationName[0],
      arrivalTime: journey.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime,
      stopsAway: journey.MonitoredVehicleJourney.MonitoredCall.NumberOfStopsAway,
      distanceAwayMeters: journey.MonitoredVehicleJourney.MonitoredCall.DistanceFromStop,
      vehicleLat: journey.MonitoredVehicleJourney.VehicleLocation.Latitude,
      vehicleLon: journey.MonitoredVehicleJourney.VehicleLocation.Longitude,
      numberOfStopsAway: journey.MonitoredVehicleJourney.MonitoredCall.NumberOfStopsAway,
      // TODO: Get SituationRef and check for alerts
      // TODO: Grab other fields as needed
    };
  });
  // Group and sort by route
  const parsed = semiParsed.reduce((groupByRoute, journey) => {
    const route = journey.route;
    
    if (!groupByRoute[route]) {
      groupByRoute[route] = [];
    }

    groupByRoute[route].push(journey);

    // Sort each route's journeys by arrivalTime
    groupByRoute[route].sort((a, b) => new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime());

    return groupByRoute;
  }, {} as Record<string, Arrival[]>);

  // console.log(parsed);
  return parsed;
}

const BusStopDashboard: React.FC<BusStopDashboardProps> = ({ stopcode, preopenedRoute }) => {

  const [stopInfo, setStopInfo] = useState<StopInfo>({} as StopInfo);
  // const [stopName, setStopName] = useState<string | null>("Loading...");
  // const [routes, setRoutes] = useState<RouteInfo[]>([]);
  const [stopMonitoringData, setStopMonitoringData] = useState<Record<string, Arrival[]>>({} as Record<string, Arrival[]>);

  // Use the stopcode from props or fallback to a default value
  const stopCodeToUse = stopcode || "402506";

  // Fetch stop info when the component mounts
  useEffect(() => {
    const fetchStopInfo = async () => {
      try {
        const data = await getStopInfo(stopCodeToUse);
        setStopInfo(parseStopInfo(data));
        // console.log("(data.routes as any[]).length: ", (data.routes as any[]).length);
        // console.log("data.routes[0]: ", data.routes[0]);
        // // console.log("data.routes values: ", Object.values(data.routes));
        // // console.log("data")
        // setStopName(data.name); // Set stop name in state // sTODO: Format stop name nicely
        // setRoutes(parseRoutes(data.routes as any[])); // Set routes in state if available
      } catch (error) {
        console.error("Failed to fetch stop info:", error);
      }
    };

    fetchStopInfo();
  }, [stopCodeToUse]); // Only re-run this effect if stopCodeToUse changes

  useEffect(() => {
    const fetchStopMonitoringData = async () => {
      console.log("Fetching arrivals data...")
      try {
        const data = await getStopMonitoring(stopCodeToUse);
        setStopMonitoringData(parseStopMonitoringResponse(data));
      } catch (error) {
        console.error("Failed to fetch stop monitoring data:", error);
      }
    };

    // Call immediately, then every 30 seconds
    fetchStopMonitoringData();
    const intervalId = setInterval(fetchStopMonitoringData, 30000);

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, [stopCodeToUse]);

  console.warn("stopInfo: ", stopInfo);
  return (
    <Box className={styles.container}>
      <StopLabel name={stopInfo.name}></StopLabel>
      <StopCardsList routes={stopInfo.routes} arrivalsData={stopMonitoringData} preopenedRoute={preopenedRoute} stopInfo={stopInfo}></StopCardsList>
      <LaterArrivalsSection routes={stopInfo.routes} arrivalsData={stopMonitoringData}></LaterArrivalsSection>
      <AlertsSection routes={stopInfo.routes} arrivalsData={stopMonitoringData}></AlertsSection>
    </Box>
  );
};

export default BusStopDashboard;
