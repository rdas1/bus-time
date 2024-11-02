import React, { FC } from 'react';
import styles from './MapWidget.module.scss';
import { Box, Text } from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet'
import L, { LatLngTuple } from 'leaflet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBus, faTrain } from '@fortawesome/free-solid-svg-icons'; // adjust according to the icons you need
import { Arrival } from '../BusStopDashboard/BusStopDashboard';

// Create custom marker icons using Leaflet Awesome Markers
const createStationIcon = () => {
  return L.AwesomeMarkers.icon({
    icon: 'home',
    markerColor: 'blue', // Choose your color
    prefix: 'fa', // Use Font Awesome icons
  });
};

const createBusIcon = () => {
  return L.AwesomeMarkers.icon({
    icon: 'bus',
    markerColor: 'red', // Choose your color
    prefix: 'fa', // Use Font Awesome icons
  });
};

  // // Create a semi-transparent bus icon
  // var busIcon = L.IconMaterial.icon({
  //   icon: 'directions_bus',            // Name of Material icon
  //   iconColor: '#aa2187',              // Material icon color (could be rgba, hex, html name...)
  //   markerColor: 'rgba(255,0,0,0.5)',  // Marker fill color
  //   outlineColor: 'yellow',            // Marker outline color
  //   outlineWidth: 1,                   // Marker outline width 
  //   iconSize: [31, 42]                 // Width and height of the icon
  // })

interface MapWidgetProps {
  stationPosition?: [number, number];
  arrivalsAlongRoute?: Arrival[];
  zoom?: number;
}

const tileLayerUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAPS_API_KEY}`;
const tileLayerAttribution = `'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'`

const getBusPosition = (arrivalsAlongRoute: Arrival[]) => {
  const nextBus = arrivalsAlongRoute[0];
  if (!nextBus) return [40.7128, -74.006] as LatLngTuple;
  return [nextBus.vehicleLat, nextBus.vehicleLon] as LatLngTuple;
  // return arrivalsAlongRoute[0].map((arrival) => [arrival.vehicleLat, arrival.vehicleLon]);
}

const MapWidget: FC<MapWidgetProps> = ({ stationPosition = [40.7128, -74.006], arrivalsAlongRoute = [] as Arrival[], zoom = 13 }) => {
  const busPosition = getBusPosition(arrivalsAlongRoute);
  console.log("busPosition", busPosition);
  return (
    <Box h={72}>
      <MapContainer center={stationPosition} zoom={zoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url={tileLayerUrl}
            attribution={tileLayerAttribution}
          />
          <Marker position={stationPosition} icon={createStationIcon()}>
            <Popup>The station</Popup>
          </Marker>
          <Marker position={busPosition} icon={createBusIcon()}>
            <Popup>The bus</Popup>
          </Marker>
        </MapContainer>
    </Box>
   );
};

export default MapWidget;
