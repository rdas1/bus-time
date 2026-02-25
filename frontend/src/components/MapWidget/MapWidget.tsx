import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import 'leaflet-polylinedecorator';
import { MyLocation as MyLocationIcon } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server'; // Import ReactDOMServer for rendering to string
import { Arrival, getPolylinesAlongRoute } from '../BusStopDashboard/BusStopDashboard';
import { createLabeledBusIcon } from '../DashboardMap/DashboardMap';
import { getRouteColor } from '../../utils/routeColors';

// const getStopLocationsAlongRoute = async (routeId: string) => {

// }

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
  const hasFit = useRef(false);

  useEffect(() => {
    if (!hasFit.current && positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [30, 30] });
      hasFit.current = true;
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

const ANIM_DURATION = 1500; // ms

const MapWidget: FC<MapWidgetProps> = ({ stationPosition = [40.7128, -74.006], arrivalsAlongRoute = [] }) => {

  const route = arrivalsAlongRoute[0]?.route;
  const [routePolyline, setRoutePolyline] = useState<LatLngTuple[][]>([]);

  useEffect(() => {
    const fetchPolyline = async () => {
      const polyline = await getPolylinesAlongRoute(route);
      if (polyline) setRoutePolyline(polyline as LatLngTuple[][]);
    };

    fetchPolyline();
  }, [route]);

  const [displayPositions, setDisplayPositions] = useState<LatLngTuple[]>([]);
  const displayPositionsRef = useRef<LatLngTuple[]>([]);
  const animFromRef = useRef<LatLngTuple[]>([]);
  const animStartRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const targets = arrivalsAlongRoute.map(
      a => [a.vehicleLat, a.vehicleLon] as LatLngTuple
    );

    // For new indices with no prior position, start at target (no animation from arbitrary origin)
    animFromRef.current = targets.map((target, i) => displayPositionsRef.current[i] ?? target);

    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    animStartRef.current = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - animStartRef.current) / ANIM_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out

      const interpolated: LatLngTuple[] = targets.map((target, i) => {
        const from = animFromRef.current[i] ?? target;
        return [
          from[0] + (target[0] - from[0]) * eased,
          from[1] + (target[1] - from[1]) * eased,
        ];
      });

      displayPositionsRef.current = interpolated;
      setDisplayPositions([...interpolated]);

      if (t < 1) animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current); };
  }, [arrivalsAlongRoute]);

  // Raw positions for bounds-fitting — must not use animated positions or the
  // map re-fits on every animation frame (~60fps).
  const rawNextBusPosition = arrivalsAlongRoute[0]
    ? [arrivalsAlongRoute[0].vehicleLat, arrivalsAlongRoute[0].vehicleLon] as LatLngTuple
    : stationPosition as LatLngTuple;
  const stationAndBusPositions: LatLngTuple[] = [stationPosition, rawNextBusPosition];

  return (
    <Box h={72}>
      <MapContainer center={stationPosition} zoomControl={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        <Marker position={stationPosition} icon={createStationIcon()}>
          <Popup>The station</Popup>
        </Marker>
        {arrivalsAlongRoute.map((arrival, index) => {
          const pos = displayPositions[index] ?? [arrival.vehicleLat, arrival.vehicleLon] as LatLngTuple;
          return (
            <Marker key={index} position={pos} icon={createLabeledBusIcon(arrival.route)}>
              {/* <Popup>The bus</Popup> */}
            </Marker>
          );
        })}
        <MapBoundsSetter positions={stationAndBusPositions} />
        {routePolyline.map((seg, i) => (
          <Polyline key={i} positions={seg} color={getRouteColor(route)} weight={2} opacity={0.7} />
        ))}
        {/* <RoutePolyline routeId={route} /> */}
      </MapContainer>
    </Box>
  );
};

export default MapWidget;
