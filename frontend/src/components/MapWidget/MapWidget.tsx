import React, { FC, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { DirectionsBusFilledRounded as BusIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer for rendering to string
import { Arrival } from '../BusStopDashboard/BusStopDashboard';

const createCustomIcon = (icon: React.ReactNode, color: string) => {
  const iconElement = ReactDOMServer.renderToString(
    <div style={{ color: color, fontSize: '24px' }}>{icon}</div>
  );

  return L.divIcon({
    className: 'custom-icon',
    html: iconElement,
    iconSize: [30, 30], // Adjust size as needed
    iconAnchor: [15, 30], // Center the icon
  });
};

interface MapWidgetProps {
  stationPosition?: [number, number];
  arrivalsAlongRoute?: Arrival[];
}

const tileLayerUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAPS_API_KEY}`;
const tileLayerAttribution = `'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'`;

const getBusPosition = (arrivalsAlongRoute: Arrival[]) => {
  const nextBus = arrivalsAlongRoute[0];
  if (!nextBus) return [40.7128, -74.006] as LatLngTuple;
  return [nextBus.vehicleLat, nextBus.vehicleLon] as LatLngTuple;
};

const MapBoundsSetter: FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [positions, map]);

  return null;
};

const MapWidget: FC<MapWidgetProps> = ({ stationPosition = [40.7128, -74.006], arrivalsAlongRoute = [] }) => {
  const busPosition = getBusPosition(arrivalsAlongRoute);

  // Collect positions for both the station and bus to set bounds
  const positions: LatLngTuple[] = [stationPosition, busPosition];

  return (
    <Box h={72}>
      <MapContainer center={stationPosition} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        <Marker position={stationPosition} icon={createCustomIcon(<MyLocationIcon />, 'blue')}>
          <Popup>The station</Popup>
        </Marker>
        <Marker position={busPosition} icon={createCustomIcon(<BusIcon />, 'red')}>
          <Popup>The bus</Popup>
        </Marker>
        <MapBoundsSetter positions={positions} />
      </MapContainer>
    </Box>
  );
};

export default MapWidget;
