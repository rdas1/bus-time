import React, { FC, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet-polylinedecorator';
import { DirectionsBusFilledRounded as BusIcon, MyLocation as MyLocationIcon } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer for rendering to string
import { Arrival, getPolylinesAlongRoute } from '../BusStopDashboard/BusStopDashboard';

// const getStopLocationsAlongRoute = async (routeId: string) => {

// }

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

// Create custom marker icons using Leaflet Awesome Markers
export const createStationIcon = (color: string = "black") => {
  const iconElement = ReactDOMServer.renderToString(
    <div style={{ color: color, fontSize: '24px' }}>{<MyLocationIcon/>}</div>
  );
  return L.AwesomeMarkers.icon({
    markerColor: 'blue', // Choose your color
    prefix: 'fa', // Use Font Awesome icons
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

const getBusPositions = (arrivalsAlongRoute: Arrival[]) => {
  let positions = arrivalsAlongRoute.map((arrival) => [arrival.vehicleLat, arrival.vehicleLon] as LatLngTuple);
  return positions || [[40.7128, -74.006]];
};

const MapBoundsSetter: FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
  const map = useMap();

  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [positions, map]);

  return null;
};

function PolylineDecorator({ patterns, polyline,color }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;

   L.polyline(polyline, {color}).addTo(map);  // added color property
    L.polylineDecorator(polyline, {
      patterns,
      
    }).addTo(map);
  }, [map]);
 
  return null;
}

// // Polyline component to display the route with arrows
// const RoutePolyline: FC<{ routeId: string }> = ({ routeId }) => {
//   const map = useMap();
//   const [polyline, setPolyline] = React.useState<LatLngTuple[]>([]);

//   useEffect(() => {
//     const fetchPolyline = async () => {
//       const latlngs = await getPolylinesAlongRoute(routeId);
//       setPolyline(latlngs ?? []);
//       // map.fitBounds(latlngs); // Fit the map to show the polyline
//     };
//     fetchPolyline();
//   }, [routeId, map]);

//   useEffect(() => {
//     if (polyline.length > 0) {
//       const decorator = L.polylineDecorator(L.polyline(polyline), {
//         patterns: [
//           {
//             offset: '100%',
//             repeat: 50,
//             symbol: L.arrowHead({
//               pixelSize: 10,
//               polygon: false,
//               pathOptions: { stroke: true, color: 'blue' },
//             }),
//           },
//         ],
//       });
//       decorator.addTo(map);
//     }
//   }, [polyline, map]);

//   return polyline.length > 0 ? <Polyline positions={polyline} color="blue" /> : null;
// };

const MapWidget: FC<MapWidgetProps> = ({ stationPosition = [40.7128, -74.006], arrivalsAlongRoute = [] }) => {

  const route = arrivalsAlongRoute[0]?.route;
  const [routePolyline, setRoutePolyline] = useState<LatLngTuple[]>([]);

  useEffect(() => {
    const fetchPolyline = async () => {
      const polyline = await getPolylinesAlongRoute(route);
      setRoutePolyline(polyline);
    };

    fetchPolyline();
  }, [route]);

  const busPositions = getBusPositions(arrivalsAlongRoute);

  const nextBusPosition = busPositions[0];
  // Collect positions for both the station and bus to set bounds
  const stationAndBusPositions: LatLngTuple[] = [stationPosition, nextBusPosition];

  return (
    <Box h={72}>
      <MapContainer center={stationPosition} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        <Marker position={stationPosition} icon={createStationIcon()}>
          <Popup>The station</Popup>
        </Marker>
        {/* <Marker position={nextBusPosition} icon={createCustomIcon(<BusIcon />, 'red')}>
          <Popup>The next bus</Popup>
        </Marker> */}
        {busPositions.map((position, index) => (
          <Marker key={index} position={position} icon={createCustomIcon(<BusIcon />, 'red')}>
            {/* <Popup>The bus</Popup> */}
          </Marker>
        ))}
        <MapBoundsSetter positions={stationAndBusPositions} />
        {routePolyline && (
          <Polyline positions={routePolyline} color="blue" weight={2} opacity={0.7} />
        )}
        {/* <RoutePolyline routeId={route} /> */}
      </MapContainer>
    </Box>
  );
};

export default MapWidget;
