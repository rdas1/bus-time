import React, { FC, useEffect, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { DirectionsBusFilledRounded as BusIcon } from '@mui/icons-material';
import ReactDOMServer from 'react-dom/server';
import { Arrival, getPolylinesAlongRoute } from '../BusStopDashboard/BusStopDashboard';
import { createStationIcon } from '../MapWidget/MapWidget';
import { getRouteColor } from '../../utils/routeColors';

const tileLayerUrl = `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${process.env.REACT_APP_STADIA_MAPS_API_KEY}`;
const tileLayerAttribution = `'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'`;

export const createLabeledBusIcon = (routeShortName: string): L.DivIcon => {
  const color = getRouteColor(routeShortName);
  const busIconHtml = ReactDOMServer.renderToString(
    <BusIcon style={{ color, fontSize: '24px', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
  );
  return L.divIcon({
    className: '',
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;gap:1px;">
        <div style="background:${color};color:white;font-size:10px;font-weight:bold;
                    font-family:Helvetica,Arial,sans-serif;padding:1px 4px;
                    border-radius:3px;white-space:nowrap;
                    box-shadow:0 1px 3px rgba(0,0,0,0.5);">${routeShortName}</div>
        ${busIconHtml}
      </div>`,
    iconSize: [40, 36],
    iconAnchor: [20, 36],
  });
};

const MapBoundsSetter: FC<{ positions: LatLngTuple[] }> = ({ positions }) => {
  const map = useMap();
  const hasFit = useRef(false);
  useEffect(() => {
    if (!hasFit.current && positions.length > 0) {
      map.fitBounds(L.latLngBounds(positions), { padding: [40, 40] });
      hasFit.current = true;
    }
  }, [positions, map]);
  return null;
};

interface DashboardMapProps {
  stopMonitoringData: Record<string, Arrival[]>;
  stationPosition?: [number, number];
}

const ANIM_DURATION = 1500; // ms

const DashboardMap: FC<DashboardMapProps> = ({ stopMonitoringData, stationPosition }) => {
  const [routePolylines, setRoutePolylines] = useState<Record<string, LatLngTuple[][]>>({});

  const [displayPositions, setDisplayPositions] = useState<Record<string, LatLngTuple>>({});
  const displayPositionsRef = useRef<Record<string, LatLngTuple>>({});
  const animFromRef = useRef<Record<string, LatLngTuple>>({});
  const animStartRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const missingRoutes = Object.keys(stopMonitoringData).filter(r => !routePolylines[r]);
    if (missingRoutes.length === 0) return;
    Promise.all(missingRoutes.map(async id => ({ id, poly: await getPolylinesAlongRoute(id) })))
      .then(results => setRoutePolylines(prev => {
        const next = { ...prev };
        results.forEach(({ id, poly }) => { if (poly) next[id] = poly as LatLngTuple[][]; });
        return next;
      }));
  }, [stopMonitoringData]); // intentionally excludes routePolylines to avoid infinite loop

  useEffect(() => {
    const targets: Record<string, LatLngTuple> = {};
    Object.entries(stopMonitoringData).forEach(([routeName, arrivals]) => {
      arrivals.forEach((arrival, i) => {
        targets[`${routeName}-${i}`] = [arrival.vehicleLat, arrival.vehicleLon];
      });
    });

    animFromRef.current = { ...displayPositionsRef.current };
    Object.entries(targets).forEach(([key, pos]) => {
      if (!animFromRef.current[key]) animFromRef.current[key] = pos;
    });

    if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    animStartRef.current = performance.now();

    const animate = (now: number) => {
      const t = Math.min((now - animStartRef.current) / ANIM_DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3); // cubic ease-out

      const interpolated: Record<string, LatLngTuple> = {};
      Object.entries(targets).forEach(([key, target]) => {
        const from = animFromRef.current[key] ?? target;
        interpolated[key] = [
          from[0] + (target[0] - from[0]) * eased,
          from[1] + (target[1] - from[1]) * eased,
        ];
      });

      displayPositionsRef.current = interpolated;
      setDisplayPositions({ ...interpolated });

      if (t < 1) animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => { if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current); };
  }, [stopMonitoringData]);

  const allPositions: LatLngTuple[] = [
    ...(stationPosition ? [stationPosition as LatLngTuple] : []),
    ...Object.values(stopMonitoringData).flat().map(
      a => [a.vehicleLat, a.vehicleLon] as LatLngTuple
    ),
  ];

  return (
    <Box h="100%" w="100%">
      <MapContainer
        center={stationPosition ?? [40.7580, -73.9855]}
        zoom={14}
        zoomControl={true}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tileLayerUrl} attribution={tileLayerAttribution} />
        {stationPosition && (
          <Marker position={stationPosition} icon={createStationIcon()}>
            <Popup>Your stop</Popup>
          </Marker>
        )}
        {Object.entries(stopMonitoringData).map(([routeName, arrivals]) =>
          arrivals.map((arrival, i) => {
            const key = `${routeName}-${i}`;
            const pos = displayPositions[key] ?? [arrival.vehicleLat, arrival.vehicleLon];
            return (
              <Marker key={key} position={pos} icon={createLabeledBusIcon(routeName)}>
                <Popup>{routeName} — {arrival.destination}</Popup>
              </Marker>
            );
          })
        )}
        {Object.entries(routePolylines).flatMap(([routeId, segments]) =>
          segments.map((seg, i) => (
            <Polyline key={`${routeId}-${i}`} positions={seg} color={getRouteColor(routeId)} weight={2} opacity={0.6} />
          ))
        )}
        <MapBoundsSetter positions={allPositions} />
      </MapContainer>
    </Box>
  );
};

export default DashboardMap;
